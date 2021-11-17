import { fetchGet, fetchPost,fetchPut } from "@/utils/request";
import API from "@/services/api/application";
import APII from "@/services/api/component";
import APIII from "@/services/api/app";



export const reqApplicationList = (options) => {
  return fetchPost(API.GET_APPLICATION_LIST, { body: options });
};
export const reqTagsList = () => {
  return fetchGet(APII.GET_TAGS);
};
export const addApplication = (options) => {
  return fetchPost(API.ADD_APPLICATION_LIST, { body: options });
};
export const reqProjectList = () => {
  return fetchGet(APIII.GET_PROJECT_MANAGELIST_API );
};
