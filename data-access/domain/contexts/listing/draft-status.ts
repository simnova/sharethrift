import { Entity, EntityProps } from '../../shared/entity';
import * as ListingVO from './listing-value-objects';

export interface DraftStatusProps extends EntityProps {
  statusCode: string;
  statusDetail: string;
  createdAt: Date;
}

export interface DraftStatusEntityReference extends Readonly<DraftStatusProps> {}

export const DraftStatusCodes = {
  Draft : 'DRAFT',
  Pending : 'PENDING',
  Approved : 'APPROVED',
  Rejected : 'REJECTED'
}

export class NewStatus {
  readonly statusCode: ListingVO.DraftStatusCode;
  readonly statusDetail: ListingVO.StatusDetail;
}

export class DraftStatus extends Entity<DraftStatusProps> implements DraftStatusEntityReference {
  constructor(props: DraftStatusProps) { super(props); }

  get statusCode(): string {return this.props.statusCode;}
  get statusDetail(): string {return this.props.statusDetail;}
  get createdAt(): Date {return this.props.createdAt;}

  public static create(props: DraftStatusProps, status: NewStatus): DraftStatus {
    var newStatus = new DraftStatus(props);
    newStatus.setCode(status.statusCode);
    newStatus.setDetail(status.statusDetail);
    return newStatus;
  }

  private setCode(code: ListingVO.DraftStatusCode): void {
    this.props.statusCode = code.valueOf();
  }
  private setDetail(detail: ListingVO.StatusDetail): void {
    this.props.statusDetail = detail.valueOf();
  }
}