import React, { FC, useState } from 'react';
import { useMutation } from "@apollo/client";
import { CategorySelection } from './category-selection';
import { ListingDraftTags } from './listing-draft-tags';
import { Input } from 'antd';


import { ListingsFieldsFragment, ListingDraftUpdateDraftDocument, ListingDraftPublishDraftDocument, ListingDraft as ListingDraftInput } from '../generated';

export type ComponentProps =  ListingsFieldsFragment;

export const ListingDraft: FC<ComponentProps> = ({
  id,
  title,
  description,
  tags,
  primaryCategory,
  draft,
}) => {
  const [titleDraft, setTitleDraft] = useState<string>(draft?.title ?? title ?? '');
  const [descriptionDraft, setDescriptionDraft] = useState<string>(draft?.description ?? description ?? '');
  const [updateDraft, { data, loading, error }] = useMutation(ListingDraftUpdateDraftDocument);
  const [publishDraft] = useMutation(ListingDraftPublishDraftDocument);

  const [draftTags, setDraftTags] = useState((draft?.tags ?? tags ?? []) as string[]);

  /*

  if(!draft) {
    draft = {
      title: title?? "",
      description: description?? "",
      primaryCategory: {id:primaryCategory?.id?? ""},
      tags: tags??[],
    };
  }
  */


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
              title: titleDraft,
              description: descriptionDraft,
              tags: draftTags,
              primaryCategory: category
            } as ListingDraftInput
          } 
          });
        }}
      >
    <div>

      Title:
      <Input
        defaultValue={titleDraft}
        onChange={e => setTitleDraft(e.target.value)}
      />
      <br/>
      Description:
      <Input.TextArea

        defaultValue={descriptionDraft}
        onChange={e => setDescriptionDraft(e.target.value)}
      />
    
      <br/>
      <ListingDraftTags defaultTags={draftTags} getTags={setDraftTags}/>

      <br/>
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