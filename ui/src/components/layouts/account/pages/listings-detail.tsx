import React from 'react';
import { Layout, PageHeader } from 'antd';
import { SubPageLayout } from '../sub-page-layout';
import { useParams } from 'react-router-dom';
import { ListingCategorySelectionContainer } from '../components/listing-category-selection-container';
import { ListingCreateContainer } from '../components/listing-create-container';
import { ListingDetailContainer } from '../components/listing-detail-container';

export const ListingsDetail: React.FC<any> = (props) => {
  const params = useParams();
  
  if(params.listingId === 'new') {
    return (
      <SubPageLayout
        fixedHeader={false}
        header={<PageHeader title="Create Listing"  />}
        >
        <ListingCreateContainer handle={params.handle} />
      </SubPageLayout>
    )
  }
  return (
    <>
      <SubPageLayout header={<PageHeader title="Listing Detail" />}>
        <ListingDetailContainer listingId={params.listingId} />
      </SubPageLayout>
    </>

  )
}