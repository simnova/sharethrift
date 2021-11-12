import { Entity, EntityProps } from "../../shared/entity";
import { PermissionsEntityReference, PermissionsProps } from "./permissions";

export interface RoleProps extends EntityProps {
  roleName: string;
  isDefault: boolean;
  permissions: PermissionsProps;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoleEntityReference extends Readonly<Omit<RoleProps,'permissions'>>{
  readonly permissions: PermissionsEntityReference;
}

export class Role<props extends RoleProps> extends Entity<RoleProps> implements RoleEntityReference{
  constructor(props: props) { super(props); }
  get roleName(): string { return this.props.roleName; }
  get isDefault(): boolean { return this.props.isDefault; }
  get permissions(): PermissionsEntityReference { return this.props.permissions; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }  

  public static create(props: RoleProps, roleName:string,isDefault:boolean): Role<RoleProps> {
    var role = new Role(props);
    role.props.roleName = roleName;
    role.props.isDefault = isDefault;
    return role
  }
}