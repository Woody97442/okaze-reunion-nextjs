
export function FormatPrice(price: number): string {
    const [integerPart, decimalPart] = price.toFixed(2).split('.');

    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    if (!decimalPart || decimalPart === '00') {
        return formattedIntegerPart;
    }

    return `${formattedIntegerPart},${decimalPart}`;
}