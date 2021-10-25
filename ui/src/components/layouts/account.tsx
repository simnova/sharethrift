import React, { FC } from 'react';
import { Layout } from 'antd';
import { Header } from '../header';
import { CategoryCreate } from '../../components/category-create';
import { Users } from '../../components/users';
import { ListingCreate } from '../listing-create';
import { Listings } from '../../components/listings';
import { UserCreate } from '../user-create';

const { Content } = Layout;

export const Account: FC = () => {
  return (
    <>
      <h1>Account</h1>
      <Layout>
        <Header isLoggedIn={false} />
        <Content>
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
        </Content>
      </Layout>
    </>
  );
}