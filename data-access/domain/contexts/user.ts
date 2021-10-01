export class User implements UserDetails {
  id:string;
  firstName: string;
  lastName: string;
  email: string;
  schemaVersion: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDetails {
  id:string;
  firstName: string;
  lastName: string;
  email: string;
}