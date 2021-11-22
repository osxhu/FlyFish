import { fetchGet, fetchPost } from "@/utils/request";
import API from "@/services/api/application";
import APP from "@/services/api/app";
import COMPONENTS from "@/services/api/component";

//应用列表
export const getApplicationTemplateService = (options) => {
  return fetchPost(API.GET_APPLICATION_LIST, { body: options });

};
//行业列表
export const getTradesService = (options) => {
  return fetchGet(APP.INDUSTRY_LIST, { params: options });
};

//标签列表
export const getTagsService = (options) => {
  return fetchGet(COMPONENTS.GET_TAGS, { params: options });
};
