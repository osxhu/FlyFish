/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-11-10 19:08:53
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-11-13 18:04:32
 */
/*
 * 应用
 */

const baseUrl = "/api";
export default {
  GET_TREEDATA: `${baseUrl}/components/categories/list`,
  UPDATE_TREEDATA:`${baseUrl}/components/categories`,
  GET_LISTDATA: `${baseUrl}/components/list`,
  GET_PROJECTS: `${baseUrl}/projects/list`,
  GET_TAGS: `${baseUrl}/tags/get-all`,
  ADD_COMPONENT: `${baseUrl}/components`,
  GET_USERINFO: `${baseUrl}/users/info`,
  GET_DETAILDATA: `${baseUrl}/components`,
  //编辑组件
  EDIT_COMPONENT: `${baseUrl}/components`,
  //复制组件
  COPY_COMPONENT: `${baseUrl}/components/copy`,
  //删除组件
  DELETE_COMPONENT: `${baseUrl}/components`,
  //上传代码包
  UPLOAD_COMPONENT: `${baseUrl}/components/import-source-code`,
  //下载代码包
  DOWNLOAD_COMPONENT: `${baseUrl}/components/export-source-code`,
};
