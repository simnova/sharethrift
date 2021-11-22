import { Entity,EntityProps } from './entity';
import { CustomDomainEvent, DomainEvent } from './domain-event';

export interface RootEventRegistry {
  addDomainEvent<EventProps,T extends CustomDomainEvent<EventProps>>(event:new (aggregateId: string) => T,props:T['payload'] );
  addIntegrationEvent<EventProps,T extends CustomDomainEvent<EventProps>>(event:new (aggregateId: string) => T,props:T['payload'] );
}

export abstract class AggregateRoot<PropType extends EntityProps> extends Entity<PropType> implements RootEventRegistry {
  
  private domainEvents: DomainEvent[] = [];
  public addDomainEvent<EventProps,T extends CustomDomainEvent<EventProps>>(event:new (aggregateId: string) => T,props:T['payload'] ) {
    let eventToAdd = new event(this.props.id);
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
  public addIntegrationEvent<EventProps,T extends CustomDomainEvent<EventProps>>(event:new (aggregateId: string) => T,props:T['payload'] ) {
    let eventToAdd = new event(this.props.id);
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