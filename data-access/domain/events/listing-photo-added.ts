import { PhotoProps } from '../contexts/listing/photo';
import { CustomDomainEvent, DomainEventBase } from '../shared/domain-event';

export class ListingPhotoAddedEvent extends DomainEventBase implements CustomDomainEvent<PhotoProps> {
  private _props: PhotoProps;
  constructor(aggregateRootId: string) {super(aggregateRootId);}

  get payload(): PhotoProps {return this._props;}
  set payload(props: PhotoProps) {this._props = props;}
}