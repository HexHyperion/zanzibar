const wordEndpoint = "https://random-word-api.herokuapp.com/word";
const definitionEndpoint = "https://api.dictionaryapi.dev/api/v2/entries/en/";

export let maxLength = 0;

// Handles the native fetch() function
export async function fetchData() {
    const fetchedWord = await fetch(wordEndpoint);
    const stringWord: string = await fetchedWord.json();

    const fetchedDefinition = await fetch(definitionEndpoint + stringWord);
    const definitionArray: unknown = await fetchedDefinition.json();
    const stringDefinition: string | null = definitionArray instanceof Array ? definitionArray[0].meanings[0].definitions[0].definition : null;     // If no definition the API returns an object with an error message instead of an array, clever way to check if the definition is null

    return [stringWord, stringDefinition];
}


// Fetches the password
export async function getPassword() {
    let [word, _] = await fetchData();
    while (word == null) {
        [word, _] = await fetchData();
    }
    return word[0] as string;
}


// Fetches words until the word has a definition
export async function getWord() {
    let [word, definition] = await fetchData();
    while (word == null || definition == null) {
        [word, definition] = await fetchData();
    }

    return [word[0] as string, definition as string];
}


// Fetches seven words for the crossword
export async function getSeven() {
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


// Fetches new passwords until all of the password's letters are included in the crossword
export async function generatePassword(words: string[]) {
    const letterCounts = new Map<string, number>();
    const letterPositions = new Map<string, Set<[number, number]>>();
    words.forEach((word, index) => {
        for (let i = 0; i < word.length; i++) {
            letterCounts.set(word[i], (letterCounts.get(word[i]) ?? 0) + 1);
            letterPositions.set(word[i], (letterPositions.get(word[i]) ?? new Set()).add([index,i]));   // Positions are [wordNumber, positionInWord]
        }
    });

    let password = await getPassword();
    while (!checkPasswordIncluded(letterCounts, password)) {
        password = await getPassword();
    }

    for (let i = 0; i < password.length; i++) {
        const positionsLeft = letterPositions.get(password[i]);
        while (positionsLeft) {
            // randomly number the positions of the letter
        }
    }

    return password;    // for now, later it'll generate the numbers and the password field
}


// Checks if all letters of the password are included in the crossword
export function checkPasswordIncluded(letterCounts: Map<string,number>, password: string) {
    let isOK = true;
    const passwordLetterCounts = new Map<string, number>();
    for (let i = 0; i < password.length; i++) {
        passwordLetterCounts.set(password[i], (passwordLetterCounts.get(password[i]) ?? 0) + 1);
    }
    passwordLetterCounts.forEach((value, key) => {
        if ((passwordLetterCounts.get(key) ?? 0) > (letterCounts.get(key) ?? 0)) {
            isOK = false;
        }
    });
    return isOK;
}