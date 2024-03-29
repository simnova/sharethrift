import { Photo } from '../../../../infrastructure/data-sources/cosmos-db/models/listing';
import { PhotoProps } from '../../../contexts/listing/photo';
import { nanoid } from 'nanoid';


export class PhotoDomainAdapter implements PhotoProps {
  constructor(public readonly props: Photo) { }
  get id() {
    return this.props.id;
  }

  get order(): number { return this.props.order; }
  set order(order: number) { this.props.order = order; }

  getNewDocumentId(): string {
    return nanoid();
  }

  get documentId(): string { return this.props.documentId; }
  set documentId(documentId: string) { this.props.documentId = documentId; }
}