<script lang="ts">
    const wordEndpoint = "https://random-word-api.herokuapp.com/word";
    const definitionEndpoint = "https://api.dictionaryapi.dev/api/v2/entries/en/";

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    async function fetchData() {
        const fetchedWord = await fetch(wordEndpoint);
        const stringWord: string = await fetchedWord.json();

        const fetchedDefinition = await fetch(definitionEndpoint + stringWord);
        const definitionArray: unknown = await fetchedDefinition.json();
        const stringDefinition: string | null = definitionArray instanceof Array ? definitionArray[0].meanings[0].definitions[0].definition : null;     // If no definition the API returns an object with an error message instead of an array, clever way to check if the definition is null

        return [stringWord, stringDefinition];
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
            words.push(await getWord());
        }
        return words;
    }
    

    function checkFilledRow(input: HTMLInputElement) {
        if (input.parentElement) {
            const inputs = input.parentElement.getElementsByTagName("input");
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
            const inputs = input.parentElement.getElementsByTagName("input");
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


    function letterPress(letter: string, button: HTMLButtonElement) {
        const inputs = document.getElementsByTagName("input");
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].dataset.letter == letter) {
                inputs[i].value = letter;
                inputs[i].readOnly = true;
            }
        }
        button.classList.remove("bg-violet-500");
        button.classList.add("bg-neutral-900");
        button.disabled = true;     // untested
    }
</script>


{#await getSeven()}
    <div class="box-border flex justify-center items-center">
        <h1 class="text-white">Loading...</h1>
    </div>
{:then words}
    <div class="box-border flex items-start justify-center flex-col mb-4 gap-1 w-fit">
        {#each words as word, index}
            <div class="flex gap-1 items-center">
                <p class="text-white text-xl mr-3">{index+1}.</p>
                {#each word[0] as letter}
                    <input class="w-10 h-10 text-center text-2xl bg-neutral-900"
                        type="text"
                        maxlength="1"
                        autocapitalize="off"
                        autocorrect="off"
                        autocomplete="off"
                        spellcheck="false"
                        data-letter={letter.toUpperCase()}
                        on:input={(e) => ((e.target as HTMLInputElement).nextElementSibling as HTMLInputElement)?.focus()}
                        on:keydown={(e) => {
                            // Gotta love TypeScript inside HTML inside Svelte
                            if (e.key == "Backspace") {
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
                        }}
                    >
                {/each}
            </div>
        {/each}
    </div>
    <div class="box-border flex justify-center items-center mb-4 gap-1 h-fit">
        <div class="flex gap-1 items-center">
            <!-- For now, small test -->
            {#each Array(9) as _, i}
                <div class="relative">
                    <input class="w-10 h-10 text-center text-2xl bg-neutral-900" type="text" maxlength="1" readonly>
                    <span class="absolute bottom-1 left-1 text-xs text-neutral-400">{i + 1}</span>
                </div>
            {/each}
        </div>
    </div>
    <div class="box-border flex justify-center items-center mb-4 gap-1 h-fit flex-wrap">
        {#each alphabet as letter}
            <button class="w-6 h-8 bg-violet-500 text-white" on:click={(event) => letterPress(letter, event.currentTarget as HTMLButtonElement)}><p class="w-full h-full flex justify-center items-center text-center">{letter}</p></button>
        {/each}
    </div>
    <div class="box-border flex justify-center items-start flex-col gap-1">
        {#each words as wordDef, index}
            <p class="text-white">{index+1}. {wordDef[1]}</p>
        {/each}
    </div>
{/await}