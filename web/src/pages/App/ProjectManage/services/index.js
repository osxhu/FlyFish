import { fetchGet, fetchPost } from "@/utils/request";
import API from "@/services/api";

export const getProjectManageListService = (options) => {
  //return fetchGet(API.GET_PROJECT_MANAGELIST_API, { params: options });

  return new Promise((res, rej) => {
    res({
      data: [
        {
          id: '011',
          projectMark: "12212",
          name: "test",
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

export const deleteProjectService = (options) => {
  //return fetchPost(API.SAVE_PROJECT_API, { body: options });
  return new Promise((res, rej) => {
    res({
      code: 200
    });
  });
};