import { ListingCreate } from './listing-create';
import { ListingCreateContainerCreateListingDocument, ListingNewDraft } from '../../../../generated';
import { useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { message } from 'antd';

export const ListingCreateContainer: React.FC<any> = (props) => {
  const params = useParams();
  const [createListing, { data, loading, error }] = useMutation(ListingCreateContainerCreateListingDocument);  

  const handleSave = async (values: any) => {
    var newDraft: ListingNewDraft = {
      ...values,
      accountHandle : params.handle
    }
    try {
      await createListing({
        variables: {
          input:newDraft
        }
      });
  
      message.success('Listing Created');
      
    } catch (error) {
      message.error(`Error creating listing: ${JSON.stringify(error)}`);
    }

  }

  const content = () => {
    if(loading) {
      return <div>Loading...</div>
    } else if(error) {  
      return <div>{JSON.stringify(error)}</div>
    } else {
      return <ListingCreate onSave={handleSave}  />
    }
  }

  return (
  <>{content()}</>
  )
  
}