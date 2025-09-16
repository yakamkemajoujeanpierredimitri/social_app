import apiClient from "./apiClient";

const CommService = {
sendComm : async (id,data)=>{
    try {
        const res = await apiClient.post(`/comment/${id}?app=true`,data,{
            headers:{'Content-Type': 'multipart/form-data'}
        });
        return {data:res.data};
    } catch (error) {
         console.error('CommService error:', error);
        const errorMessage = error.response?.data?.message || 'File upload failed';
        return {msg:errorMessage};
    }
},
getComm:async (id)=>{
    try {
        const res = await apiClient.get(`/comment/${id}?app=true`);
        return {data:res.data};
    } catch (error) {
         console.error('CommService error:', error);
        const errorMessage = error.response?.data?.message || 'File upload failed';
        return {msg:errorMessage};
    }
},
deleteComm:async (id)=>{
    try {
        await apiClient.delete(`/comment/${id}?app=true`);
        return {success:true};
    } catch (error) {
         console.error('CommService error:', error);
        const errorMessage = error.response?.data?.message || 'File upload failed';
        return {msg:errorMessage};
    }
},


}
export default CommService;