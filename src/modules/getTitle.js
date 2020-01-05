export const getTitle = htmlText => {
    console.log("got html:", htmlText);
    let regexp = /<h[1-6]>(.*)<\/h[1-6]>/;
    let result = htmlText.match(regexp);
    if (result) {
        console.log("got a ttitllle", result[1].replace(/&nbsp;/gi, ""));
        return result[1].replace(/&nbsp;/gi, "");
    } else {
        console.log("got nuttin");
        return "";
    }
};
