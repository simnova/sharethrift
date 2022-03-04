import React from 'react';
import { Layout, PageHeader } from 'antd';
import { Header as CustomHeader } from '../../../header';
import { CategoryCreate } from '../../../../components/category-create';
import { Users } from '../../../../components/users';
import { ListingCreate } from '../../../listing-create';
import { Listings } from '../../../../components/listings';
import { UserCreate } from '../../../user-create';
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
          <h6>Create Category </h6>
          <CategoryCreate />

          <h3>Users</h3>
          <h6>Create User</h6>
          <UserCreate />
          <h6>All Users</h6>
          <Users />

          <h3>Listings</h3>
          <h6>Create Listing</h6>

          <div>
            <ListingCreate />
          </div>
          <h6>All Listings</h6>
          <Listings/>
      </SubPageLayout>
    
      
    </>
  );
}