// Checks if the row is filled, no matter if correctly or not
export function checkFilledRow(input: HTMLInputElement) {
    if (input.parentElement?.parentElement) {
        const inputs = input.parentElement.parentElement.querySelectorAll(".crossword-input") as NodeListOf<HTMLInputElement>;
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].value.length <= 0) {
                return false;
            }
        }
        return true;
    }
    else return false;
}

// Checks if the row is correctly filled on enter key press
export function checkCorrectRow(input: HTMLInputElement) {
    if (input.parentElement?.parentElement) {
        const inputs = input.parentElement.parentElement.querySelectorAll(".crossword-input") as NodeListOf<HTMLInputElement>;
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].value.toUpperCase() != inputs[i].dataset.letter) {
                return false;
            }
        }
        return true;
    }
    else return false;
}

// Sets a green background of a correctly filled word
export function setSuccess(input: HTMLInputElement) {
    if (input.parentElement?.parentElement) {
        const inputs = input.parentElement.parentElement.getElementsByTagName("input");
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].style.backgroundColor = "#22531e";
            inputs[i].readOnly = true;
        }
    }
}

// Checks if the password is filled correctly
export function checkPassword() {
    const passwordInputs = document.querySelectorAll(".password-input") as NodeListOf<HTMLInputElement>;
    for (let i = 0; i < passwordInputs.length; i++) {
        if (!passwordInputs[i].value) {
            return;
        }
    }
    passwordInputs.forEach(input => {
        input.style.color = "#5af04c";
        input.style.backgroundColor = "#22531e";
        input.readOnly = true;
    });
}

// Uncover three random letters in each word
export function uncoverRandomLetters() {
    const rows = document.querySelectorAll(".crossword-row");
    rows.forEach((row, rindex) => {
        const inputs = row.querySelectorAll(".crossword-input") as NodeListOf<HTMLInputElement>;
        const indexes = [];
        while (indexes.length < 3) {
            const randomIndex = Math.floor(Math.random() * inputs.length);
            // if (!indexes.has(randomIndex)) {
            indexes.push(randomIndex);
            // }
        }
        indexes.forEach(index => {
            inputs[index].value = inputs[index].dataset.letter ?? "";
            inputs[index].readOnly = true;
        })
        checkPassword();
    });
}