import { fetchGet, fetchPost ,fetchPut} from "@/utils/request";
import API from "@/services/api";

export const getUsertManageListService = (options) => {
  return fetchPost(API.GET_USER_MANAGELIST_API, { params: options });
};

export const changeUserInformation = (options) => {
  return fetchPut(API.CHANGE_USER+options.id, { body: options });

};

