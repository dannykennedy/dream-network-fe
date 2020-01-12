export default function uuidV4() {
    var uuid = "",
        i,
        random;
    for (i = 0; i < 32; i++) {
        random = (Math.random() * 16) | 0;

        if (i === 8 || i === 12 || i === 16 || i === 20) {
            uuid += "-";
        }
        uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(
            16
        );
    }
    return uuid;
}

export function idGen() {
    let datePart = (new Date().getTime() - 1578795600000).toString();
    let randomPart = (Math.floor(Math.random() * 16777215) + 1).toString(); // 4 hex digits
    randomPart = randomPart.padStart(8, "0");
    return datePart + randomPart;
}
