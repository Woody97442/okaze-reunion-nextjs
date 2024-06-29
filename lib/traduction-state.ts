export function TraductionState(state: string) {
    switch (state) {
        case "new":
            return "Neuf";
        case "very_good":
            return "Très bon";
        case "good":
            return "Bon";
        case "satisfactory":
            return "Satisfaisant";
        default:
            return "";
    }
}

