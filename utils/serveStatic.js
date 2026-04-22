import fs from 'node:fs/promises';
import path from 'node:path';
import { getContentType } from './getContentType.js';
import { sendResponse, sendImageResponse } from './sendResponse.js';

export async function serveStatic(res, dirname, pathname) {
    const filePath = path.join(dirname, 'public', pathname === '/' ? 'index.html' : pathname);

    try {
        const stat = await fs.stat(filePath);
        if (!stat.isFile()) {
            throw new Error('Not a file');
        }

        const ext = path.extname(filePath);
        const contentType = getContentType(ext);

        const data = await fs.readFile(filePath);
        if (ext === '.json') {
            const parsedData = JSON.parse(data);
            sendResponse(res, 200, contentType, parsedData);
        } else {
            sendImageResponse(res, 200, contentType, data);
        }
    } catch (error) {
        if (error.code === 'ENOENT' || error.message === 'Not a file') {
            sendResponse(res, 404, 'application/json', { message: '404 Not Found' });
        } else {
            console.error(error);
            sendResponse(res, 500, 'application/json', { message: '500 Server failed' });
        }
    }
}
