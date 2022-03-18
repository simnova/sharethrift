import React from 'react';
import { PageHeader } from 'antd';
import { SubPageLayout } from '../sub-page-layout';
import { useParams } from 'react-router-dom';
import { ListingCreateContainer } from '../components/listing-create-container';
import { ListingDetailContainer } from '../components/listing-detail-container';
import { ListingDraftPhotosEditContainer } from '../components/listing-draft-photos-edit-container';

export const ListingsDetail: React.FC<any> = (props) => {
  const params = useParams();
  
  if(params.listingId === 'new') {
    return (
      <SubPageLayout
        fixedHeader={false}
        header={
          <PageHeader 
            title="Create Listing" 
            onBack={() => window.history.back()} 
          />
        }
        >
        <ListingCreateContainer handle={params.handle} />
      </SubPageLayout>
    )
  }
  return (
    <SubPageLayout header={<PageHeader title="Listing Detail"  onBack={() => window.history.back()} />}>
      <ListingDetailContainer listingId={params.listingId} />
      <ListingDraftPhotosEditContainer listingId={params.listingId} />
    </SubPageLayout>
  )
}