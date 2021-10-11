import { PhotoProps } from '../contexts/photo';
import { CustomDomainEvent, DomainEventBase, DomainEventStaticProps, staticImplements } from '../shared/domain-event';

@staticImplements<DomainEventStaticProps>()
export class ListingPhotoAddedEvent extends DomainEventBase implements CustomDomainEvent<PhotoProps> {
  public static readonly eventId:string = "PhotoAddedEvent";
  private _props: PhotoProps;
  constructor(aggregateRootId: string) {
    super(ListingPhotoAddedEvent.eventId, aggregateRootId);
  }
  get payload(): PhotoProps {
    return this._props;
  }
  set payload(props: PhotoProps) {
    this._props = props;
  }
  
}