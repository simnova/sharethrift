import { Entity, EntityProps } from "../../shared/entity";
import { PermissionsEntityReference, PermissionsProps } from "./permissions";

export interface RoleProps extends EntityProps {
  roleName: string;
  isDefault: boolean;
  permissions: PermissionsProps;
  createdAt: Date;
  updatedAt: Date;
}

export class Role extends Entity<RoleProps> implements RoleEntityReference{
  get roleName(): string { return this.props.roleName; }
  get isDefault(): boolean { return this.props.isDefault; }
  get permissions(): PermissionsEntityReference { return this.props.permissions; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }  
}

export interface RoleEntityReference extends Readonly<EntityProps>{
  readonly roleName: string;
  readonly isDefault: boolean;
  readonly permissions: PermissionsEntityReference;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}