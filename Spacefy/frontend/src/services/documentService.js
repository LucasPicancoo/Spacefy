const uploadDocumentToCloudinary = async (file) => {
    const formData = new FormData();
    const timestamp = Math.floor(Date.now() / 1000);
    
    // Parâmetros para a assinatura
    const params = {
        folder: 'spacefy_documents',
        timestamp: timestamp,
        upload_preset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    };
    
    // Gera a assinatura para o upload
    const signature = await generateSignature(params);
    
    formData.append('file', file);
    formData.append('upload_preset', params.upload_preset);
    formData.append('resource_type', 'auto');
    formData.append('timestamp', params.timestamp);
    formData.append('signature', signature);
    formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);
    formData.append('folder', params.folder);

    try {
        const response = await fetch(
            `${import.meta.env.VITE_CLOUDINARY_API_URL}/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
            {
                method: 'POST',
                body: formData
            }
        );
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Erro ao fazer upload do documento');
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error('Erro detalhado:', error);
        throw error;
    }
};

// Função auxiliar para gerar a assinatura
const generateSignature = async (params) => {
    // Ordena os parâmetros alfabeticamente
    const sortedParams = Object.keys(params)
        .sort()
        .reduce((acc, key) => {
            acc[key] = params[key];
            return acc;
        }, {});

    // Cria a string para assinatura
    const stringToSign = Object.entries(sortedParams)
        .map(([key, value]) => `${key}=${value}`)
        .join('&') + import.meta.env.VITE_CLOUDINARY_API_SECRET;


    const encoder = new TextEncoder();
    const data = encoder.encode(stringToSign);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
};

export const uploadDocument = async (file) => {
    try {
        const url = await uploadDocumentToCloudinary(file);
        return url;
    } catch (error) {
        console.error('Erro ao fazer upload do documento:', error);
        throw error;
    }
};

export const deleteDocumentFromCloudinary = async (documentUrl) => {
    try {
        // Extrai o public_id da URL do Cloudinary
        const urlParts = documentUrl.split('/');
        const uploadIndex = urlParts.indexOf('upload');
        if (uploadIndex === -1) {
            throw new Error('URL do documento inválida');
        }

        // Pega o public_id completo (incluindo a pasta)
        const publicId = urlParts.slice(uploadIndex + 2).join('/').split('.')[0];

        const timestamp = Math.floor(Date.now() / 1000);
        
        // Parâmetros para a assinatura
        const params = {
            public_id: publicId,
            timestamp: timestamp
        };
        
        // Gera a assinatura usando a API Secret
        const signature = await generateSignature(params);
        
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

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Erro ao excluir documento');
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }
        return data.result === 'ok';
    } catch (error) {
        console.error('Erro ao excluir documento do Cloudinary:', error);
        throw error;
    }
}; 