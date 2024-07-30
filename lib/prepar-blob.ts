export async function PreparBlob(file: File) {
    if (!file) {
        return { blob: [] as unknown as Buffer, tempUrl: "", error: "Aucun fichier !", success: "" };
    }

    try {
        // Convertir le Blob en ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        // Convertir l'ArrayBuffer en Buffer
        const buffer = Buffer.from(arrayBuffer);

        // Url temporaire de preview
        const tempUrl = URL.createObjectURL(file);

        return { blob: buffer, tempUrl: tempUrl, success: "Fichier converti !", error: "" };

    } catch (error) {
        return { blob: [] as unknown as Buffer, tempUrl: "", error: "Aucun fichier !", success: "" };
    }
}