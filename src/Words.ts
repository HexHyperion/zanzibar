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