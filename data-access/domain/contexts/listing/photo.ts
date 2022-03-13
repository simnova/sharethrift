import { Entity, EntityProps } from '../../shared/entity';

export interface PhotoPropValues extends EntityProps {
  order: number;
  documentId: string;
  getNewDocumentId(): string;
}

export interface PhotoProps extends PhotoPropValues {
 
}

export interface PhotoEntityReference extends Readonly<PhotoPropValues> {}

export class NewPhoto {
  readonly documentId: string;
  readonly order: number;
}

export class Photo extends Entity<PhotoProps> implements PhotoEntityReference {
  constructor(props: PhotoProps) { super(props); }

  get order(): number {return this.props.order;}
  get documentId(): string {return this.props.documentId;}
  getNewDocumentId(): string {return this.props.getNewDocumentId();}


  /*
  public static create(props: NewPhoto): Photo {
    var newProps:PhotoProps =  Object.assign({ id: undefined }, props);
    return new Photo(newProps);
  }
  */
}