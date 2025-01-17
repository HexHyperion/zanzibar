// Checks if the row is filled, no matter if correctly or not
export function checkFilledRow(input: HTMLInputElement) {
    if (input.parentElement?.parentElement) {
        const inputs = input.parentElement.parentElement.querySelectorAll(".crossword-input") as NodeListOf<HTMLInputElement>;
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].value.length <= 0) {
                return false;
            }
        }
        if (checkCorrectRow(inputs[0])) {
            setSuccess(inputs[0]);
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

// Apply rotation animation to inputs
function applyRotationAnimation(inputs: HTMLInputElement[]) {
    inputs.forEach((input, index) => {
        setTimeout(() => {
            input.style.transition = "transform 0.85s";
            input.style.transform = "rotateY(360deg)";
        }, index * 100);
    });
}

// Sets a green background of a correctly filled word
export function setSuccess(input: HTMLInputElement) {
    if (input.parentElement?.parentElement) {
        const inputs = input.parentElement.parentElement.getElementsByTagName("input");
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].style.backgroundColor = "#22531e";
            inputs[i].readOnly = true;
        }
        applyRotationAnimation(Array.from(inputs));
        checkRowsPasswordLetters();
        uncoverPasswordLetters(inputs);
    }
}

function uncoverPasswordLetters(inputs: HTMLCollectionOf<HTMLInputElement>) {
    const passwordInputs = document.querySelectorAll(".password-input") as NodeListOf<HTMLInputElement>;
    Array.from(inputs).forEach(input => {
        const number = input.parentElement?.children[1].textContent;
        if (number) {
            const passwordInput = passwordInputs[parseInt(number) - 1];
            if (input.value.toUpperCase() === passwordInput.dataset.letter?.toUpperCase()) {
                passwordInput.value = passwordInput.dataset.letter?.toUpperCase() ?? "";
                passwordInput.readOnly = true;
            }
        }
    });
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
    const parentElement = passwordInputs[0].parentElement?.parentElement;
    if (parentElement) {
        parentElement.style.borderColor = "#5af04c";
    }
    applyRotationAnimation(Array.from(passwordInputs));
    validatePassword();
}

function validatePassword() {
    const passwordInputs = document.querySelectorAll(".password-input") as NodeListOf<HTMLInputElement>;
    for (let i = 0; i < passwordInputs.length; i++) {
        if (passwordInputs[i].value.toUpperCase() !== passwordInputs[i].dataset.letter?.toUpperCase()) {
            return false;
        }
    }
    passwordInputs.forEach(input => {
        input.style.color = "#5af04c";
        input.style.backgroundColor = "#22531e";
        input.readOnly = true;
    });
    const parentElement = passwordInputs[0].parentElement?.parentElement;
    if (parentElement) {
        parentElement.style.borderColor = "#5af04c";
    }
    applyRotationAnimation(Array.from(passwordInputs));
    return true;
}

// Uncover three random letters in each word
export function uncoverRandomLetters() {
    const rows = document.querySelectorAll(".crossword-row");
    rows.forEach((row, rindex) => {
        const inputs = row.querySelectorAll(".crossword-input") as NodeListOf<HTMLInputElement>;
        const indexes = [];
        while (indexes.length < 3) {
            const randomIndex = Math.floor(Math.random() * inputs.length);
            indexes.push(randomIndex);
        }
        indexes.forEach(index => {
            inputs[index].value = inputs[index].dataset.letter ?? "";
            inputs[index].readOnly = true;
        });
    });
    checkRowsPasswordLetters();
}

// Check all rows for matching password fields
export function checkRowsPasswordLetters() {
    const passwordInputs = document.querySelectorAll(".password-input") as NodeListOf<HTMLInputElement>;
    const rows = document.querySelectorAll(".crossword-row");
    rows.forEach(row => {
        const inputs = row.querySelectorAll(".crossword-input") as NodeListOf<HTMLInputElement>;
        inputs.forEach(input => {
            const number = input.parentElement?.children[1].textContent;
            if (number) {
                const passwordInput = passwordInputs[parseInt(number) - 1];
                if (input.value.toUpperCase() === passwordInput.dataset.letter?.toUpperCase()) {
                    passwordInput.value = passwordInput.dataset.letter?.toUpperCase() ?? "";
                    input.readOnly = true;
                }
            }
        });
    });
}

// Checks if all rows are correctly filled
export function checkAllRowsCorrect() {
    const rows = document.querySelectorAll(".crossword-row");
    for (let i = 0; i < rows.length; i++) {
        const inputs = rows[i].querySelectorAll(".crossword-input") as NodeListOf<HTMLInputElement>;
        for (let j = 0; j < inputs.length; j++) {
            if (inputs[j].value.toUpperCase() !== inputs[j].dataset.letter) {
                return false;
            }
        }
    }
    return true;
}

// Checks if all rows are filled
export function checkAllRowsFilled() {
    const rows = document.querySelectorAll(".crossword-row");
    for (let i = 0; i < rows.length; i++) {
        const inputs = rows[i].querySelectorAll(".crossword-input") as NodeListOf<HTMLInputElement>;
        for (let j = 0; j < inputs.length; j++) {
            if (inputs[j].value.length <= 0) {
                return false;
            }
        }
    }
    return true;
}