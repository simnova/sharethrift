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
  let repoInstance: RepoMock;
  let eventBus: DomainSeedwork.EventBus;
  let integrationEventBus: DomainSeedwork.EventBus;
  let session: ClientSession;
  let mockModel: Model<MongoType>;
  let typeConverter: DomainSeedwork.TypeConverter<MongoType, PropType, unknown, AggregateRootMock>;

  const Passport = {};
  const TestRepoClass = RepoMock;

  let domainOperation: Mock<(repo: RepoMock) => Promise<void>>;

  const setupMockModelReturningAggregate = () => {
    (mockModel.findById as ReturnType<typeof vi.fn>).mockReturnValue({
      exec: vi.fn().mockResolvedValue({
        _id: 'agg-1',
        foo: 'old-foo',
      }),
    });
  };

  BeforeEachScenario(() => {
    session = {} as ClientSession;
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
    } as unknown as DomainSeedwork.EventBus;
    repoInstance = new RepoMock(
      vi.mocked({}),
      mockModel,
      typeConverter,
      eventBus,
      session,
    );
    unitOfWork = new MongoUnitOfWork(
      eventBus,
      integrationEventBus,
      mockModel,
      typeConverter,
      TestRepoClass,
    );
    domainOperation = vi.fn<(repo: RepoMock) => Promise<void>>(async (repo) => {
      const aggregate = await repo.get('agg-1');
      aggregate.foo = 'new-foo';
      await repo.save(aggregate);
    });
    vi.clearAllMocks();
    vi.spyOn(mongoose.connection, 'transaction').mockImplementation(
      async (cb: (session: ClientSession) => Promise<unknown>) => {
        return await cb({} as ClientSession);
      },
    );
    setupMockModelReturningAggregate();
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
      repoInstance.getIntegrationEvents = vi.fn(() => []) as typeof repoInstance.getIntegrationEvents;
      repoInstance.get = vi.fn().mockResolvedValue(
        new AggregateRootMock(
          {
            id: 'agg-1',
            foo: 'old-foo',
            createdAt: new Date(),
            updatedAt: new Date(),
            schemaVersion: '1',
          } as PropType,
          {},
        ),
      );
      repoInstance.save = vi.fn().mockResolvedValue(undefined);
    });
    When('the operation completes successfully', async () => {
      const dispatchMock = integrationEventBus.dispatch as unknown as Mock<
        (event: unknown, data: unknown) => Promise<void>
      >;
      domainOperation.mockClear();
      dispatchMock.mockClear();
      await unitOfWork.withTransaction(Passport, domainOperation);
    });
    Then('the transaction is committed and no events are dispatched', () => {
      const dispatchMock = integrationEventBus.dispatch as unknown as Mock<
        (event: unknown, data: unknown) => Promise<void>
      >;
      expect(domainOperation).toHaveBeenCalledWith(expect.any(TestRepoClass));
      expect(dispatchMock).not.toHaveBeenCalled();
    });
  });

  Scenario('Domain operation with no events, throws error', ({ Given, When, Then }) => {
    let domainError: Error;
    Given('a domain operation that emits no domain or integration events', () => {
      repoInstance.getIntegrationEvents = vi.fn(() => []) as typeof repoInstance.getIntegrationEvents;
      repoInstance.get = vi.fn().mockResolvedValue(
        new AggregateRootMock(
          {
            id: 'agg-1',
            foo: 'old-foo',
            createdAt: new Date(),
            updatedAt: new Date(),
            schemaVersion: '1',
          } as PropType,
          {},
        ),
      );
      repoInstance.save = vi.fn().mockResolvedValue(undefined);
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
      const dispatchMock = integrationEventBus.dispatch as unknown as Mock<
        (event: unknown, data: unknown) => Promise<void>
      >;
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
      customDomainOp = vi.fn<(repo: RepoMock) => Promise<void>>(async (repo) => {
        const aggregate = await repo.get('agg-1');
        aggregate.foo = 'new-foo';
        aggregate.addIntegrationEvent(TestEvent, event1.payload);
        aggregate.addIntegrationEvent(TestEvent, event2.payload);
        await repo.save(aggregate);
      });
    });
    When('the transaction completes successfully', async () => {
      const dispatchMock = integrationEventBus.dispatch as unknown as Mock<
        (event: unknown, data: unknown) => Promise<void>
      >;
      dispatchMock.mockClear();
      dispatchMock.mockResolvedValueOnce(undefined);
      dispatchMock.mockResolvedValueOnce(undefined);
      await unitOfWork.withTransaction(Passport, customDomainOp);
    });
    Then('all integration events are dispatched after the transaction commits', () => {
      const dispatchMock = integrationEventBus.dispatch as unknown as Mock<
        (event: unknown, data: unknown) => Promise<void>
      >;
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
      customDomainOp = vi.fn<(repo: RepoMock) => Promise<void>>(async (repo) => {
        const aggregate = await repo.get('agg-1');
        aggregate.foo = 'new-foo';
        aggregate.addIntegrationEvent(TestEvent, event1.payload);
        aggregate.addIntegrationEvent(TestEvent, event2.payload);
        await repo.save(aggregate);
      });
    });
    When('integration event dispatch fails', async () => {
      const dispatchMock = integrationEventBus.dispatch as unknown as Mock<
        (event: unknown, data: unknown) => Promise<void>
      >;
      dispatchMock.mockClear();
      dispatchMock.mockRejectedValueOnce(new Error('rejected promise'));
      await expect(unitOfWork.withTransaction(Passport, customDomainOp)).rejects.toThrow('rejected promise');
    });
    Then('the error from dispatch is propagated and the transaction is not rolled back by the unit of work', () => {
      const dispatchMock = integrationEventBus.dispatch as unknown as Mock<
        (event: unknown, data: unknown) => Promise<void>
      >;
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
      customDomainOp = vi.fn<(repo: RepoMock) => Promise<void>>(async (repo) => {
        const aggregate = await repo.get('agg-1');
        aggregate.foo = 'new-foo';
        aggregate.addIntegrationEvent(TestEvent, event1.payload);
        aggregate.addIntegrationEvent(TestEvent, event2.payload);
        await repo.save(aggregate);
      });
    });
    When('multiple integration events are emitted and all succeed', async () => {
      const dispatchMock = integrationEventBus.dispatch as unknown as Mock<
        (event: unknown, data: unknown) => Promise<void>
      >;
      dispatchMock.mockClear();
      dispatchMock.mockResolvedValueOnce(undefined);
      dispatchMock.mockResolvedValueOnce(undefined);
      await unitOfWork.withTransaction(Passport, customDomainOp);
    });
    Then('all are dispatched after the transaction', () => {
      const dispatchMock = integrationEventBus.dispatch as unknown as Mock<
        (event: unknown, data: unknown) => Promise<void>
      >;
      expect(dispatchMock).toHaveBeenCalledTimes(2);
    });
  });
});