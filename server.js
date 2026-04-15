import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { sendResponse, sendImageResponse } from './utils/sendResponse.js';

const PORT = 3000;

const __dirname = import.meta.dirname;
const imagesDir = path.join (__dirname, 'images');

const server = http.createServer(async (req, res) => {
    if(req.url === '/api/images' && req.method === 'GET'){

       await fs.readdir(imagesDir, async (err, files) => {
            if(err){
                sendResponse(res, 500, 'application/json', {error: 'Error al leer la carpeta'});
                return;
            }

            const images = files.filter(file => 
            ['.jpg', '.jpeg', '.png', '.gif'].includes(path.extname(file).toLowerCase()))

            if (images.length === 0 ){
                sendResponse(res, 404, 'application/json', {error: 'No hay imagenes disponibles'});
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

            await fs.readFile(imagePath, (err, content) => {

                if (err) {
                    sendResponse(res, 500, 'application/json' , {error: 'Error al leer la imagen'})
                    return;
                }else{
                sendImageResponse(res, 200, mimeTypes[ext], content)
                return;
                }
            });
        });

    } else {
        sendResponse(res, 404, 'application/json', {error: 'Endpoint no encontrado'});
    }
});

server.listen(PORT, () => {
    console.log(`Conectado al servidor http://localhost:${PORT}`);
});
