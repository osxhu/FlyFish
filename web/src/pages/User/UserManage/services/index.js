import { fetchGet, fetchPost } from "@/utils/request";
import API from "@/services/api";

export const getUsertManageListService = (options) => {
  return fetchPost(API.GET_USER_MANAGELIST_API, { params: options });

  // return new Promise((res, rej) => {
  //   res({
  //     data: [
  //       {
  //         id: 1,
  //         username: "泡泡1",
  //         useremail: "21586671@qq.com",
  //         belongproject:"上海一步",
  //         phone:1823710398,
  //         createTime:'2021-04-90'

  //       },
  //     ],
  //     total: 10,
  //     currentPage: 1,
  //     pageSize: 20,
  //   });
  // });
};

export const saveProjectService = (options) => {
  //return fetchPost(API.SAVE_PROJECT_API, { body: options });

  return new Promise((res, rej) => {
    res({
      code: 200
    });
  });
};

