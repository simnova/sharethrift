import { NodeEventBus } from '../events/node-event-bus';
import { UserCreatedEvent } from '../../events/user-created';
import { AccountUnitOfWork } from '../persistance/repositories';
import { ExecutionContext } from '../persistance/execution-context';

export default () => { NodeEventBus.register(UserCreatedEvent, async (payload) => {

  console.log(`UserCreatedEvent -> CreateAccount Handler - Called with Payload: ${JSON.stringify(payload)} and UserId: ${payload.userId}`);
  const context = await ExecutionContext(payload.userId);
  await AccountUnitOfWork.withTransaction(context, async (repo) => {
    let accounts = await repo.getByUserId(payload.userId);
    if(!accounts || accounts.length == 0) {
      let newAccount = await repo.getNewInstance(payload.userId);
      console.log(`UserCreatedEvent -> CreateAccount Handler - Creating new Account: ${JSON.stringify(newAccount)}`);
      await repo.save(newAccount);
      console.log(`UserCreatedEvent -> CreateAccount Handler - Created new Account: ${JSON.stringify(newAccount)}`);
    }
  });

})};