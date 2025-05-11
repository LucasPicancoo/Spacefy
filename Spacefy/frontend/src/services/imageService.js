const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

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