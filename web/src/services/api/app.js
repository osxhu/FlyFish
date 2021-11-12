/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-11-10 19:08:53
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-11-11 15:34:25
 */
/*
 * 应用
 */

const baseUrl = "/api";
export default {
  LOGIN: `${baseUrl}/users/login`,
  LOGINOUT:`${baseUrl}/users/logout`,
  REGISTER:`${baseUrl}/users/register`,
  //项目管理
  GET_PROJECT_MANAGELIST_API: `${baseUrl}/projects/list`,
  // 新增项目
  SAVE_PROJECT_API: `${baseUrl}/projects`,
  // 编辑项目
  CHANGE_PROJECT_API:`${baseUrl}/projects/`,
  // 删除项目
  DETLETE_PROJECT_API:`${baseUrl}/projects/`,
};
