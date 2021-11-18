/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-11-10 19:08:41
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-11-18 16:21:53
 */
import { fetchGet, fetchPost,fetchPut,fetchDelete } from "@/utils/request";
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
  return fetchGet(API.GET_PROJECTS,{ params: param });
};
export const getTagsService = (param)=>{
  return fetchGet(API.GET_TAGS,{ params: param });
};
export const addComponentService = (param)=>{
  return fetchPost(API.ADD_COMPONENT,{ body: param });
};
export const getUserInfoService = (param)=>{
  return fetchGet(API.GET_USERINFO+'/'+param.id);
};
export const getDetailDataService = (param)=>{
  return fetchGet(API.GET_DETAILDATA+'/'+param.id);
};
export const editComponentService = (id,param)=>{
  return fetchPut(API.EDIT_COMPONENT+'/'+id,{ body:param });
};
export const copyComponentService = (id,name)=>{
  return fetchPost(API.COPY_COMPONENT+'/'+id,{ body:{name} });
};
export const deleteComponentService = (id)=>{
  return fetchDelete(API.DELETE_COMPONENT+'/'+id);
};
export const downloadComponentService = (id)=>{
  return fetchGet(API.DOWNLOAD_COMPONENT+'/'+id,{headers:{responseType:'blob'}});
};
export const installPackagesService = (id)=>{
  return fetchPost(API.INSTALL_PACKAGE+'/'+id);
};
export const uploadLibraryService = (id)=>{
  return fetchPost(API.UPLOADTO_LIBRARY+'/'+id);
};
export const compileComponentService = (id)=>{
  return fetchPost(API.COMPILE_COMPONENT+'/'+id);
};
export const publishComponentService = (id,options)=>{
  return fetchPost(API.PUBLISH_COMPONENT+'/'+id,{body:options});
};
export const getRecordService = (options)=>{
  const { id,curPage,pageSize } = options;
  return fetchGet(API.GET_RECORD+`/${id}?curPage=${curPage}&pageSize=${pageSize}`);
};


