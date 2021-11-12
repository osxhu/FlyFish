/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-11-10 19:08:53
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-11-12 16:00:40
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
};
