const btn = document.getElementById('random-btn');
const image = document.getElementById('image');

async function fetchRandomImage(){
    try {
        const response = await fetch('http://localhost:3000/api/image');

        if (!response.ok){ 
            throw new Error('Error al cargar la imagen');
        }

            const imageBlob = await response.blob();

            const imageObjectUrl = URL.createObjectURL(imageBlob)

            image.src = imageObjectUrl

            image.onload = () => URL.revokeObjectURL(imageObjectUrl); 

} catch(error){
    console.log(`Fallo en la carga: ${error}`)
}
}

btn.addEventListener('click', fetchRandomImage)