<script lang="ts">
    const wordEndpoint = "https://random-word-api.herokuapp.com/word";
    const definitionEndpoint = "https://api.dictionaryapi.dev/api/v2/entries/en/";

    async function fetchData() {
        const fetchedWord = await fetch(wordEndpoint);
        const stringWord = await fetchedWord.json() as string;
        const fetchedDefinition = await fetch(definitionEndpoint + stringWord);
        const definition = await fetchedDefinition.json();
        console.log(definition instanceof Array ? definition : "no data bro");
        return stringWord;
    }
</script>

{#await fetchData() then word}
    <div class="h-screen box-border flex justify-center items-center">
        <h1 class="text-purple-500">{word}</h1>
    </div>
{/await}