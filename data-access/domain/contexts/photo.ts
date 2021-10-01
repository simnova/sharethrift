export class Photo implements PhotoDetails {
  readonly id: string;
  readonly order: number;
  readonly documentId: string;
  isMarkedForDeletion: boolean = false;


}

export interface PhotoDetails {
  readonly id: string;
  readonly order: number;
  readonly documentId: string;
  readonly isMarkedForDeletion: boolean ;
}

export class NewPhoto {
  readonly documentId: string;
}