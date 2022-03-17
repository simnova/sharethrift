import React from 'react';
import { Layout, PageHeader } from 'antd';
import { Header as CustomHeader } from '../../../header';
import { SubPageLayout } from '../sub-page-layout';


const { Content,Header } = Layout;

export const Home: React.FC = () => {
  return (
    <>
      <SubPageLayout
        fixedHeader={true}
        header={<PageHeader title='sample data'/>}
      >
        <CustomHeader isLoggedIn={false} />
          <h3>Categories</h3>

      </SubPageLayout>
    
      
    </>
  );
}