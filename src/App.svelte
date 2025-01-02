<script lang="ts">
    const wordEndpoint = "https://random-word-api.herokuapp.com/word";
    const definitionEndpoint = "https://api.dictionaryapi.dev/api/v2/entries/en/";


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
        while (word === null || definition === null) {
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


    // eventlistener input albo keyup
    // var elts = document.getElementsByClassName('test')
    // Array.from(elts).forEach(function(elt){
    //     elt.addEventListener("keyup", function(event) {
    //         // Number 13 is the "Enter" key on the keyboard
    //         if (event.keyCode === 13 || elt.value.length == 3) {
    //             // Focus on the next sibling
    //             elt.nextElementSibling.focus()
    //         }
    //     });
    // })
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
                        autocomplete="off"
                        data-letter={letter.toUpperCase()}
                        on:input={(e) => ((e.target as HTMLInputElement).nextElementSibling as HTMLInputElement)?.focus()}
                        on:keydown={(e) => {
                            if (e.key == "Backspace") {
                                (e.target as HTMLInputElement).value = "";
                                (e.target as HTMLInputElement).focus();
                            }
                            else if (e.key == "Enter") {
                                // go to next line of inputs (it's the next element that would be focused with tab, but .focus() doesn't work)
                                // looks like we need to simulate the tab key press 
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
    <div class="box-border flex justify-center items-start flex-col gap-1">
        {#each words as wordDef, index}
            <p class="text-white">{index+1}. {wordDef[1]}</p>
        {/each}
    </div>
{/await}