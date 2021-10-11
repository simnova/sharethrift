import EventEmitter from "events";
import { CustomDomainEvent, DomainEvent } from "../../shared/domain-event";
import { EventBus } from "../../shared/event-bus";
import { HandleEvent, HandleEventImpl } from "../../shared/handle-event";

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
  dispatch<T extends DomainEvent>(event: T, data: any): void {
    console.log(`Dispatching event ${event.eventId} with data ${JSON.stringify(data)}`);
    this.broadcaster.broadcast(event.eventId, JSON.stringify(data));
  }
  register<T extends DomainEvent>(event: T, listener: HandleEvent<T>): void {
    this.broadcaster.on(event.eventId, listener.handle);
  }
  register2<EventProps,T extends CustomDomainEvent<EventProps>>(event:{eventId : string}, func:(payload:T['payload']) => Promise<void>): void {
    this.broadcaster.on(event.eventId, async (rawpayload:string) => {
      console.log(`Received event ${event.eventId} with data ${rawpayload}`);
      await func(JSON.parse(rawpayload));
    });
  }
  public static getInstance(): NodeEventBusImpl {
    if (!NodeEventBusImpl.instance) {
      NodeEventBusImpl.instance = new NodeEventBusImpl();
    }
    return NodeEventBusImpl.instance;
  }




}

export const NodeEventBus = NodeEventBusImpl.getInstance();