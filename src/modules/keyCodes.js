export const KeyCodes = {
    comma: 188,
    enter: 13,
};

export const isEnterKey = keyCode => {
    return keyCode === KeyCodes.enter || keyCode === KeyCodes.comma;
};
