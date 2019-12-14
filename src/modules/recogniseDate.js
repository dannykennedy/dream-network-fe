import ParseDate from "parse-dates";

export const findDatesInText = text => {
    return ParseDate(text);
};
