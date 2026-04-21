import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { sendResponse, sendImageResponse } from './utils/sendResponse.js';
import { serveStatic } from './utils/serveStatic.js'

const PORT = 3000;

const __dirname = import.meta.dirname;
const imagesDir = path.join (__dirname, 'images');

const server = http.createServer(async (req, res) => {
    const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

    if (req.method === 'GET' && requestUrl.pathname === '/api/images') {
        try {
            const files = await fs.readdir(imagesDir);
            const images = files.filter((file) =>
                ['.jpg', '.jpeg', '.png', '.gif'].includes(path.extname(file).toLowerCase())
            );

            if (images.length === 0) {
                sendResponse(res, 404, 'application/json', { error: 'No hay imagenes disponibles' });
                return;
            }

            const randomIndex = Math.floor(Math.random() * images.length);
            const randomImage = images[randomIndex];
            const imagePath = path.join(imagesDir, randomImage);

            const ext = path.extname(randomImage).toLowerCase();
            const mimeTypes = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif'
            };

            const content = await fs.readFile(imagePath);
            sendImageResponse(res, 200, mimeTypes[ext] || 'application/octet-stream', content);
        } catch (error) {
            console.error(error);
            sendResponse(res, 500, 'application/json', { error: 'Error interno del servidor' });
        }

        return;
    }else{
        serveStatic(res, __dirname)
    }

    sendResponse(res, 404, 'application/json', { error: 'Endpoint no encontrado' });
});

server.listen(PORT, () => {
    console.log(`Conectado al servidor http://localhost:${PORT}`);
});
