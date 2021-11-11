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
  REGISTER:`${baseUrl}/users/register`,
  //项目管理
  GET_PROJECT_MANAGELIST_API: `${baseUrl}/get/projectlist`,
  SAVE_PROJECT_API: `${baseUrl}/save/project`,
};
