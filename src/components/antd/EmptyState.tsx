import React from 'react';
import {Empty} from 'antd';

const EmptyState = () => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
    <span>
     暂无数据
    </span>}/>;

export default EmptyState;