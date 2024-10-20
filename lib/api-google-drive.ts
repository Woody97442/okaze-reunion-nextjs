import { google } from 'googleapis';
import fs from 'fs';
export function GoogleDriveConnect() {

    // Configuration de l'authentification Google Drive
    const oAuth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

    const driveConnected = google.drive({ version: 'v3', auth: oAuth2Client });
    return driveConnected;
}

export async function DriveCreateFile(fileName: string, filePath: string, mimeType: string, folederId: string): Promise<string> {

    const drive: any = GoogleDriveConnect();

    // Upload sur Google Drive dans le dossier "okaze-reunion/..."
    const folderId = folederId;
    const response = await drive.files.create({
        requestBody: {
            name: fileName,
            parents: [folderId],
            mimeType: mimeType
        },
        media: {
            mimeType: mimeType,
            body: fs.createReadStream(filePath),
        },
    });

    const fileId = response.data.id;

    const permissionIsCreated = await DriveCreatePermission(drive, response.data.id);

    if (!permissionIsCreated) {
        return "Error add the permission to image to Google Drive";
    }

    // Obtenir l'URL partageable
    const fileUrl = `https://drive.google.com/uc?id=${fileId}`;

    return fileUrl;
}

export async function DriveDeleteFile(fileId: string): Promise<boolean> {

    const drive: any = GoogleDriveConnect();

    try {
        await drive.files.delete({ fileId: fileId });
        return true;
    } catch (error) {
        return false;
    }

}

export async function DriveCreatePermission(drive: any, fileId: string) {
    try {
        await drive.permissions.create({
            fileId: fileId as string,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        return true;

    } catch (error) {
        console.error('Error add the permission to image to Google Drive:', error);
        return false;
    }

}

// Fonction pour extraire l'ID du fichier à partir de l'URL Google Drive
export function ExtractDriveFileId(fileUrl: string): string | null {
    const regex = /drive\.google\.com\/uc\?id=([^&]+)/;
    const match = fileUrl.match(regex);
    return match ? match[1] : null;
}