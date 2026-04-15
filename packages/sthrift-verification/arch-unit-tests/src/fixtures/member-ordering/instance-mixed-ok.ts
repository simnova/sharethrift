export class InstanceMixedOk {
  private readonly id = 'fixture';

  constructor() {}

  get label(): string {
    return this.id;
  }

  set label(value: string) {
    void value;
  }

  doThing(): string {
    return this.id;
  }
}
