import { mockInstance } from '@chaoswise/request';
import { demoListData } from './demoListConfig';

mockInstance.onGet("/get/basictablelist", {

}).reply((config) => {
  let filterData = demoListData;
  let resultData = [];
  let totalNum = 0;
  let currentPage = config.params.currentPage;
  let pageSize = config.params.pageSize;

  totalNum = filterData.length;
  resultData = filterData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return [200, {
    data: resultData,
    total: totalNum
  }];
});