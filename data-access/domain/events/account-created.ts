import { CustomDomainEventImpl } from '../shared/domain-event';

export interface AccountCreatedProps {
  accountId: string;
  userId: string;
}

export class AccountCreatedEvent extends CustomDomainEventImpl<AccountCreatedProps>  {
  constructor(aggregateRootId: string) {super(aggregateRootId);}
}