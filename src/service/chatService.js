import apiClient from "./apiClient";

const ChatService = {
sendChat : async (id ,data)=>{
    try {
        const res = await apiClient.post(`/message/${id}?app=true`,data,{
            headers:{'Content-Type': 'multipart/form-data'}
        });
        return {data:res.data};
    } catch (error) {
         console.error( error);
        const errorMessage = error.response?.data?.message || 'File upload failed';
        return {msg:errorMessage};
    }
},
getChat:async (id)=>{
    try {
        const res = await apiClient.get(`/message/${id}?app=true`);
        return {data:res.data};
    } catch (error) {
         console.error('chatService error:', error);
        const errorMessage = error.response?.data?.message || 'File upload failed';
        return {msg:errorMessage};
    }
},
deleteChat:async (id)=>{
    try {
        const res = await apiClient.delete(`/message/${id}?app=true`);
        return {success:true};
    } catch (error) {
         console.error('chatService error:', error);
        const errorMessage = error.response?.data?.message || 'File upload failed';
        return {msg:errorMessage};
    }
},
Lastmessage:async ()=>{
    try {
        const res = await apiClient.get(`/message/last?app=true`);
        return {data:res.data};
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'File upload failed';
        console.error( errorMessage);
        return {msg:errorMessage};
    }
},

}
export default ChatService;