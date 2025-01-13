<script lang="ts">
    import { onMount, tick } from "svelte";

    const wordEndpoint = "https://random-word-api.herokuapp.com/word";
    const definitionEndpoint = "https://api.dictionaryapi.dev/api/v2/entries/en/";

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    let maxLength = 0;
    let password = "";

    async function fetchData() {
        const fetchedWord = await fetch(wordEndpoint);
        const stringWord: string = await fetchedWord.json();

        const fetchedDefinition = await fetch(definitionEndpoint + stringWord);
        const definitionArray: unknown = await fetchedDefinition.json();
        const stringDefinition: string | null = definitionArray instanceof Array ? definitionArray[0].meanings[0].definitions[0].definition : null;     // If no definition the API returns an object with an error message instead of an array, clever way to check if the definition is null

        return [stringWord, stringDefinition];
    }


    // IDEA FOR THE ALGORITHM:
    // fetch all words normally
    // then keep fetching the password until all letters of the fetched password are in the crossword in the right count
    // if more letter instances in the crossword randomize which to mark with number, else mark the only available one

    async function getPassword() {
        let [word, _] = await fetchData();
        while (word == null) {
            [word, _] = await fetchData();
        }
        return word[0] as string;
    }


    async function getWord() {
        let [word, definition] = await fetchData();
        while (word == null || definition == null) {
            [word, definition] = await fetchData();
        }

        return [word[0] as string, definition as string];
    }


    async function getSeven() {
        const words = [];
        for (let i = 0; i < 7; i++) {
            const word = await getWord();
            words.push(word);
            if (word[0].length > maxLength) {
                maxLength = word[0].length;
            }
        }
        return words;
    }


    function checkFilledRow(input: HTMLInputElement) {
        if (input.parentElement) {
            const inputs = input.parentElement.querySelectorAll(".crossword-input") as NodeListOf<HTMLInputElement>;
            for (let i = 0; i < inputs.length; i++) {
                if (inputs[i].value.length <= 0) {
                    return false;
                }
            }
            return true;
        }
        else return false;
    }


    function checkCorrectRow(input: HTMLInputElement) {
        if (input.parentElement) {
            const inputs = input.parentElement.querySelectorAll(".crossword-input") as NodeListOf<HTMLInputElement>;
            for (let i = 0; i < inputs.length; i++) {
                if (inputs[i].value.toUpperCase() != inputs[i].dataset.letter) {
                    return false;
                }
            }
            return true;
        }
        else return false;
    }


    function setSuccess(input: HTMLInputElement) {
        if (input.parentElement) {
            const inputs = input.parentElement.getElementsByTagName("input");
            for (let i = 0; i < inputs.length; i++) {
                inputs[i].style.backgroundColor = "rgba(0, 255, 196, 0.5)";
                inputs[i].readOnly = true;
            }
        }
    }


    function checkLetterExisting(button: HTMLButtonElement, letter: string) {
        const inputs = document.querySelectorAll(".crossword-input") as NodeListOf<HTMLInputElement>;
        const lettersInWords = new Set<string>();
        for (let i = 0; i < inputs.length; i++) {
            lettersInWords.add(inputs[i].dataset.letter ?? "");
        }

        if (!lettersInWords.has(letter)) {
            // console.log(`Letter ${letter} not in words`);
            button.disabled = true;
            button.classList.remove("bg-violet-500");
            button.classList.add("bg-neutral-900");
            button.style.opacity = "0.5";
        }
    }


    function letterPress(letter: string, button: HTMLButtonElement) {
        const inputs = document.querySelectorAll(".crossword-input") as NodeListOf<HTMLInputElement>;
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].dataset.letter == letter) {
                inputs[i].value = letter;
                inputs[i].readOnly = true;
            }
        }
        button.classList.remove("bg-violet-500");
        button.classList.add("bg-neutral-900");
        button.disabled = true;
        checkAllLettersVisible();
    }


    function checkAllLettersVisible() {
        const buttons = document.querySelectorAll(".alphabet-button") as NodeListOf<HTMLButtonElement>;
        buttons.forEach(button => {
            const letter = button.textContent as string;
            const inputs = document.querySelectorAll(`.crossword-input[data-letter="${letter}"]`) as NodeListOf<HTMLInputElement>;
            let allVisible = true;
            inputs.forEach(input => {
                if (input.value.toUpperCase() !== letter) {
                    allVisible = false;
                }
            });
            if (allVisible) {
                button.disabled = true;
                button.classList.remove("bg-violet-500");
                button.classList.add("bg-neutral-900");
                button.style.opacity = "0.5";
            }
            else {
                button.disabled = false;
                button.classList.remove("bg-neutral-900");
                button.classList.add("bg-violet-500");
                button.style.opacity = "1";
            }
        });
    }


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
        <h1 class="text-white">Loading...</h1>
    </div>
{:then words}
    <div class="box-border flex items-start justify-center flex-col mb-4 gap-1 w-fit">
        {#each words as word, index}
            <div class="flex gap-1 items-center">
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
            <!-- For now, small test -->
            {#each Array(9) as _, i}
                <div class="relative">
                    <input class="w-10 h-10 text-center text-2xl bg-neutral-900 password-input" type="text" maxlength="1" readonly>
                    <span class="absolute bottom-1 left-1 text-xs text-neutral-400">{i + 1}</span>
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