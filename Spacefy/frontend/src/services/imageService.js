const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_IMAGE);

    const response = await fetch(
        `${import.meta.env.VITE_CLOUDINARY_API_URL}/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
            method: 'POST',
            body: formData
        }
    );
    
    const data = await response.json();
    return data.secure_url;
};

export const uploadImages = async (files) => {
    const uploadedUrls = [];
    
    for (const file of files) {
        const url = await uploadImageToCloudinary(file);
        uploadedUrls.push(url);
    }
    
    return uploadedUrls;
};

export const deleteImageFromCloudinary = async (imageUrl) => {
    try {
        // Extrai o public_id da URL do Cloudinary
        const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];
        const timestamp = Math.floor(Date.now() / 1000);
        
        // Gera a assinatura usando a API Secret
        const signature = await generateSignature(publicId, timestamp);
        
        const response = await fetch(
            `${import.meta.env.VITE_CLOUDINARY_API_URL}/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/destroy`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    public_id: publicId,
                    api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
                    timestamp: timestamp,
                    signature: signature
                })
            }
        );

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message);
        }
        return data.result === 'ok';
    } catch (error) {
        console.error('Erro ao excluir imagem do Cloudinary:', error);
        throw error;
    }
};

// Função auxiliar para gerar a assinatura
const generateSignature = async (publicId, timestamp) => {
    const message = `public_id=${publicId}&timestamp=${timestamp}${import.meta.env.VITE_CLOUDINARY_API_SECRET}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}; 