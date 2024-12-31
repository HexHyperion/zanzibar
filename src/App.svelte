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
        while (word === null && definition === null) {
            [word, definition] = await fetchData();
        }
        return [word as string, definition as string];
    }
</script>


{#await getWord() then word}
    <div class="h-screen box-border flex justify-center items-center">
        <h1 class="text-purple-500">{word[0]} - {word[1]}</h1>
    </div>
{/await}