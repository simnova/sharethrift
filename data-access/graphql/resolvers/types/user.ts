export interface UserType {
  _id: string;
  schemaVersion?: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}