import EventEmitter from 'events';
import { CustomDomainEvent, DomainEvent } from '../../shared/domain-event';
import { EventBus } from '../../shared/event-bus';

class BroadCaster {
  private eventEmitter: EventEmitter;

  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  public broadcast(event: string, data: any) {
    this.eventEmitter.emit(event, data);
  }

  public on(event: string, listener: any) {
    this.eventEmitter.on(event, listener);
  }
}

class NodeEventBusImpl implements EventBus {
  private static instance: NodeEventBusImpl;
  private broadcaster: BroadCaster;

  private constructor() {
    this.broadcaster = new BroadCaster();
  }

  async dispatch<T extends DomainEvent>(event: new(...args:any) => T, data: any): Promise<void> {
    console.log(`Dispatching node event ${event.constructor.name} with data ${JSON.stringify(data)}`);
    this.broadcaster.broadcast(event.constructor.name, JSON.stringify(data));
  }
 
  register<EventProps,T extends CustomDomainEvent<EventProps>>(event:new(...args:any) => T, func:(payload:T['payload']) => Promise<void>): void {
    console.log(`Registering node event handler for: ${event.name}`);
    this.broadcaster.on(event.name, async (rawpayload:string) => {
      console.log(`Received node event ${event.name} with data ${rawpayload}`);
      try{
        await func(JSON.parse(rawpayload));
      } catch(e) {
        console.error(`Error handling node event ${event.name} with data ${rawpayload}`);
        console.error(e);
      }
    });
  }

  public static getInstance(): NodeEventBusImpl {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }
  
}

export const NodeEventBus = NodeEventBusImpl.getInstance();