import { CustomDomainEvent, DomainEventBase } from '../shared/domain-event';

export interface PhotoDeletedProps {
  documentId:string;
}

export class ListingPhotoDeletedEvent extends DomainEventBase implements CustomDomainEvent<PhotoDeletedProps> {
  private _props: PhotoDeletedProps;
  constructor(aggregateRootId: string) {super(aggregateRootId);}

  get payload(): PhotoDeletedProps {return this._props;}
  set payload(props: PhotoDeletedProps) {this._props = props;}
}