import { DomainExecutionContext } from '../contexts/context';
import { CustomDomainEventImpl } from '../shared/domain-event';

export interface UserCreatedProps {
  userId:string;
  context:DomainExecutionContext;
}

export class UserCreatedEvent extends CustomDomainEventImpl<UserCreatedProps>  {
  constructor(aggregateRootId: string) {super(aggregateRootId);}
}