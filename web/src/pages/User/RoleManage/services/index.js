import { fetchGet, fetchPost } from "@/utils/request";
import API from "@/services/api";

export const getProjectManageListService = (options) => {
  //return fetchGet(API.GET_PROJECT_MANAGELIST_API, { params: options });

  return new Promise((res, rej) => {
    res({
      data: [
        {
          id: 1,
          rolename: "泡泡",
          describe: "admin管理员"

        },
        {
          id: 2,
          rolename: "花花",
          describe: "开发一部前端"

        },
      ],
      total: 10,
      currentPage: 1,
      pageSize: 20,
    });
  });
};

export const saveProjectService = (options) => {
  //return fetchPost(API.SAVE_PROJECT_API, { body: options });

  return new Promise((res, rej) => {
    res({
      code: 200
    });
  });
};

