import { CustomDomainEvent, DomainEvent } from "./domain-event";
import { HandleEvent } from "./handle-event";

export interface EventBus {
  dispatch<T extends DomainEvent>(event: T, data: any): void;
  register<T extends DomainEvent>(event: T,listener: HandleEvent<T>): void;
  register2<EventProps,T extends CustomDomainEvent<EventProps>>(event:{eventId : string}, func:(payload:T['payload']) => Promise<void>): void;
}
