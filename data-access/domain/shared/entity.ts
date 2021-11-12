export interface EntityProps {
  readonly id:string; 

}

export interface EntityType<PropType extends EntityProps> {
  readonly id:string; 
}

export abstract class Entity<PropType extends EntityProps> {
  get id(): string {return this.props.id;}

  public constructor(public readonly props: PropType) {}
}