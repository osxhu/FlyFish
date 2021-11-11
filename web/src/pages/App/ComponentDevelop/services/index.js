/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-11-10 19:08:41
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-11-11 17:01:04
 */
import { fetchGet, fetchPost,fetchPut } from "@/utils/request";
import API from "@/services/api/component";

export const getTreeDataService = () => {

  return fetchPost(API.GET_TREEDATA, { });
};

export const updateTreeDataService = (param)=>{
  return fetchPut(API.UPDATE_TREEDATA,{ body: param });
};

