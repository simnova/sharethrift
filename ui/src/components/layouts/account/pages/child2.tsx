import React from 'react';
import { Layout, PageHeader } from 'antd';
import { SubPageLayout } from '../sub-page-layout';

export const Child2: React.FC<any> = (props) => {

  return (
    <>
      <SubPageLayout header={<PageHeader title="Child3" />}>
        <h1>Child 2</h1>
        <h1>Child 2</h1>
        <h1>Child 2</h1>
        <h1>Child 2</h1>
        <h1>Child 2</h1>
      </SubPageLayout>
    </>

  )
}