import { Entity } from '../../shared/entity';
export class Photo extends Entity<PhotoProps> implements PhotoEntityReference {
  constructor(props: PhotoProps) { super(props); }

  get id(): string {return this.props.id;}
  get order(): number {return this.props.order;}
  get documentId(): string {return this.props.documentId;}

  public static create(props: NewPhoto): Photo {
    var newProps:PhotoProps =  Object.assign({ id: undefined }, props);
    return new Photo(newProps);
  }
}

export interface PhotoEntityReference {
  readonly id: string;
  readonly order: number;
  readonly documentId: string;
}

export class NewPhoto {
  readonly documentId: string;
  readonly order: number;
}

export interface PhotoProps {
  id: string;
  order: number;
  documentId: string;
}