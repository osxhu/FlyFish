/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-11-10 19:08:53
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-12-03 11:22:57
 */
/*
 * 应用
 */

const baseUrl = "/gateway/lcap";
export default {
  //用户列表
  GET_USER_MANAGELIST_API: `${baseUrl}/users/list`,
  //修改用户
  CHANGE_USER:`${baseUrl}/users/info/`,
  //获取用户信息
  GET_USERINFO: `${baseUrl}/users/info`,
};