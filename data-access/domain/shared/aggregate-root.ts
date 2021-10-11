import { Entity,EntityProps } from "./entity";
import { CustomDomainEvent, DomainEvent } from "./domain-event";

export abstract class AggregateRoot<PropType extends EntityProps> extends Entity<PropType>  {
  //todo: add domain events / integration events
  private domainEvents: DomainEvent[] = [];
  protected addDomainEvent<EventProps,T extends CustomDomainEvent<EventProps>>(event:new (aggregateId: string) => T,props:T['payload'] ) {
    var eventToAdd = new event(this.props.id);
    eventToAdd.payload = props;    
    this.domainEvents.push(eventToAdd);
  }
  protected clearDomainEvents() { 
    this.domainEvents = [];
  }
  public getDomainEvents(): DomainEvent[] {
    return this.domainEvents;
  }

}