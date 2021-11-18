import { fetchGet, fetchPost } from "@/utils/request";
import API from "@/services/api/application";

export const reqApplicationList = (options) => {
  return fetchPost(API.GET_APPLICATION_LIST, { body: options });
};

export const saveProjectService = (options) => {
  //return fetchPost(API.SAVE_PROJECT_API, { body: options });

  return new Promise((res, rej) => {
    res({
      code: 200
    });
  });
};

