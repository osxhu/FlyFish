import { toMobx } from '@chaoswise/cw-mobx';
import { getApplicationTemplateService, getTradesService, getTagsService } from "../services";
import _ from "lodash";

const model = {
  // 唯一命名空间
  namespace: "ApplicationTemplate",
  // 状态
  state: {
    searchParams: {},
    applicationList: [],
    total: 0,
    pageSize: 12,
    curPage: 0,
    type: '',
  searchOptions: {},
    tradesList: [],
    tagsList: []
  },
  effects: {
    *getApplicationList(params = {}) {
      let options = {
        isLib: true,
        type: this.type || '2D',
        curPage: this.curPage,
        pageSize: this.pageSize,
        ...this.searchParams,
        ...this.searchOptions,
        ...params,
      };
      const res = yield getApplicationTemplateService(options);
      this.setApplicationList(res);
    },
    *getTradesList() {
      const res = yield getTradesService();
      this.setTradesList(res.data.list);
    },
    *getTagsList() {
      const res = yield getTagsService({ type: 'application' });
      this.setTagsList(res.data);
    },
  },
  reducers: {
    setOptions(options){
      this.searchOptions=options;
    },
    setTagsList(res) {
      this.tagsList = res;
    },
    setTradesList(res) {
      this.tradesList = res;
    },
    setType(str) {
      this.type = str;
    },
    setApplicationList(res) {
      this.applicationList = res.data;
      this.total = res.data.total;
      this.curPage = res.data.curPage;
      this.pageSize = res.data.pageSize;
    },
    setSearchParams(searchParams) {
      this.searchParams = searchParams || {};
    },
  },
};

export default toMobx(model);