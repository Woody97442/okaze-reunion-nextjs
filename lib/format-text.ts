export function FormatText(text: string) {

    let textTransformed = text

    textTransformed = textTransformed.slice(0, 1).toUpperCase() + textTransformed.slice(1);

    return textTransformed;
}