export default function idGen() {
    // 1578795600000 = milliseconds from 1970 to Jan 12, 2020
    let datePart = (new Date().getTime() - 1578795600000).toString();
    // Up to 4 hex digits
    let randomPart = (Math.floor(Math.random() * 999998) + 1).toString();
    randomPart = randomPart.padStart(6, "0");
    return parseInt(datePart + randomPart);
}
