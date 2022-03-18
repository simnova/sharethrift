import {Form, Input, Button, Card} from 'antd';
import { ListingCategorySelectionContainer } from './listing-category-selection-container';
import { ListingDraftTags } from './listing-draft-tags';
import { ListingDetailStatusHistory } from './listing-detail-status-history';
import { Label, LabelType } from '../../../label';
import React from 'react';

export const ListingDetail: React.FC<any> = (props:any) => {
  const [form] = Form.useForm();

  const getCurrentStatusCode = ():string => {
    if(!props.data.draft?.statusHistory || props.data.draft.statusHistory.length === 0){ return "DRAFT"; }
    props.data.draft.statusHistory.sort((a:any,b:any) => 
    {
      let aTime = (new Date(a.createdAt)).getTime();
      let bTime = (new Date(b.createdAt)).getTime();
      if(bTime > aTime){
        return 1;
      }else if(bTime < aTime){
        return -1;
      }else{
        return 0;
      }
    });
    var newestHistoryItem = props.data.draft.statusHistory[0];
    return newestHistoryItem.statusCode
  }

  const hasPhotos = () => {
    if(!props.data.draft?.photos || props.data.draft.photos.length === 0){ return false; }
    return true;
  }

  const requiredFieldsCompleted = () => {
    if(!props.data.draft.description || props.data.draft.description.trim().length == 0 ){ return false; } 
    if(!props.data.draft.title || props.data.draft.title.trim().length == 0 ){ return false; }
    if(!props.data.draft.primaryCategory){ return false; }
    return true;
  }

  const canPublish = () => {  
    if(!props || !props.data || !props.data.draft){ return false; }
    if(getCurrentStatusCode() !== "DRAFT"){ return false; }
    if(!requiredFieldsCompleted()){ return false; }
    if(!hasPhotos()){ return false; }
    return true;
  }

  var label = () => {
    var returnLabel:JSX.Element;
    switch (getCurrentStatusCode()) {
      case "DRAFT":
        returnLabel = <Label labelType={LabelType.ListingDraft}>Draft</Label>
        break;
      case "PENDING":
        returnLabel = <Label labelType={LabelType.ListingSubmitted}>Publish Requested</Label>
        break;
      case "APPROVED":
        returnLabel = <Label labelType={LabelType.ListingSubmitted}>Published</Label>
        break;     
  
      default:
        returnLabel = <Label labelType={LabelType.ListingPosted}> Published</Label>
        break;


/*
  <Label labelType={LabelType.RequestAccepted}>Request Accepted</Label>
  <Label labelType={LabelType.PickupArranged}>Pickup Arranged</Label>
  <Label labelType={LabelType.ReturnPending}>Return Pending</Label>
  <Label labelType={LabelType.ListingSubmitted}>Listing Submitted</Label>
  <Label labelType={LabelType.ListingPosted}>Listing Posted</Label>
  <Label labelType={LabelType.ListingPaused}>Listing Paused</Label>
  <Label labelType={LabelType.UpdateNeeded}>Update Needed</Label>
  <Label labelType={LabelType.RequestReceived}>Request Received</Label>
  <Label labelType={LabelType.RequestComplete}>Request Complete</Label>
  <Label labelType={LabelType.RequestCancelled}>Request Cancelled</Label>
*/
    }
    return returnLabel;
  }


     

  return (
    <div>
      {label()}
      
      {props.data.statusCode === "PUBLISHED" && <Button type="primary" onClick={props.onUnpublish}>Unpublish Listing</Button>}
      {getCurrentStatusCode() === "APPROVED" && <Button type="primary" onClick={props.onCreateDraft}>Create Draft</Button>}
      {(getCurrentStatusCode() === "DRAFT")&&(
        <Form
          layout='vertical'
          initialValues={props.data}
          form={form}
          onFinish={(values) => {
            props.onSave(values);
          }}
        >
          <Form.Item
            label="Title"
            name={['draft', 'title']}
            rules={[
              { required: true, message: 'Please input Title!' },
            ]}
          >
            <Input placeholder="Title" />
          </Form.Item>
          <Form.Item
            label="Description"
            name={['draft', 'description']}
            rules={[
              { required: true, message: 'Please input Description!' },
            ]}
          >
            <Input placeholder="Description" />
          </Form.Item>
          <Form.Item
            label="Primary Category"
            name={['draft', 'primaryCategory', 'id']}
            rules={[
              { required: true, message: 'Please select a Category!' },
            ]}
          >
            <ListingCategorySelectionContainer />
          </Form.Item>
          <Form.Item
            label="Tags"
            name={['draft', 'tags']}
          >
            <ListingDraftTags />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Update Listing
          </Button>
          <Card>
            <div>Current Status is Draft? {getCurrentStatusCode() === "DRAFT" ? "Yes" : "No" }</div>
            <div>Required Fields Completed? {requiredFieldsCompleted() ? "Yes" : "No" }</div>
            <div>Has Photos? {hasPhotos() ? "Yes" : "No" }</div>
            <Button type="primary" onClick={props.onPublish} disabled={!canPublish()}>
              Publish Listing
            </Button>
          </Card>
        </Form> 
      )}

      {props.data.draft.statusHistory && (
        <div>
          <h2>Status History</h2>
          <ListingDetailStatusHistory data={props.data.draft.statusHistory} />
        </div>  
      )}
    </div>
  )
}