/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-11-10 19:08:53
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-11-24 14:57:38
 */
/*
 * 应用
 */

const baseUrl = "/api";
export default {
  //用户列表
  GET_USER_MANAGELIST_API: `${baseUrl}/users/list`,
  //修改用户
  CHANGE_USER:`${baseUrl}/users/info/`,
  //获取用户信息
  GET_USERINFO: `${baseUrl}/users/info`,
};