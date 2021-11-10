import { fetchGet, fetchPost, fetchPut, fetchDelete } from "@/utils/request";
import API from "@/services/api";

export const getUserListService = (options) => {
  return fetchGet(API.GET_ROLE_MANAGELIST_API, { params: options });

};

export const changeRole = (options) => {
  return fetchPut(API.CHANGE_ROLE + options.id + '/' + 'basic-info', { body: options });

};
export const addNewRole = (options) => {
  return fetchPost(API.NEW_ROLE, { body: options });
};

export const deleteOneRole = (options) => {
  return fetchDelete(API.DELETE_ROLE + options.id, { body: options });
};
