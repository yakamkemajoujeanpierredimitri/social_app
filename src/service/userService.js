import apiClient from "./apiClient";

const UserService = {
 getAllusers : async ()=>{
        try {
            const res  = await apiClient.get('/user/all?app=true');
            return {data:res.data}
        } catch (error) {
            const errorMessage = error.response?.data?.message || "failed to fech users";
            return { msg : errorMessage};
        }
    },
userUpdate: async (data)=>{
        try {
            const res  = await apiClient.put(`/user?app=true`,data);
            return {data:res.data}
        } catch (error) {
            const errorMessage = error.response?.data?.message || "failed to fech users";
            return { msg : errorMessage};
        }
    },
userAvatar:async (data)=>{
        try {
            const res  = await apiClient.put(`/user/avatar?app=true`,data,
                {headers:{'Content-Type': 'multipart/form-data',}}
            );
            return {data:res.data}
        } catch (error) {
            const errorMessage = error.response?.data?.message || "failed to fech users";
            return { msg : errorMessage};
        }
    },
    follow:async(data)=>{
        try {
            const res = await apiClient.post(`/follow/follow?app=true`,data);
           return  {data : res.data};
        } catch (error) {
               const errorMessage = error.response?.data?.message || "failed to fech users";
            return { msg : errorMessage};
        }
    },
    unfollow:async(data)=>{
        try {
            const res = await apiClient.delete(`/follow/unfollow?app=true`,data);
           return  {data : res.data};
        } catch (error) {
               const errorMessage = error.response?.data?.message || "failed to fech users";
            return { msg : errorMessage};
        }
    },
    userPosts:async()=>{
        try {
            const res = await apiClient.get(`/post/user?app=true`);
           return  {data : res.data};
        } catch (error) {
               const errorMessage = error.response?.data?.message || "failed to fech users";
            return { msg : errorMessage};
        }
    },
    savePosts:async()=>{
        try {
            const res = await apiClient.get(`/user/saves?app=true`);
           // console.log(res.data);
           return  {data : res.data[0].saves};
        } catch (error) {
               const errorMessage = error.response?.data?.message || "failed to fech users";
            return { msg : errorMessage};
        }
    },
    getFollowers:async()=>{
        try {
            const res = await apiClient.get(`/follow/followers?app=true`);
           return  {data : res.data};
        } catch (error) {
               const errorMessage = error.response?.data?.message || "failed to fech users";
            return { msg : errorMessage};
        }
    },
    getFollowing:async()=>{
        try {
            const res = await apiClient.get(`/follow/following?app=true`);
           return  {data : res.data};
        } catch (error) {
               const errorMessage = error.response?.data?.message || "failed to fech users";
            return { msg : errorMessage};
        }
    },
    getVisitorSaves:async(id)=>{
        try {
            const res = await apiClient.get(`/user/saves/visitor/${id}?app=true`);
           return  {data : res.data};
        } catch (error) {
               const errorMessage = error.response?.data?.message || "failed to fech users";
            return { msg : errorMessage};
        }
    },
    getVisitorpost:async(id)=>{
        try {
            const res = await apiClient.get(`/post/visitor/${id}?app=true`);
           return  {data : res.data};
        } catch (error) {
               const errorMessage = error.response?.data?.message || "failed to fech users";
            return { msg : errorMessage};
        }
    },
    getVisitorFollowers:async(id)=>{
        try {
            const res = await apiClient.get(`/follow/visitorfw/${id}?app=true`);
           return  {data : res.data};
        } catch (error) {
               const errorMessage = error.response?.data?.message || "failed to fech users";
            return { msg : errorMessage};
        }
    },
    getVisitorFollowing:async(id)=>{
        try {
            const res = await apiClient.get(`/follow/visitorfl/${id}?app=true`);
           return  {data : res.data};
        } catch (error) {
               const errorMessage = error.response?.data?.message || "failed to fech users";
            return { msg : errorMessage};
        }
    }
};
export default UserService;