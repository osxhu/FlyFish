import React from 'react';
import { message, Button, CWTable, Input, FilterDropDown } from '@chaoswise/ui';
import { observer, loadingStore, toJS } from '@chaoswise/cw-mobx';
import { Icon, Select } from 'antd';
import { useIntl } from "react-intl";
const { Option } = Select;
import store from '../model/index';
import Collapse from '@/components/collapse';
function SearchList({ onSearch,onSave ,onDelete}) {
  const intl = useIntl();
  const onAdd=()=>{};
  // 筛选搜索框内容配置
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
  const progressDetail = [{id:1, status: 2, title: '测试大屏44', development: 'jifwfeferf', create: '321321' }, { id:2,status: 2, title: '测试大屏55', development: 'eweqweq', create: 'vrevevr' }];
  const progressDetail1 = [{ status: 1, title: '面板测试1', development: '发热发', create: '321321' }, { status: 2, title: '面板测试2', development: 'eweqweq', create: 'vrevevr' }];

  // collaose的内容配置 
  const collapseData=[
    {
      name:'北京项目test',
      btnTitle:['编辑','完成'],
      data:progressDetail,
      btnMethod:onSave,
      onDelete
    },{
      searchContent, //搜索框配置  
      onSearch, //点击搜索的回调
      data:progressDetail1,
      showCardFotter:false,
      canAdd:true,
      state:2
    }
  ];
  return (
    < Collapse collapseData={collapseData} />
  );
}
export default SearchList;