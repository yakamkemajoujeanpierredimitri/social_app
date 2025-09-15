import apiClient from "./apiClient";
const FileService = {

            uploadFile: async (dispatch , file, onProgress) => {
        // Implement file upload logic here
        
        dispatch({ type: 'UPLOAD_VIDEO_START' });
        try {
            const res = await apiClient.post("/post?app=true", file, {
                headers:{'Content-Type':'multipart/form-data'},
                onUploadProgress: (progressEvent) => {
                    if (onProgress) {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        onProgress(percentCompleted);
                    }
                }
            });
            dispatch({
                type: 'UPLOAD_VIDEO_SUCCESS',
                payload: { video: res.data }
            });
            console.log(res.data);
            return {success:true};
        } catch (error) {
           console.log(error);
            const errorMessage = error.response?.data?.message || 'File upload failed'; 
            console.error('FileService.uploadFile error:', errorMessage);
            dispatch({
                type: 'UPLOAD_VIDEO_ERROR',
                payload: errorMessage
            });
            return{msg:errorMessage};
        }
    },
    deleteFile: async (dispatch,fileId) => {
        dispatch({ type: 'FETCH_VIDEO_START' });
        // Implement file deletion logic here
        try {
            const res = await apiClient.delete(`/post/${fileId}?app=true`);
          
        } catch (error) {
            console.error('FileService.deleteFile error:', error);
            const errorMessage = error.response?.data?.message || 'File deletion failed';
            dispatch({
                type: 'DELETE_VIDEO_ERROR',
                payload: errorMessage
            });
        }finally{
              dispatch({
                type: 'DELETE_VIDEO_SUCCESS',
            });
        }
    },
    getFile: async (dispatch,fileId) => {
        // Implement file retrieval logic here
        
        dispatch({ type: 'FETCH_VIDEO_START' });
        try {
            const res = await apiClient.get(`/post/${fileId}?app=true`);
            dispatch({
                type: 'FETCH_VIDEO_SUCCESS',
                payload: { file: res.data }
            });
        } catch (error) {
            console.error('FileService.getFile error:', error);
            const errorMessage = error.response?.data?.message || 'File retrieval failed';
            dispatch({
                type: 'FETCH_VIDEO_ERROR',
                payload: errorMessage
            });
        }
    },
    getAllFiles: async (dispatch) => {
        // Implement logic to retrieve all files here
        
        
        
        dispatch({
            type: "FETCH_VIDEO_START"
        });
        
        try {
            const res = await apiClient.get(`/post?app=true`);
             //console.log(res.data);
            dispatch({
                type: 'FETCH_VIDEO_SUCCESS',
                payload: { file: res.data[0] }
            });
           
            return{data:res.data};
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'File retrieval failed';
            console.log(errorMessage);
            dispatch({
                type: 'FETCH_VIDEO_ERROR',
                payload: errorMessage
            });
        }

    },
    getObservation: async (dispatch,fileId) => {
        // Implement logic to get observation for a specific file
        
        try {
            const res = await apiClient.get(`/post/observe/${fileId}?app=true`);
            dispatch({
                type: 'SET_PROP',
                payload: res.data
            });
           // console.log(res.data);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'File retrieval failed';
            return { msg: errorMessage };
        }
    },
    getAlgoFiles: async (dispatch , currentPage) => {
        // Implement logic to retrieve files related to a specific algorithm
        
        dispatch({
            type: "FETCH_VIDEO_START"
        });
        try {
            const res = await apiClient.get(`/user/observe?app=true&&max=${currentPage || 1}`);
            dispatch({
                type: 'FETCH_VIDEO_SUCCESS',
                payload: { file: res.data[0] }
            });
            return{data:res.data};
        } catch (error) {
            console.log(error);
            const errorMessage = error.response?.data?.message || 'File retrieval failed';
            dispatch({
                type: 'FETCH_VIDEO_ERROR',
                payload: errorMessage
            });
            return { msg: errorMessage };
        }
    },
    addObservation: async ( dispatch,  data) => {
        
        try {
            const res = await apiClient.post(`/user/observe?app=true`, data);
            if (data?.save) {
                dispatch({
                    type: 'SAVES_VIDEO',
                    payload: { success: true }
                });
                return;
            }
            dispatch({
                type: 'LIKE_VIDEO',
                payload: { success: true }
            });
        } catch (error) {
            console.log(error);
            const errorMessage = error.response?.data?.message || 'File retrieval failed';
            console.error(errorMessage);
        }
    }
};

export default FileService;
