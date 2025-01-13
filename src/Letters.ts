// Checks on the app load if any letters are not present in the crossword
// If so, disables their buttons
export function checkLetterExisting(button: HTMLButtonElement, letter: string) {
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


// Handles the press of the letter button - uncover all instances and disable
export function letterPress(letter: string, button: HTMLButtonElement) {
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


// Checks if all instances of the letter are visible (as values)
// If so, disables and greys out the button
export function checkAllLettersVisible() {
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