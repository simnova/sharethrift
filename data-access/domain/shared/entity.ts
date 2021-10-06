export abstract class Entity<PropType> {
  public constructor(public readonly props: PropType) {}
}