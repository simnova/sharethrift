import { Entity, EntityProps } from "../../shared/entity";
import { Permissions, PermissionsEntityReference, PermissionsProps } from "./permissions";
import { AccountVisa } from "../iam/account-visa";

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
  constructor(props: props,private visa:AccountVisa) { 
    super(props); 
  }
  
  get roleName(): string { return this.props.roleName; }
  get isDefault(): boolean { return this.props.isDefault; }
  get permissions(): Permissions { return new Permissions(this.props.permissions,this.visa); }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }  

  public static create(props: RoleProps, roleName:string,isDefault:boolean, visa:AccountVisa): Role<RoleProps> {
    var role = new Role(props,visa);
    role.props.roleName = roleName;
    role.props.isDefault = isDefault;
    
    return role
  }

  public async setRoleName(roleName:string): Promise<void> {
    if(! await this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions)) {
      throw new Error('Cannot set role name');
    }
    this.props.roleName = roleName;
  }
}