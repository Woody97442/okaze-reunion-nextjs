import imageCompression from "browser-image-compression";

const defaultOptions = {
    maxSizeMB: 0.2,
    maxWidthOrHeight: 150,
    useWebWorker: true,
    maxIteration: 10
}

export function compressFile(imageFile: File, options = defaultOptions) {
    return imageCompression(imageFile, options);
}