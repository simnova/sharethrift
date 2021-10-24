import { Entity,EntityProps } from "./entity";
import { CustomDomainEvent, DomainEvent } from "./domain-event";

export abstract class AggregateRoot<PropType extends EntityProps> extends Entity<PropType>  {
  

  private domainEvents: DomainEvent[] = [];
  protected addDomainEvent<EventProps,T extends CustomDomainEvent<EventProps>>(event:new (aggregateId: string) => T,props:T['payload'] ) {
    var eventToAdd = new event(this.props.id);
    eventToAdd.payload = props;    
    this.domainEvents.push(eventToAdd);
  }
  public clearDomainEvents() { 
    this.domainEvents = [];
  }
  public getDomainEvents(): DomainEvent[] {
    return this.domainEvents;
  }

  private integrationEvents: DomainEvent[] = [];
  protected addIntegrationEvent<EventProps,T extends CustomDomainEvent<EventProps>>(event:new (aggregateId: string) => T,props:T['payload'] ) {
    var eventToAdd = new event(this.props.id);
    eventToAdd.payload = props;    
    this.integrationEvents.push(eventToAdd);
  }
  public clearIntegrationEvents() { 
    this.integrationEvents = [];
  }
  public getIntegrationEvents(): DomainEvent[] {
    return this.integrationEvents;
  }

}