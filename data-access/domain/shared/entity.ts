export interface EntityProps {
  readonly id:string;
}
export abstract class Entity<PropType extends EntityProps> {
  public constructor(public readonly props: PropType) {}
}