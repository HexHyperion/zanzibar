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
                    <input type="text" class="w-10 h-10 text-center text-2xl bg-neutral-900" value={letter.toUpperCase()} readonly>
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