export function getContentType(ext) {
    const types = {
        ".js": "text/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".jpg": "image/jpeg",
        ".png": "image/png",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".svg": "image/svg+xml"
    };
    return types[ext] || 'text/html';
}