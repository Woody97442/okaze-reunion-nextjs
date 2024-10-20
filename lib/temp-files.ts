import fs from 'fs';
import path from 'path';
export async function CreateTempFile(images: File): Promise<{ filePath: string, fileName: string, mimeType: string }> {

    const file = images;
    const mimeType = file.type;
    const extension = mimeType.split('/')[1];
    const formattedDate = formatDateForFileName();
    const randomId = Math.floor(Math.random() * 1000000);
    const fileName = `IMG${randomId}_${formattedDate}.${extension}`;

    // Préparation du fichier pour l'upload
    const buffer = new Uint8Array(await file.arrayBuffer());
    const filePath = path.join(process.cwd(), 'uploads/temp', fileName);

    // Sauvegarde temporaire du fichier
    fs.writeFileSync(filePath, buffer);

    return {
        filePath,
        fileName,
        mimeType
    };
}

export function DeleteTempFile(filePath: string) {

    // Supprimer le fichier temporaire
    fs.unlinkSync(filePath);
    return true;
}

// Fonction pour formater la date dans le format jjmmaaaa
function formatDateForFileName() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    return `${day}${month}${year}`;
}