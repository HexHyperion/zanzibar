let startTime: number;
let endTime: number;
export let timeTaken: string = "";

export function startTimer() {
    startTime = Date.now();
}

export function stopTimer(checkAllRowsCorrect: () => boolean) {
    endTime = Date.now();
    const timeDiff = endTime - startTime;
    const seconds = Math.floor((timeDiff / 1000) % 60);
    const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    timeTaken = `${hours} hours, ${minutes} minutes and ${seconds} seconds`;
    if (checkAllRowsCorrect()) {
        return true;
    }
    return false;
}
