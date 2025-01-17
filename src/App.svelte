<script lang="ts">
    import { onMount, tick } from "svelte";
    import { getSeven, generatePassword, maxLength } from "./Fetching";
    import { checkLetterExisting, checkAllLettersVisible, letterPress } from "./Letters";
    import { checkFilledRow, checkCorrectRow, setSuccess, checkPassword, uncoverRandomLetters, checkAllRowsCorrect, checkAllRowsFilled } from "./Words";
    import { startTimer, stopTimer, timeTaken } from "./Timer";

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    let showWinMessage = false;

    // Returns a pure list of crossword's words
    export function stripDefinition(array: Array<Array<string>>) {
        return array.map(word => word[0]);
    }

    // Focuses on the next available input field
    function focusNextInput(current: HTMLInputElement, direction: 'next' | 'previous') {
        let nextElement: HTMLInputElement | null = null;
        if (direction === 'next') {
            nextElement = current.parentElement?.nextElementSibling?.querySelector('.crossword-input') as HTMLInputElement;
        } else {
            nextElement = current.parentElement?.previousElementSibling?.querySelector('.crossword-input') as HTMLInputElement;
        }
        while (nextElement && nextElement.readOnly) {
            if (direction === 'next') {
                nextElement = nextElement.parentElement?.nextElementSibling?.querySelector('.crossword-input') as HTMLInputElement;
            } else {
                nextElement = nextElement.parentElement?.previousElementSibling?.querySelector('.crossword-input') as HTMLInputElement;
            }
        }
        nextElement?.focus();
    }

    // Executes after the component is fully loaded
    onMount(() => {
        const buttons = document.querySelectorAll(".alphabet-button") as NodeListOf<HTMLButtonElement>;
        buttons.forEach(button => {
            checkLetterExisting(button, button.textContent as string);
        });
        checkAllLettersVisible();

        document.addEventListener("winMessage", () => {
            showWinMessage = true;
        });
    });

    function handleStopTimer() {
        if (stopTimer(checkAllRowsCorrect)) {
            showWinMessage = true;
        }
    }
</script>

<style>
    .win-animation {
        animation: spinAndFade ease-in 9s forwards;
    }

    @keyframes spinAndFade {
        0% {
            transform: rotate(0deg) scale(1);
            opacity: 1;
        }
        100% {
            transform: rotate(1080deg) scale(3);
            opacity: 0;
        }
    }

    .win-message {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2em;
        color: white;
        text-align: center;
        opacity: 0;
        animation: fadeIn 3s forwards;
        animation-delay: 6s;
        line-height: 1.2;
    }
    .win-message h1 {
        color: #5af04c;
        margin-bottom: 10px;
    }

    @keyframes fadeIn {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
</style>

<div class:win-animation={showWinMessage}>
    {#await getSeven()}
        <div class="box-border flex justify-center items-center">
            <h1 class="text-white">Fetching words...</h1>
        </div>
    {:then words}
        {#await generatePassword(stripDefinition(words))}
            <div class="box-border flex justify-center items-center">
                <h1 class="text-white">Generating password...</h1>
            </div>
        {:then {password, finalPositions}}
            <div class="box-border flex items-start justify-center flex-col mb-4 gap-1 w-fit">
                {#each words as word, index}
                    <div class="flex gap-1 items-center crossword-row">
                        <p class="text-white text-xl mr-3 w-5">{index+1}.</p>
                        {#each word[0] as letter}
                            <div class="relative">
                                <input class="w-10 h-10 text-center text-2xl bg-neutral-900 crossword-input"
                                    type="text"
                                    maxlength="1"
                                    autocapitalize="off"
                                    autocorrect="off"
                                    autocomplete="off"
                                    spellcheck="false"
                                    data-letter={letter.toUpperCase()}
                                    on:input={(e) => {
                                        const target = e.target as HTMLInputElement;
                                        target.value = target.value.toUpperCase();
                                        focusNextInput(target, 'next');
                                        checkAllLettersVisible();
                                        if (checkFilledRow(target)) {
                                            if (checkCorrectRow(target)) {
                                                setSuccess(target);
                                            }
                                            checkPassword();
                                        }
                                        if (checkAllRowsFilled() && checkAllRowsCorrect()) {
                                            handleStopTimer();
                                        }
                                    }}
                                    on:keydown={(e) => {
                                        const target = e.target as HTMLInputElement;
                                        if (e.key == "Backspace" && !target.readOnly) {
                                            target.value = "";
                                            target.focus();
                                        }
                                        else if (e.key == "ArrowLeft") {
                                            focusNextInput(target, 'previous');
                                        }
                                        else if (e.key == "ArrowRight") {
                                            focusNextInput(target, 'next');
                                        }
                                        else if (e.key == "ArrowUp") {
                                            ((target.parentElement?.parentElement?.previousElementSibling?.querySelector('.crossword-input') as HTMLInputElement)?.focus());
                                        }
                                        else if (e.key == "ArrowDown") {
                                            ((target.parentElement?.parentElement?.nextElementSibling?.querySelector('.crossword-input') as HTMLInputElement)?.focus());
                                        }
                                        checkAllLettersVisible();
                                    }}
                                >
                                <span class="absolute bottom-0 left-0 h-fit text-xs text-neutral-400"></span>
                            </div>
                        {/each}
                        {#each Array(maxLength - word[0].length) as _}
                            <div class="w-10 h-10 bg-neutral-950"></div>
                        {/each}
                    </div>
                {/each}
            </div>
            <div class="box-border flex justify-center items-center mb-4 gap-1 h-fit">
                <div class="flex gap-1 items-center border-violet-500 border-2 rounded-md p-1">
                    {#each password as letter, i}
                        <div class="relative">
                            <input class="w-10 h-10 text-center text-2xl bg-neutral-900 password-input" type="text" maxlength="1" data-letter="{letter}" readonly placeholder="{letter.toUpperCase()}">
                            <span class="absolute bottom-0 left-0 h-fit text-xs text-neutral-400">{i+1}</span>
                        </div>
                    {/each}
                </div>
            </div>
            <div class="box-border flex justify-center items-center mb-4 gap-1 h-fit flex-wrap">
                {#each alphabet as letter}
                    <button id="button-letter-{letter}" class="w-6 h-8 bg-violet-500 text-white alphabet-button" on:click={(event) => letterPress(letter, event.currentTarget as HTMLButtonElement)}><p class="w-full h-full flex justify-center items-center text-center">{letter}</p></button>
                {/each}
            </div>
            <div class="box-border flex justify-center items-start flex-col gap-1">
                {#each words as wordDef, index}
                    <p class="text-white text-left">{index+1}. {wordDef[1]}</p>
                {/each}
            </div>
            {#each alphabet as letter}
                {#await tick()}
                    {checkLetterExisting(document.getElementById(`button-letter-${letter}`) as HTMLButtonElement, letter)}
                {/await}
            {/each}
            {#await tick()}
                {finalPositions.forEach(position => {
                    // array [i][j] where i is the row and j is the column
                    const inputs: HTMLInputElement[][] = Array.from(document.querySelectorAll('.crossword-row')).map(row => Array.from(row.querySelectorAll('.crossword-input')));
                    position.forEach((arr) => {
                        // add little numbers like in password fields - the numbers are arr[2]
                        const inputElement = inputs[arr[0]][arr[1]];
                        if (inputElement.parentElement) {
                            const spanElement = inputElement.parentElement.querySelector('span');
                            if (spanElement) {
                                spanElement.textContent = `${arr[2]}`;
                                const passwordInputs = document.querySelectorAll('.password-input');
                            }
                        }
                    });
                })}
                {uncoverRandomLetters()}
                {checkAllLettersVisible()}
                {startTimer()}
            {/await}
        {/await}
        {:catch}
            <div class="box-border flex justify-center items-center">
                <h1 class="text-white">An error occurred while fetching the words.</h1>
            </div>
    {/await}
</div>

{#if showWinMessage}
    <div class="win-message">
        <h1>Congratulations!</h1>
        <p>You solved the crossword in {timeTaken}!</p>
    </div>
{/if}