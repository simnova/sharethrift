import { Photo } from "../../../../infrastructure/data-sources/cosmos-db/models/listing";
import { PhotoProps } from "../../../contexts/listing/photo";

export class PhotoDomainAdapter implements Photo {
  constructor(public readonly props: PhotoProps) { }
  get id() {
    return this.props.id;
  }

  get order(): number { return this.props.order; }
  set order(order: number) { this.props.order = order; }

  get documentId(): string { return this.props.documentId; }
  set documentId(documentId: string) { this.props.documentId = documentId; }
}