import fs from 'node:fs/promises'
import path from 'node:path'
import { getContentType } from './getContentType.js'
import { sendResponse } from './sendResponse.js'

export async function serveStatic(res, dirname){
    const filePath = path.join(dirname, 'public', 'index.html')
    
    const ext = path.extname(filePath)

    const contentType = getContentType(ext)
    try{
        const data = await fs.readFile(filePath)
        const parsedData = ext === '.json' ? JSON.parse(data) : data
        sendResponse(res, 200, contentType, ext === '.json' ? JSON.stringify(parsedData) : parsedData)
    }catch(error){

        if (error.code === 'ENOENT'){ 
            sendResponse(res, 404, 'application/json', JSON.stringify({
                "message": "404 Not Found"
            }))
        }else{
            console.error(error)
            sendResponse(res, 500, 'application/json', JSON.stringify({
                "message": "500 Server failed"
            }))
        }

    }
    
}
