// Change a color so it "looks semi-transparent" on a white background
// But is not transparent
// Assumes a white background (though this could easily be changed by altering the 255 values)
// Params: rbg string (e.g. "rgb(255,34,23)"), opacity (float)
// Outputs: rbg string (e.g. "rgb(255,123,129)")
export const attachPretendOpacity = (rgbColor, opacity) => {
    const rgbArray = rgbColor
        .substring(4, rgbColor.length - 1)
        .replace(/ /g, "")
        .split(",");
    let red = Math.round(rgbArray[0] * opacity + 255 * (1 - opacity));
    let green = Math.round(rgbArray[1] * opacity + 255 * (1 - opacity));
    let blue = Math.round(rgbArray[2] * opacity + 255 * (1 - opacity));
    return `rgb(${red},${green},${blue})`;
};
