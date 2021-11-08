import React, { useState, useEffect,setState } from 'react';
import { Modal, Input, Form, Button, Collapse, SearchBar } from "@chaoswise/ui";
import { useIntl } from "react-intl";
import styles from "./index.less";
import Card from '@/components/Card';
import { Icon, Select } from 'antd';
const { Option } = Select;
const { Panel } = Collapse;
export default Form.create({ name: "FORM_IN_PROJECT_MODAL" })(
    function EditProjectModal({ progressDetail, onSearch, onSave, btnTitle, state,searchContent }) {
        const intl = useIntl();
        let [checkFlag, setCheckFlag] = useState(false);
        return (
            <div className={styles.appList}>
                <Collapse defaultActiveKey={['1', '2']} ghost={true} bordered={false} >
                    <Panel className='usePanel' header={
                        <>
                            <span>{progressDetail.name}</span>
                            <span className={styles.title}>共</span>
                            <span>{progressDetail.apply.length}个应用</span>

                        </>
                    } extra={
                        <Button onClick={(e) => {
                            e.stopPropagation();
                            checkFlag=setCheckFlag(!checkFlag);
                            onSave && onSave();
                        }} type="primary" >{checkFlag?btnTitle[1]:btnTitle[0]}</Button>
                    }
                        key="1">
                        <Card value={progressDetail.apply} checkFlag={checkFlag} showFotter={true} showFotter={false} />
                    </Panel>
                    <Panel header={state == 2 ? <>
                        <span>从组件库中选择项目组件 </span> <span className={styles.rightTitle}>*下方列表中展示的是项目组件，不包括基础组件</span>
                    </>
                        : '从应用模板中选择'} key="2" >
                        <SearchBar
                            searchContent={searchContent} showSearchCount={6}
                            onSearch={onSearch}
                        />
                        <Card value={progressDetail.apply} checkFlag={checkFlag} showFotter={true} showFotter={false} />
                    </Panel>
                </Collapse>
            </div>

        );
    }
);
