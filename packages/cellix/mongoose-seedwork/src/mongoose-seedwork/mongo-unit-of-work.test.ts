import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { ClientSession, Model } from 'mongoose';
import mongoose from 'mongoose';
import { expect, vi, type Mock } from 'vitest';
import type { Base } from './index.ts';
import { MongoRepositoryBase } from './mongo-repository.ts';
import { MongoUnitOfWork } from './mongo-unit-of-work.ts';


const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
  path.resolve(__dirname, 'features/mongo-unit-of-work.feature')
);

class AggregateRootMock extends DomainSeedwork.AggregateRoot<PropType, unknown> {
  get foo(): string { return this.props.foo; }
  set foo(foo: string) { this.props.foo = foo; }
  get createdAt(): Date { return this.props.createdAt; }
}
interface MongoType extends Base { foo: string; }
type PropType = DomainSeedwork.DomainEntityProps & {
  foo: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly schemaVersion: string;
};
class RepoMock extends MongoRepositoryBase<MongoType, PropType, unknown, AggregateRootMock> {}

class TestEvent extends DomainSeedwork.CustomDomainEventImpl<{ foo: string }> {}

vi.mock('mongoose', async () => {
  const original = await vi.importActual<typeof import('mongoose')>('mongoose');
  return {
    ...original,
    connection: {
      transaction: vi.fn(),
    },
  };
});

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
  let unitOfWork: MongoUnitOfWork<MongoType, PropType, unknown, AggregateRootMock, RepoMock>;
  let eventBus: DomainSeedwork.EventBus;
  type IntegrationDispatchMock = Mock<(event: unknown, data: unknown) => Promise<void>>;
  type IntegrationEventBusMock = {
    dispatch: IntegrationDispatchMock;
    register: Mock<(handler: unknown) => void>;
  };

  let integrationEventBus: IntegrationEventBusMock;
  let mockModel: Model<MongoType>;
  let typeConverter: DomainSeedwork.TypeConverter<MongoType, PropType, unknown, AggregateRootMock>;

  const Passport = {};
  const TestRepoClass = RepoMock;

  let domainOperation: Mock<(repo: RepoMock) => Promise<void>>;

  const getIntegrationDispatchMock = (): IntegrationDispatchMock => integrationEventBus.dispatch;

  const makeDomainOperation = (options?: {
    events?: Array<{ ctor: typeof TestEvent; payload: { foo: string } }>;
  }): Mock<(repo: RepoMock) => Promise<void>> =>
    vi.fn(async (repo: RepoMock) => {
      const aggregate = await repo.get('agg-1');
      aggregate.foo = 'new-foo';

      for (const event of options?.events ?? []) {
        aggregate.addIntegrationEvent(event.ctor, event.payload);
      }

      await repo.save(aggregate);
    });

  BeforeEachScenario(() => {
    mockModel = {
      findById: vi.fn().mockReturnValue({
        exec: vi.fn().mockResolvedValue({
          _id: 'agg-1',
          foo: 'old-foo',
        }),
      }),
    } as unknown as Model<MongoType>;
    typeConverter = vi.mocked({
      toAdapter: vi.fn(),
      toPersistence: vi.fn().mockImplementation(() => ({
        isModified: () => true,
        save: vi.fn().mockResolvedValue({
          _id: 'agg-1',
          foo: 'old`-foo',
        }),
      })),
      toDomain: vi.fn().mockResolvedValue(
        new AggregateRootMock(
          vi.mocked({ id: 'agg-1', foo: 'old-foo' } as PropType),
          vi.mocked({} as unknown)
        )
      ),
    }) as DomainSeedwork.TypeConverter<MongoType, PropType, unknown, AggregateRootMock>;
    eventBus = vi.mocked({
      dispatch: vi.fn(),
      register: vi.fn(),
    }) as DomainSeedwork.EventBus;
    integrationEventBus = {
      dispatch: vi.fn(),
      register: vi.fn(),
    };
    unitOfWork = new MongoUnitOfWork(
      eventBus,
      integrationEventBus as unknown as DomainSeedwork.EventBus,
      mockModel,
      typeConverter,
      TestRepoClass,
    );
    domainOperation = makeDomainOperation();
    vi.clearAllMocks();
    vi.spyOn(mongoose.connection, 'transaction').mockImplementation(
      async (cb: (session: ClientSession) => Promise<unknown>) => {
        return await cb({} as ClientSession);
      },
    );
  });

  Scenario('Initializing the MongoUnitOfWork', ({ Given, When, Then }) => {
    Given('all dependencies are provided', () => {
      // Setup is done in BeforeEachScenario
    });
    When('MongoUnitOfWork is instantiated', () => {
      // Instantiation is done in BeforeEachScenario
    });
    Then('it stores and exposes the dependencies correctly', () => {
      expect(unitOfWork.model).toBe(mockModel);
      expect(unitOfWork.typeConverter).toBe(typeConverter);
      expect(unitOfWork.bus).toBe(eventBus);
      expect(unitOfWork.integrationEventBus).toBe(integrationEventBus);
      expect(unitOfWork.repoClass).toBe(TestRepoClass);
    });
  });

  Scenario('Domain operation with no events, completes successfully', ({ Given, When, Then }) => {
    Given('a domain operation that emits no domain or integration events', () => {
      domainOperation = makeDomainOperation();
    });
    When('the operation completes successfully', async () => {
      const dispatchMock = getIntegrationDispatchMock();
      domainOperation.mockClear();
      dispatchMock.mockClear();
      await unitOfWork.withTransaction(Passport, domainOperation);
    });
    Then('the transaction is committed and no events are dispatched', () => {
      const dispatchMock = getIntegrationDispatchMock();
      expect(domainOperation).toHaveBeenCalledWith(expect.any(TestRepoClass));
      expect(dispatchMock).not.toHaveBeenCalled();
    });
  });

  Scenario('Domain operation with no events, throws error', ({ Given, When, Then }) => {
    let domainError: Error;
    Given('a domain operation that emits no domain or integration events', () => {
      domainOperation = makeDomainOperation();
      domainError = new Error('Domain failure');
    });
    When('the operation throws an error', async () => {
      const failingOperation = vi.fn((_repo: RepoMock) => {
        throw domainError;
      });
      await expect(
        unitOfWork.withTransaction(Passport, failingOperation),
      ).rejects.toThrow(domainError);
    });
    Then('the transaction is rolled back and no events are dispatched', () => {
      const dispatchMock = getIntegrationDispatchMock();
      expect(dispatchMock).not.toHaveBeenCalled();
    });
  });

  Scenario('Domain operation emits integration events, all dispatch succeed', ({ Given, When, Then }) => {
    let event1: TestEvent;
    let event2: TestEvent;
    let customDomainOp: Mock<(repo: RepoMock) => Promise<void>>;
    Given('integration events are emitted during the domain operation', () => {
      event1 = new TestEvent('id');
      event1.payload = { foo: 'bar1' };
      event2 = new TestEvent('id');
      event2.payload = { foo: 'bar2' };
      customDomainOp = makeDomainOperation({
        events: [
          { ctor: TestEvent, payload: event1.payload },
          { ctor: TestEvent, payload: event2.payload },
        ],
      });
    });
    When('the transaction completes successfully', async () => {
      const dispatchMock = getIntegrationDispatchMock();
      dispatchMock.mockClear();
      dispatchMock.mockResolvedValueOnce(undefined);
      dispatchMock.mockResolvedValueOnce(undefined);
      await unitOfWork.withTransaction(Passport, customDomainOp);
    });
    Then('all integration events are dispatched after the transaction commits', () => {
      const dispatchMock = getIntegrationDispatchMock();
      expect(dispatchMock).toHaveBeenCalledTimes(2);
      expect(dispatchMock).toHaveBeenNthCalledWith(1, event1.constructor, event1.payload);
      expect(dispatchMock).toHaveBeenNthCalledWith(2, event2.constructor, event2.payload);
    });
  });

  Scenario('Integration event dispatch fails', ({ Given, When, Then }) => {
    let event1: TestEvent;
    let event2: TestEvent;
    let customDomainOp: Mock<(repo: RepoMock) => Promise<void>>;
    Given('integration events are emitted during the domain operation', () => {
      event1 = new TestEvent('id');
      event1.payload = { foo: 'bar1' };
      event2 = new TestEvent('id');
      event2.payload = { foo: 'bar2' };
      customDomainOp = makeDomainOperation({
        events: [
          { ctor: TestEvent, payload: event1.payload },
          { ctor: TestEvent, payload: event2.payload },
        ],
      });
    });
    When('integration event dispatch fails', async () => {
      const dispatchMock = getIntegrationDispatchMock();
      dispatchMock.mockClear();
      dispatchMock.mockRejectedValueOnce(new Error('rejected promise'));
      await expect(unitOfWork.withTransaction(Passport, customDomainOp)).rejects.toThrow('rejected promise');
    });
    Then('the error from dispatch is propagated and the transaction is not rolled back by the unit of work', () => {
      const dispatchMock = getIntegrationDispatchMock();
      expect(dispatchMock).toHaveBeenCalledTimes(1);
    });
  });

  Scenario('Multiple integration events are emitted and all succeed', ({ Given, When, Then }) => {
    let event1: TestEvent;
    let event2: TestEvent;
    let customDomainOp: Mock<(repo: RepoMock) => Promise<void>>;
    Given('integration events are emitted during the domain operation', () => {
      event1 = new TestEvent('id');
      event1.payload = { foo: 'bar1' };
      event2 = new TestEvent('id');
      event2.payload = { foo: 'bar2' };
      customDomainOp = makeDomainOperation({
        events: [
          { ctor: TestEvent, payload: event1.payload },
          { ctor: TestEvent, payload: event2.payload },
        ],
      });
    });
    When('multiple integration events are emitted and all succeed', async () => {
      const dispatchMock = getIntegrationDispatchMock();
      dispatchMock.mockClear();
      dispatchMock.mockResolvedValueOnce(undefined);
      dispatchMock.mockResolvedValueOnce(undefined);
      await unitOfWork.withTransaction(Passport, customDomainOp);
    });
    Then('all are dispatched after the transaction', () => {
      const dispatchMock = getIntegrationDispatchMock();
      expect(dispatchMock).toHaveBeenCalledTimes(2);
    });
  });
});