import { API_PATHS } from './apiPaths';
import axiosInstance from './axiosinstance';

const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        const response = await axiosInstance.post("/api/uploads", formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        // Normalizing the return so it's always { imageUrl: "full-url" }
        return {
            imageUrl: response.data.imageUrl 
                || response.data.url 
                || response.data.path 
                || ""
        };
    } catch (error) {
        console.error('Error uploading the image:', error);
        throw error;
    }
};
export default uploadImage;