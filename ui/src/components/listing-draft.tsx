import React, { FC, useState } from 'react';
import { useMutation } from "@apollo/client";
import { CategorySelection } from './category-selection';


import { ListingsFieldsFragment, ListingDraftUpdateDraftDocument, ListingDraftPublishDraftDocument, ListingDraft as ListingDraftInput } from '../generated';

export type ComponentProps =  ListingsFieldsFragment;

export const ListingDraft: FC<ComponentProps> = ({
  id,
  title,
  description,
  primaryCategory,
  draft,
}) => {

  const [updateDraft, { data, loading, error }] = useMutation(ListingDraftUpdateDraftDocument);
  const [publishDraft] = useMutation(ListingDraftPublishDraftDocument);


  if(!draft) {
    draft = {
      title: title?? "",
      description: description?? "",
      primaryCategory: {id:primaryCategory?.id?? ""},
    };
  }
  


  let titleElement: HTMLInputElement | null;
  
  let descriptionElement: HTMLInputElement | null = null;
  const [category, setCategory] = useState("");


  
  return <>
    <form
        onSubmit={e => {
          e.preventDefault();
          updateDraft({ variables: { 
            input : {
              id: id,
              title: titleElement?.value,
              description: descriptionElement?.value,
              primaryCategory: category
            } as ListingDraftInput
          } 
          });
        }}
      >
    <div>

      Title:
      <input
        type="text"
        ref={node => {
          titleElement = node;
        }}
      />
      <br/>
      Description:
      <input
        ref={node => {
          descriptionElement = node;
        }}
          
        />
      Category:
      <CategorySelection itemSelected={setCategory} /><br/>
      
      <button type="submit">Save Draft</button>


    </div>


    </form>
    <div>
      <button type="button" onClick={() => publishDraft({variables:{id:id}})}>Publish Draft {id} </button>
    </div>


    <div >{id} {description}</div>
  </>  
}