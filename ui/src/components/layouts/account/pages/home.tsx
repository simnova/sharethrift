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
        header={<PageHeader title='Home'/>}
      >
        
        <h3>Wecome to Sharethrift</h3>
        <p>
          Use the menu on the left to navigate to the different pages.<br/>
          <br/>
          <b>Profile</b> is used to set your personal information.<br/>
          <br/>
          <b>Account</b> you can share your account with others<br/>(you may have more than one account -- choose which account you want in the upper left of the screen).<br/>
          <br/>
          <b>Listings</b> stuff you want to share online to others.<br/>
        </p>



      </SubPageLayout>
    
      
    </>
  );
}