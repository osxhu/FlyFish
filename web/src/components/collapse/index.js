import React, { useState } from 'react';
import { Form, Button, Collapse, SearchBar } from "@chaoswise/ui";
import { useIntl } from "react-intl";
import styles from "./index.less";
import Card from '@/components/Card';
const { Panel } = Collapse;
// 需要传递的数据格式
//  const collapseData=[
//     {
//         name:'北京项目test', //面板项目名称
//         data:progressDetail,  
//         btnMethod, //按钮的回调,
//         deleteMethod,//删除的回调
//         showCardFotter:true
//       },{
//         searchContent, //搜索框配置  
//         onSearch, //点击搜索的回调
//         state:1, //底部文字状态,1:应用模板  2:组件库
//         data:progressDetail, //card数据
//         showCardFotter:true //是否显示card组件底部文字显示
//       }
//     ];
export default Form.create({ name: "FORM_IN_PROJECT_COLLAPSE" })(
    function BasicCollapse({ collapseData }) {
        let [checkFlag, setCheckFlag] = useState(false);
        const lengthArr = collapseData.map((item, index) => (index + 1).toString());
        const panelArr = collapseData.map((item, index) => {
            if (index === 0) {
                return (
                    <Panel className='usePanel' header={
                        <>
                            <span>{item.name}</span>
                            <span className={styles.title}>共</span>
                            <span>{item.data.length}个应用</span>
                        </>
                    }
                        extra={
                            item.btnTitle && item.btnTitle.length > 1 ?
                                <Button onClick={(e) => {
                                    e.stopPropagation();
                                    setCheckFlag(!checkFlag);
                                }} type="primary" >{checkFlag ? item.btnTitle[1] : item.btnTitle[0]}</Button> : <Button onClick={(e) => {
                                    e.stopPropagation();
                                    item.onSave && item.onSave(item);
                                }} type="primary" >添加应用</Button>
                        }
                        key="1">
                        <Card value={item.data} checkFlag={checkFlag} showFotter={item.showCardFotter ? true : false} onDelete={item.onDelete} />
                    </Panel>);
            } else {
                return (
                    <Panel header={item.state == 2 ? <>
                        <span>从组件库中选择项目组件 </span> <span className={styles.rightTitle}>*下方列表中展示的是项目组件，不包括基础组件</span>
                    </>
                        : '从应用模板中选择'} key="2" >
                        {
                            item.searchContent ?
                                <SearchBar
                                    searchContent={item.searchContent} showSearchCount={6}
                                    onSearch={item.onSearch}
                                /> : null
                        }
                        <Card value={item.data} showFotter={item.showCardFotter ? true : false} />
                    </Panel>
                );
            }
        });
        return (
            <div className={styles.appList}>
                <Collapse defaultActiveKey={lengthArr} ghost={true} bordered={false} >
                    {panelArr}
                </Collapse>
            </div>
        );
    }
);
