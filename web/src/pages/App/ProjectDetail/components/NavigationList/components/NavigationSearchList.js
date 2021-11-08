import React from 'react';
import { message, Button, CWTable, Input, FilterDropDown } from '@chaoswise/ui';
import { observer, loadingStore, toJS } from '@chaoswise/cw-mobx';
import { Icon, Select } from 'antd';
import { useIntl } from "react-intl";

const { Option } = Select;
import store from '../model/index';
import Collapse from '@/components/collapse';
const SearchList = observer(() => {
  /** 
   * getNavigationTableList 获取列表数据方法
   * total                  表格数据总条数
   * currentPage            当前页码
   * navigationListData     表格列表数据
   * loadingStore           loading状态监听
   * columns                表格列字段总集合
   * setColumns             处理表格列字段顺序
   * showColumns            初始表格展示列的字段集合
   * setShowColumns         处理 展示列 变化
   * tableColumns           表格正常显示的字段集合
   * getTableColumns        处理tableColumns的计算属性
   * selectItems            下拉筛选已选择字段集合
  */
  const { getNavigationTableList, getTableColumns } = store;
  const { total, currentPage, navigationListData } = store;
  const { columns, setColumns } = store;
  const { showColumns, setShowColumns } = store;
  const loading = loadingStore.loading['navigationStore/getNavigationTableList'];
  let navigationTableListData = toJS(navigationListData);
  let tableColumns = toJS(getTableColumns);
  let selectItems = toJS(showColumns);
  const intl = useIntl();

  // 顶部高级筛选搜索框内容配置
  const searchContent = [
    {
      components: (
        <Select mode="tags"
          id="name"
          key="name"
          name='行业'
          style={{ width: "170px" }}
          placeholder={
            intl.formatMessage({
              id: "common.pleaseSelect",
              defaultValue: "请选择",
            }) + "行业"
          }
        >
          <Option value="jack">Jack</Option>
          <Option value="lucy">Lucy</Option>
          <Option value="Yiminghe">yiminghe</Option>
        </Select>
      ),
    },
    {
      components: (
        <Input
          id="AppName"
          key="AppName"
          style={{ width: "170px" }}
          placeholder={intl.formatMessage({
            id: "pages.projectManage.searchInputPlaceholder",
            defaultValue: "输入应用名称进行查询",
          })}
        />
      ),
    },
    {
      components: (
        <Select mode="tags" id="ApplyLabel"
          key="ApplyLabel"
          name='标签' style={{ width: 170 }}
          placeholder={intl.formatMessage({
            id: "pages.projectManage.searchInputTag",
            defaultValue: "选择标签进行查询",
          })}
        >
          <Option value="jack">Jack</Option>
          <Option value="lucy">Lucy</Option>
          <Option value="Yiminghe">yiminghe</Option>
        </Select>
      ),
    },
  ];
  // 高级查询搜索
  const onSearch = (searchFields) => {
    getNavigationTableList({
      searchInfo: searchFields,
      currentPage: 1,
    });
  };
const btnTitleArr=['编辑','完成'];
  const progressDetail = {
    name: "北京项目A",
    apply: [{ status: 2, title: '测试大屏44', development: 'jifwfeferf', create: '321321' }, { status: 2, title: '测试大屏55', development: 'eweqweq', create: 'vrevevr' }]
  };
  const onSave = () => {
    console.log('子组件点击按钮了！');
  };
  // 分页、排序、筛选变化时触发
  const onPageChange = (currentPage, pageSize) => {
    getNavigationTableList({ currentPage, pageSize });
  };
  // 下拉筛选列变化处理
  const changeColumns = (selectedColumns) => {
    setShowColumns(selectedColumns);
  };
  // 下拉筛选列拖拽处理
  const handleExchangeOptions = (dragIndex, hoverIndex) => {
    setColumns(dragIndex, hoverIndex);
  };
  const handleExport = () => {
    message.success('导出数据');
  };
  return (
    < Collapse btnTitle={btnTitleArr} onSave={onSave} onSearch={onSearch} progressDetail={progressDetail} state={2} searchContent={searchContent} />
  );
});
export default SearchList;