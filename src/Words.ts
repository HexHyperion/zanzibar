// Checks if the row is filled, no matter if correctly or not
export function checkFilledRow(input: HTMLInputElement) {
    if (input.parentElement) {
        const inputs = input.parentElement.querySelectorAll(".crossword-input") as NodeListOf<HTMLInputElement>;
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
    if (input.parentElement) {
        const inputs = input.parentElement.querySelectorAll(".crossword-input") as NodeListOf<HTMLInputElement>;
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
    if (input.parentElement) {
        const inputs = input.parentElement.getElementsByTagName("input");
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].style.backgroundColor = "rgba(0, 255, 196, 0.5)";
            inputs[i].readOnly = true;
        }
    }
}