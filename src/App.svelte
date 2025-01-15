<script lang="ts">
    import { onMount, tick } from "svelte";
    import { getSeven, generatePassword, maxLength } from "./Fetching";
    import { checkLetterExisting, checkAllLettersVisible, letterPress } from "./Letters";
    import { checkFilledRow, checkCorrectRow, setSuccess } from "./Words";

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    // IDEA FOR THE ALGORITHM:
    // fetch all words normally
    // then keep fetching the password until all letters of the fetched password are in the crossword in the right count
    // if more letter instances in the crossword randomize which to mark with number, else mark the only available one

    // Returns a pure list of crossword's words
    export function stripDefinition(array: Array<Array<string>>) {
        return array.map(word => word[0]);
    }


    // Executes after the component is fully loaded
    onMount(() => {
        const buttons = document.querySelectorAll(".alphabet-button") as NodeListOf<HTMLButtonElement>;
        buttons.forEach(button => {
            checkLetterExisting(button, button.textContent as string);
        });
        checkAllLettersVisible();
    });
</script>


{#await getSeven()}
    <div class="box-border flex justify-center items-center">
        <h1 class="text-white">Fetching words...</h1>
    </div>
{:then words}
    {#await generatePassword(stripDefinition(words))}
        <div class="box-border flex justify-center items-center">
            <h1 class="text-white">Generating password...</h1>
        </div>
    {:then password}
        <div class="box-border flex items-start justify-center flex-col mb-4 gap-1 w-fit">
            {#each words as word, index}
                <div class="flex gap-1 items-center crossword-row">
                    <p class="text-white text-xl mr-3 w-5">{index+1}.</p>
                    {#each word[0] as letter}
                        <input class="w-10 h-10 text-center text-2xl bg-neutral-900 crossword-input"
                            type="text"
                            maxlength="1"
                            autocapitalize="off"
                            autocorrect="off"
                            autocomplete="off"
                            spellcheck="false"
                            data-letter={letter.toUpperCase()}
                            on:input={(e) => {
                                ((e.target as HTMLInputElement).nextElementSibling as HTMLInputElement)?.focus();
                                checkAllLettersVisible();
                            }}
                            on:keydown={(e) => {
                                // Gotta love TypeScript inside HTML inside Svelte
                                if (e.key == "Backspace" && !(e.target as HTMLInputElement).readOnly) {
                                    (e.target as HTMLInputElement).value = "";
                                    (e.target as HTMLInputElement).focus();
                                }
                                else if (e.key == "Enter"
                                    && e.target
                                    && checkFilledRow(e.target as HTMLInputElement)
                                ) {
                                    if (checkCorrectRow(e.target as HTMLInputElement)) {
                                        setSuccess(e.target as HTMLInputElement);
                                    }
                                    ((e.target as HTMLInputElement).parentElement?.nextElementSibling?.children[1] as HTMLInputElement)?.focus();
                                }
                                else if (e.key == "ArrowLeft") {
                                    ((e.target as HTMLInputElement).previousElementSibling as HTMLInputElement)?.focus();
                                }
                                else if (e.key == "ArrowRight") {
                                    ((e.target as HTMLInputElement).nextElementSibling as HTMLInputElement)?.focus();
                                }
                                else if (e.key == "ArrowUp") {
                                    ((e.target as HTMLInputElement).parentElement?.previousElementSibling?.children[1] as HTMLInputElement)?.focus();
                                }
                                else if (e.key == "ArrowDown") {
                                    ((e.target as HTMLInputElement).parentElement?.nextElementSibling?.children[1] as HTMLInputElement)?.focus();
                                }
                                checkAllLettersVisible();
                            }}
                        >
                    {/each}
                    {#each Array(maxLength - word[0].length) as _}
                        <div class="w-10 h-10 bg-neutral-950"></div>
                    {/each}
                </div>
            {/each}
        </div>
        <div class="box-border flex justify-center items-center mb-4 gap-1 h-fit">
            <div class="flex gap-1 items-center">
                {#each password as letter, i}
                    <div class="relative">
                        <!-- The placeholder is temporary -->
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
            <!-- That's cool -->
            {#await tick()}
                {checkLetterExisting(document.getElementById(`button-letter-${letter}`) as HTMLButtonElement, letter)}
            {/await}
        {/each}
    {/await}
{/await}