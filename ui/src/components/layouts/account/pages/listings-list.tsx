import React from 'react';
import { PageHeader } from 'antd';
import { SubPageLayout } from '../sub-page-layout';
import { useParams } from 'react-router-dom';
import { ListingsListContainer } from '../components/listings-list-container'
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export const ListingsList: React.FC<any> = (props) => {
  const params = useParams();
  const navigate = useNavigate();
  return (
    <>
      <SubPageLayout
        fixedHeader={false}
        header={<PageHeader title="Listings"  />}
        >
          <ListingsListContainer data={{handle:params.handle}} />
          <Button type="primary" onClick={() => navigate('new')}>Add New</Button>

      </SubPageLayout>
      
    </>

  )
}