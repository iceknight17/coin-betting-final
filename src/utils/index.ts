export const generateRandomColorNumber = () => {
    let randomHue = Math.floor(Math.random() * 360);
    return randomHue;
}

export const generatePlaceholderName = (name: string) => {
    let splitUsername = name.split(" "), 
    firstLetter = splitUsername[0]?.[0] ?? "", 
    secondletter = splitUsername[1]?.[0] ?? "";
    return `${firstLetter}${secondletter}`;
}

export function formattedBalance(balance: number) {
    return (balance / 1e9).toLocaleString('en-US', {maximumFractionDigits: 3});
}