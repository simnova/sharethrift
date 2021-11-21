import { EventBus } from './event-bus';

export interface PublishEvent<T> {
  publish( eventToPublish:T);
}

export class EventPublisher implements PublishEvent<any> {
  constructor(private eventBus:EventBus) {
  }

  publish(eventToPublish:any) {
    throw new Error('Method not implemented.');
    //this.eventBus.dispatch(eventToPublish);
  }  
}