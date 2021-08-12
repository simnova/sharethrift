import React, {FC, ReactNode } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import styles from './label.module.css'; 
import {UiChecksGrid,PencilSquare,CheckCircleFill,CalendarEventFill, BoxArrowRight, PlayCircleFill, PauseCircleFill, ClipboardX, Inbox} from 'react-bootstrap-icons';

export enum LabelType {
  Default = 'default',
  RequestSubmitted  = 'request-submitted',
  ListingDraft  = 'listing-draft',
  RequestAccepted  = 'request-accepted',
  PickupArranged = 'pickup-arranged',
  ReturnPending = 'return-pending',
  ListingSubmitted = 'listing-submitted',
  ListingPosted = 'listing-posted',
  ListingPaused = 'listing-paused',
  UpdateNeeded = 'update-needed',
  RequestReceived = 'request-received',
  RequestComplete = 'request-complete',
}

const ComponentPropTypes = {
  labelType: PropTypes.oneOf(Object.values(LabelType)),
  children: PropTypes.node,
}

interface ComponentProp {
  labelType?: LabelType,
  children?: ReactNode
}

export type ComponentProps = InferProps<typeof ComponentPropTypes> & ComponentProp;

function CustomIcon(props: any)  {
  const { labelType } = props;
  const propsWithoutLabelType = Object.assign({}, props, { labelType: null });
  let result = <></>
  switch (labelType) {
    case LabelType.Default:
    case LabelType.RequestSubmitted:
    case LabelType.RequestComplete:
    case LabelType.ListingSubmitted:
      result = <UiChecksGrid {...propsWithoutLabelType} />;
      break;
    case LabelType.ListingDraft:
      result = <PencilSquare  {...propsWithoutLabelType}/>;
      break;
    case LabelType.RequestAccepted:
      result = <CheckCircleFill  {...propsWithoutLabelType} />;
      break; 
    case LabelType.PickupArranged:
      result = <CalendarEventFill  {...propsWithoutLabelType} />;
      break;
    case LabelType.ReturnPending:
      result = <BoxArrowRight  {...propsWithoutLabelType}  />;
      break;
    case LabelType.ListingPosted:
      result = <PlayCircleFill  {...propsWithoutLabelType} />;
      break;
    case LabelType.ListingPaused:
      result = <PauseCircleFill  {...propsWithoutLabelType} />;
      break;
    case LabelType.UpdateNeeded:
      result = <ClipboardX  {...propsWithoutLabelType}  />;
      break;
    case LabelType.RequestReceived:
      result = <Inbox  {...propsWithoutLabelType} />;
      break;
  }
  return result 
}

export const Label: FC<ComponentProps> = ({
  labelType = LabelType.Default,
  children
  }) => {
  
    return (
      <div className={[styles[labelType],styles['label-common-style'], 'h6'].join(' ')}>
        {
          (labelType !== LabelType.Default) ?
          <CustomIcon labelType={labelType} viewBox={'0 0 18 18'} width={18} height={18} className={styles['icon']}  />
          : null
        }
        { children }
      </div>
    );

}