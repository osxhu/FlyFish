/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-11-10 19:08:41
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-11-12 16:07:46
 */
import { fetchGet, fetchPost,fetchPut } from "@/utils/request";
import API from "@/services/api/component";

export const getTreeDataService = () => {

  return fetchPost(API.GET_TREEDATA, { });
};

export const updateTreeDataService = (param)=>{
  return fetchPut(API.UPDATE_TREEDATA,{ body: param });
};
export const getListDataService = (param)=>{
  return fetchPost(API.GET_LISTDATA,{ body: param });
};
export const getProjectsService = (param)=>{
  return fetchGet(API.GET_PROJECTS,{ body: param });
};
export const getTagsService = (param)=>{
  return fetchGet(API.GET_TAGS,{ body: param });
};
export const addComponentService = (param)=>{
  return fetchPost(API.ADD_COMPONENT,{ body: param });
};
