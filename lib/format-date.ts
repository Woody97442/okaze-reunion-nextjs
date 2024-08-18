export function FormatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Les mois sont basés sur zéro, donc ajoutez 1
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}


export function FormatDateForMessage(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const monthNames = ["janv", "févr", "mars", "avr", "mai", "juin", "juil", "août", "sept", "oct", "nov", "déc"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}

export function ExtractTimeFromISO(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}h${minutes}`;
}