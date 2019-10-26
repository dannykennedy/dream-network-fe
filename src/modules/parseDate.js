//https://stackoverflow.com/questions/27012854/change-iso-date-string-to-date-object-javascript
export const parseTimestamp = timePosted => {
    let digits = timePosted.split(/\D+/);
    let d = new Date(
        Date.UTC(
            digits[0],
            --digits[1],
            digits[2],
            digits[3],
            digits[4],
            digits[5],
            digits[6]
        )
    );
    return parseDate(d);
};

export const parseDate = date => {
    let dateString = date.toDateString().slice(3, date.length); // Date minus day of week
    dateString = dateString.replace(/ 0([0-9])/, " $1"); // Remove '0' from e.g. May 05
    dateString = dateString.replace(/ ([0-9]{1,2}) /, " $1, "); // Add comma
    return `${dateString}`;
};
