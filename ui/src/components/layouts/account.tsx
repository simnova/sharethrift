import React, { FC } from 'react';
import { Layout } from 'antd';
import { Header } from '../header';
import { CategoryCreate } from '../../components/category-create';
import { Users } from '../../components/users';
import { ListingCreate } from '../listing-create';
import { Listings } from '../../components/listings';

const { Content } = Layout;

export const Account: FC = () => {
  return (
    <>
      <h1>Account</h1>
      <Layout>
        <Header isLoggedIn={false} />
        <Content>
          <CategoryCreate />
          <Users />
          <div>
            <ListingCreate />
          </div>
          <Listings/>
        </Content>
      </Layout>
    </>
  );
}