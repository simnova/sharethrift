import { CustomDomainEventImpl } from '../shared/domain-event';

export interface UserCreatedProps {
  userId: string;
}

export class UserCreatedEvent extends CustomDomainEventImpl<UserCreatedProps>  {
  constructor(aggregateRootId: string) {super(aggregateRootId);}
}