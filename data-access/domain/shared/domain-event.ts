export interface DomainEventStaticProps {
  readonly eventId: string;
}
export interface CustomDomainEvent<T> extends DomainEvent {
  get payload(): T;
  set payload(payload: T);
}


export function staticImplements<T>() {
  return <U extends T>(constructor: U) => {return constructor};
}

export interface DomainEvent {
  get aggregateId(): string;
  get eventId(): string;
}

export abstract class DomainEventBase implements DomainEvent {
    constructor(private readonly _eventId:string, private readonly _aggregateId: string ) {}
    get aggregateId():string {
      return this._aggregateId;
    }
    get eventId():string {
      return this._eventId;
    }
    
    
 
}

export abstract class CustomDomainEventImpl<T> extends DomainEventBase implements CustomDomainEvent<T> {
  private _payload: T;
  constructor(eventId:string, aggregateId: string ) {super(eventId, aggregateId)}
  get payload(): T {
    return this._payload;
  }
  set payload(payload: T) {
    this._payload = payload;
  }
}
