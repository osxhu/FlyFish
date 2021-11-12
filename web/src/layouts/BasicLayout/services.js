import { fetchGet, fetchPost,fetchPut,fetchDelete } from "@/utils/request";
import API from "@/services/api";

// 获取项目列表 
 export const loginout = (callback) => {
    const res = fetchPost(API.LOGINOUT,{body:{id:localStorage.getItem('id')}});
    callback && callback(res);
};