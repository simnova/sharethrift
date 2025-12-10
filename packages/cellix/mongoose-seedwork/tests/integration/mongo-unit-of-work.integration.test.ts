import {
	describe,
	it,
	expect,
	beforeAll,
	afterAll,
	beforeEach,
	vi,
} from 'vitest';
import mongoose, { Schema, model, type Model } from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { DomainSeedwork } from '@cellix/domain-seedwork';
import {
	InProcEventBusInstance,
	NodeEventBusInstance,
} from '@cellix/event-bus-seedwork-node';
import { MongoUnitOfWork } from '../../src/mongoose-seedwork/mongo-unit-of-work';
import { MongoRepositoryBase } from '../../src/mongoose-seedwork/mongo-repository';
import { MongoTypeConverter } from '../../src/mongoose-seedwork/mongo-type-converter';
import type { Base } from '../../src/mongoose-seedwork/base';
import { MongooseDomainAdapter } from '../../src/mongoose-seedwork/mongo-domain-adapter';
// Import your DomainSeedwork and any other needed types

// 1. Define a minimal aggregate root and type converter for integration
interface TestProps {
	id: string;
	foo: string;
	bar?: string;
	baz?: string;
	createdAt: Date;
	updatedAt: Date;
	schemaVersion: string;
}
interface TestMongoType extends Base {
	foo: string;
	bar?: string;
	baz?: string;
	createdAt: Date;
	updatedAt: Date;
	schemaVersion: string;
}
class TestAggregate<
	props extends TestProps,
> extends DomainSeedwork.AggregateRoot<props, unknown> {
	static getNewInstance<props extends TestProps>(
		newProps: props,
		foo: string,
		passport: unknown,
	): TestAggregate<props> {
		console.log('getNewInstance called');
		const newInstance = new TestAggregate(newProps, passport);
		newInstance.foo = foo;
		return newInstance;
	}
	// Implement minimal aggregate root logic for integration
	get foo() {
		return this.props.foo;
	}
	set foo(foo: string) {
		this.props.foo = foo;
	}
	get bar() {
		return this.props.bar;
	}
	set bar(bar: string | undefined) {
		const oldBar = this.props.bar;
		if (oldBar !== bar && bar !== undefined) {
			if (bar === '') {
				throw new Error('Too short');
			}
			this.props.bar = bar;
			this.addDomainEvent(TestBarDomainEvent, {
				oldBar,
				bar: this.props.bar,
			});
		}
	}
	get baz() {
		return this.props.baz;
	}
	set baz(baz: string | undefined) {
		const oldBaz = this.props.baz;
		if (oldBaz !== baz && baz !== undefined) {
			this.props.baz = baz;
			this.addDomainEvent(TestBazDomainEvent, {
				oldBaz,
				baz: this.props.baz,
			});
		}
	}
}

const TestSchema = new Schema<TestMongoType>({
	foo: { type: String, required: true },
	bar: { type: String, required: false },
	baz: { type: String, required: false },
	createdAt: Date,
	updatedAt: Date,
	schemaVersion: String,
});
let TestModel: Model<TestMongoType>;

// 2. Minimal type converter for integration
/**
 * TypeConverter implementation for TestAggregate and TestMongoType.
 * This converter uses the MongoTypeConverter abstract class to provide realistic
 * conversion between the domain aggregate and the Mongoose model for integration tests.
 */
class TestAdapter
	extends MongooseDomainAdapter<TestMongoType>
	implements TestProps
{
	get foo(): string {
		return this.doc.foo;
	}
	set foo(value: string) {
		this.doc.foo = value;
	}
	get bar(): string | undefined {
		return this.doc.bar;
	}
	set bar(value: string | undefined) {
		this.doc.bar = value;
	}
	get baz(): string | undefined {
		return this.doc.baz;
	}
	set baz(value: string | undefined) {
		this.doc.baz = value;
	}
}

class TestTypeConverter extends MongoTypeConverter<
	TestMongoType,
	TestAdapter,
	unknown,
	TestAggregate<TestAdapter>
> {
	constructor() {
		super(TestAdapter, TestAggregate);
	}
}

const typeConverter = new TestTypeConverter();

class TestBarDomainEvent extends DomainSeedwork.CustomDomainEventImpl<{
	oldBar?: string;
	bar: string;
}> {}
class TestBazDomainEvent extends DomainSeedwork.CustomDomainEventImpl<{
	oldBaz?: string;
	baz: string;
}> {}

class TestRepo extends MongoRepositoryBase<
	TestMongoType,
	TestAdapter,
	unknown,
	TestAggregate<TestAdapter>
> {
	getNewInstance(foo: string): TestAggregate<TestAdapter> {
		const adapter = typeConverter.toAdapter(new this.model());
		return TestAggregate.getNewInstance(adapter, foo, this.passport);
	}
}
const repoClass = TestRepo;

// 3. Minimal event bus for integration
const eventBus = InProcEventBusInstance;
const integrationEventBus = NodeEventBusInstance;

let mongoServer: MongoMemoryReplSet;
let uow: MongoUnitOfWork<
	TestMongoType,
	TestAdapter,
	unknown,
	TestAggregate<TestAdapter>,
	TestRepo
>;
describe('MongoUnitOfWork:Integration', () => {
	beforeAll(async () => {
		mongoServer = await MongoMemoryReplSet.create({
			replSet: { name: 'test' },
		});
		const uri = mongoServer.getUri();
		await mongoose.connect(uri, {
			retryWrites: false,
		});
		TestModel = model<TestMongoType>('Test', TestSchema);
	}, 60000); // Increase timeout to 60 seconds

	afterAll(async () => {
		await mongoose.disconnect();
		await mongoServer.stop();
	});

	beforeEach(async () => {
		await TestModel.deleteMany({});
		// biome-ignore lint:useLiteralKeys
		eventBus['eventSubscribers'] = {};
		integrationEventBus.removeAllListeners();
		uow = new MongoUnitOfWork(
			eventBus,
			integrationEventBus,
			TestModel,
			typeConverter,
			repoClass,
		);
	});
	describe('Scenario: Initializing the MongoUnitOfWork', () => {
		it('should initialize with all dependencies when valid params provided', () => {
			// Given: valid domain event bus, integration event bus, mongoose model, TypeConverter, and repository class
			// When: all dependencies provided to constructor
			// Then: MongoUnitOfWork initialized with all dependencies
			expect(uow.model).toBe(TestModel);
			expect(uow.typeConverter).toBe(typeConverter);
			expect(uow.bus).toBe(eventBus);
			expect(uow.integrationEventBus).toBe(integrationEventBus);
			expect(uow.repoClass).toBe(repoClass);
			expect(uow.withTransaction).toBeInstanceOf(Function);
		});
	});

	describe('Scenario: Executing a transaction on an aggregate with no side effects', () => {
		const createNewAggregateTransaction = async (repo: TestRepo) => {
			const aggregate = repo.getNewInstance('bar');
			await repo.save(aggregate);
		};

		it('should commit transaction and return new instance when creating TestAggregate', async () => {
			// Given: valid MongoUnitOfWork and valid props
			// When: withTransaction called to get new instance
			await uow.withTransaction({}, createNewAggregateTransaction);

			// Then: transaction commits and returns new instance
			const result = await TestModel.findOne({ foo: 'bar' }).exec();
			expect(result).not.toBeNull();
			expect(
				typeConverter.toDomain(result as TestMongoType, {} as unknown),
			).toBeInstanceOf(TestAggregate);
		});

		const id = new mongoose.Types.ObjectId('60c72b2f9b1e8d3f4c8b4567');
		const updateFooTransaction = async (repo: TestRepo) => {
			const aggregate = await repo.get(id.toString());
			aggregate.foo = 'new-foo';
			await repo.save(aggregate);
		};

		it('should update foo field in database after transaction commits', async () => {
			// Given: valid MongoUnitOfWork and existing TestAggregate
			await TestModel.create({
				_id: id.toString(),
				foo: 'old-foo',
				createdAt: new Date(),
				updatedAt: new Date(),
				schemaVersion: '1.0.0',
			});
			expect(await TestModel.findOne({ foo: 'old-foo' })).not.toBeNull();

			// When: withTransaction called to update foo field
			await uow.withTransaction({}, updateFooTransaction);

			// Then: foo field updated in database
			const updatedDoc = await TestModel.findById(id).exec();
			const updatedAggregate = typeConverter.toDomain(
				updatedDoc as TestMongoType,
				{} as unknown,
			);
			expect(updatedDoc).not.toBeNull();
			expect(updatedAggregate).toBeInstanceOf(TestAggregate);
			expect(updatedAggregate.foo).toBe('new-foo');
		});
	});

	describe('Scenario: Executing a transaction with domain events', () => {
		const id = new mongoose.Types.ObjectId('60c72b2f9b1e8d3f4c8b4567');

		const updateBarTransaction = async (repo: TestRepo, newValue: string) => {
			const aggregate = await repo.get(id.toString());
			aggregate.bar = newValue;
			await repo.save(aggregate);
		};

		const updateMultipleFieldsTransaction = async (repo: TestRepo, barValue: string, bazValue: string) => {
			const aggregate = await repo.get(id.toString());
			aggregate.bar = barValue;
			aggregate.baz = bazValue;
			await repo.save(aggregate);
		};

		// Keep async handler tests fast and deterministic by using a minimal timeout,
		// regardless of the requested delay value.
		const delay = (__ms: number = 1) => new Promise((resolve) => setTimeout(resolve, 1));

		beforeEach(async () => {
			await TestModel.create({
				_id: id.toString(),
				foo: 'old-foo',
				bar: 'old-bar',
				baz: 'old-baz',
				createdAt: new Date(),
				updatedAt: new Date(),
				schemaVersion: '1.0.0',
			});
		});

		it('should dispatch domain event with no handlers registered and transaction still commits', async () => {
			// Given: existing aggregate, spy on buses, NO handlers registered
			const eventBusDispatchSpy = vi.spyOn(eventBus, 'dispatch');
			const integrationEventBusDispatchSpy = vi.spyOn(
				integrationEventBus,
				'dispatch',
			);
			// Intentionally NOT registering any handlers

			// When: withTransaction updates bar field
			await uow.withTransaction({}, (repo) => updateBarTransaction(repo, 'new-bar'));

			// Then: domain event dispatched, transaction commits, no errors
			expect(eventBusDispatchSpy).toHaveBeenCalledWith(TestBarDomainEvent, {
				oldBar: 'old-bar',
				bar: 'new-bar',
			});
			expect(integrationEventBusDispatchSpy).not.toHaveBeenCalled();
			
			// Verify transaction committed successfully
			const updatedDoc = await TestModel.findById(id).exec();
			expect(updatedDoc).not.toBeNull();
			expect(updatedDoc?.bar).toBe('new-bar');
		});

		it('should dispatch domain event with one handler and no integration events', async () => {
			// Given: existing aggregate, spy on buses, handler registered
			const eventBusDispatchSpy = vi.spyOn(eventBus, 'dispatch');
			const integrationEventBusDispatchSpy = vi.spyOn(
				integrationEventBus,
				'dispatch',
			);
			const handler = vi.fn().mockImplementation(async (payload: { oldBar?: string; bar: string }) => {
				expect(payload).toEqual({ oldBar: 'old-bar', bar: 'new-bar' });
				console.log('Domain event handled:', payload);
				await Promise.resolve();
			});
			eventBus.register(TestBarDomainEvent, handler);

			// When: withTransaction updates bar field
			await uow.withTransaction({}, (repo) => updateBarTransaction(repo, 'new-bar'));

			// Then: domain event dispatched, handler executed, no integration events
			expect(eventBusDispatchSpy).toHaveBeenCalledWith(TestBarDomainEvent, {
				oldBar: 'old-bar',
				bar: 'new-bar',
			});
			expect(handler).toHaveBeenCalledWith({
				oldBar: 'old-bar',
				bar: 'new-bar',
			});
			expect(integrationEventBusDispatchSpy).not.toHaveBeenCalled();
		});

		it('should wait for async handler to complete', async () => {
			// Given: async handler with delay
			const eventBusDispatchSpy = vi.spyOn(eventBus, 'dispatch');
			const integrationEventBusDispatchSpy = vi.spyOn(
				integrationEventBus,
				'dispatch',
			);
			const handler = vi.fn().mockImplementation(async (payload: { oldBar?: string; bar: string }) => {
				expect(payload).toEqual({ oldBar: 'old-bar', bar: 'new-bar' });
				console.log('Domain event handled:', payload);
				await delay(10);
			});
			eventBus.register(TestBarDomainEvent, handler);

			// When: withTransaction updates bar field
			await uow.withTransaction({}, (repo) => updateBarTransaction(repo, 'new-bar'));

			// Then: unit of work waits for handler
			expect(eventBusDispatchSpy).toHaveBeenCalledWith(TestBarDomainEvent, {
				oldBar: 'old-bar',
				bar: 'new-bar',
			});
			expect(handler).toHaveBeenCalledWith({
				oldBar: 'old-bar',
				bar: 'new-bar',
			});
			expect(integrationEventBusDispatchSpy).not.toHaveBeenCalled();
		});

		it('should execute all handlers for one domain event', async () => {
			// Given: multiple handlers registered for one event
			const eventBusDispatchSpy = vi.spyOn(eventBus, 'dispatch');
			const integrationEventBusDispatchSpy = vi.spyOn(
				integrationEventBus,
				'dispatch',
			);
			const handler1 = vi.fn().mockImplementation(async (payload: { oldBar?: string; bar: string }) => {
				expect(payload).toEqual({ oldBar: 'old-bar', bar: 'new-bar' });
				console.log('TestBarDomainEvent handler1:', payload);
				await Promise.resolve();
			});
			const handler2 = vi.fn().mockImplementation(async (payload: { oldBar?: string; bar: string }) => {
				expect(payload).toEqual({ oldBar: 'old-bar', bar: 'new-bar' });
				console.log('TestBarDomainEvent handler2:', payload);
				await Promise.resolve();
			});
			eventBus.register(TestBarDomainEvent, handler1);
			eventBus.register(TestBarDomainEvent, handler2);

			// When: withTransaction updates bar field
			await uow.withTransaction({}, (repo) => updateBarTransaction(repo, 'new-bar'));

			// Then: all handlers executed
			expect(eventBusDispatchSpy).toHaveBeenCalledWith(TestBarDomainEvent, {
				oldBar: 'old-bar',
				bar: 'new-bar',
			});
			expect(handler1).toHaveBeenCalledWith({
				oldBar: 'old-bar',
				bar: 'new-bar',
			});
			expect(handler2).toHaveBeenCalledWith({
				oldBar: 'old-bar',
				bar: 'new-bar',
			});
			expect(integrationEventBusDispatchSpy).not.toHaveBeenCalled();
		});

		it('should dispatch multiple domain events with their handlers', async () => {
			// Given: handlers for different domain events
			const eventBusDispatchSpy = vi.spyOn(eventBus, 'dispatch');
			const integrationEventBusDispatchSpy = vi.spyOn(
				integrationEventBus,
				'dispatch',
			);

			const handler1 = vi.fn().mockImplementation(async (payload: { oldBar?: string; bar: string }) => {
				expect(payload).toEqual({ oldBar: 'old-bar', bar: 'new-bar' });
				console.log('TestBarDomainEvent handler: ', payload);
				await Promise.resolve();
			});
			const handler2 = vi.fn().mockImplementation(async (payload: { oldBaz?: string; baz: string }) => {
				expect(payload).toEqual({ oldBaz: 'old-baz', baz: 'new-baz' });
				console.log('TestBazDomainEvent handler: ', payload);
				await Promise.resolve();
			});
			eventBus.register(TestBarDomainEvent, handler1);
			eventBus.register(TestBazDomainEvent, handler2);

			// When: withTransaction updates multiple fields
			await uow.withTransaction({}, (repo) => updateMultipleFieldsTransaction(repo, 'new-bar', 'new-baz'));

			// Then: both events dispatched with correct payloads
			expect(eventBusDispatchSpy).toHaveBeenCalledWith(TestBarDomainEvent, {
				oldBar: 'old-bar',
				bar: 'new-bar',
			});
			expect(eventBusDispatchSpy).toHaveBeenCalledWith(TestBazDomainEvent, {
				oldBaz: 'old-baz',
				baz: 'new-baz',
			});
			expect(handler1).toHaveBeenCalledWith({
				oldBar: 'old-bar',
				bar: 'new-bar',
			});
			expect(handler2).toHaveBeenCalledWith({
				oldBaz: 'old-baz',
				baz: 'new-baz',
			});
			expect(integrationEventBusDispatchSpy).not.toHaveBeenCalled();
		});

		it('should execute all handlers for multiple domain events', async () => {
			// Given: multiple handlers for multiple events
			const eventBusDispatchSpy = vi.spyOn(eventBus, 'dispatch');
			const integrationEventBusDispatchSpy = vi.spyOn(
				integrationEventBus,
				'dispatch',
			);

			const barHandler1 = vi.fn().mockImplementation(async (payload: { oldBar?: string; bar: string }) => {
				expect(payload).toEqual({ oldBar: 'old-bar', bar: 'new-bar' });
				console.log('TestBarDomainEvent handler1:', payload);
				await Promise.resolve();
			});
			const barHandler2 = vi.fn().mockImplementation(async (payload: { oldBar?: string; bar: string }) => {
				expect(payload).toEqual({ oldBar: 'old-bar', bar: 'new-bar' });
				console.log('TestBarDomainEvent handler2:', payload);
				await Promise.resolve();
			});
			const bazHandler1 = vi.fn().mockImplementation(async (payload: { oldBaz?: string; baz: string }) => {
				expect(payload).toEqual({ oldBaz: 'old-baz', baz: 'new-baz' });
				console.log('TestBazDomainEvent handler1:', payload);
				await Promise.resolve();
			});
			const bazHandler2 = vi.fn().mockImplementation(async (payload: { oldBaz?: string; baz: string }) => {
				expect(payload).toEqual({ oldBaz: 'old-baz', baz: 'new-baz' });
				console.log('TestBazDomainEvent handler2:', payload);
				await Promise.resolve();
			});
			eventBus.register(TestBarDomainEvent, barHandler1);
			eventBus.register(TestBarDomainEvent, barHandler2);
			eventBus.register(TestBazDomainEvent, bazHandler1);
			eventBus.register(TestBazDomainEvent, bazHandler2);

			// When: withTransaction updates multiple fields
			await uow.withTransaction({}, (repo) => updateMultipleFieldsTransaction(repo, 'new-bar', 'new-baz'));

			// Then: all events and handlers executed
			expect(eventBusDispatchSpy).toHaveBeenCalledWith(TestBarDomainEvent, {
				oldBar: 'old-bar',
				bar: 'new-bar',
			});
			expect(eventBusDispatchSpy).toHaveBeenCalledWith(TestBazDomainEvent, {
				oldBaz: 'old-baz',
				baz: 'new-baz',
			});
			expect(barHandler1).toHaveBeenCalledWith({
				oldBar: 'old-bar',
				bar: 'new-bar',
			});
			expect(barHandler2).toHaveBeenCalledWith({
				oldBar: 'old-bar',
				bar: 'new-bar',
			});
			expect(bazHandler1).toHaveBeenCalledWith({
				oldBaz: 'old-baz',
				baz: 'new-baz',
			});
			expect(bazHandler2).toHaveBeenCalledWith({
				oldBaz: 'old-baz',
				baz: 'new-baz',
			});
			expect(integrationEventBusDispatchSpy).not.toHaveBeenCalled();
		});

		it('should abort transaction when handler fails', async () => {
			// Given: handler that throws
			const eventBusDispatchSpy = vi.spyOn(eventBus, 'dispatch');
			const integrationEventBusDispatchSpy = vi.spyOn(
				integrationEventBus,
				'dispatch',
			);
			const handler = vi.fn().mockImplementation(async (payload: { oldBar?: string; bar: string }) => {
				expect(payload).toEqual({ oldBar: 'old-bar', bar: 'new-bar' });
				await Promise.resolve();
				throw new Error('Handler failed');
			});
			eventBus.register(TestBarDomainEvent, handler);

			// When: withTransaction updates field
			// Then: transaction should abort
			await expect(
				uow.withTransaction({}, (repo) => updateBarTransaction(repo, 'new-bar')),
			).rejects.toThrow('Handler failed');

			expect(eventBusDispatchSpy).toHaveBeenCalledWith(TestBarDomainEvent, {
				oldBar: 'old-bar',
				bar: 'new-bar',
			});
			expect(handler).toHaveBeenCalledWith({
				oldBar: 'old-bar',
				bar: 'new-bar',
			});
			expect(integrationEventBusDispatchSpy).not.toHaveBeenCalled();
			const doc = await TestModel.findById(id).exec();
			expect(doc?.bar).toBe('old-bar');
		});

		it('should abort when first of multiple handlers fails', async () => {
			// Given: multiple handlers, first one throws
			const eventBusDispatchSpy = vi.spyOn(eventBus, 'dispatch');
			const integrationEventBusDispatchSpy = vi.spyOn(
				integrationEventBus,
				'dispatch',
			);
			const handler1 = vi.fn().mockImplementation(async (payload: { oldBar?: string; bar: string }) => {
				expect(payload).toEqual({ oldBar: 'old-bar', bar: 'new-bar' });
				await Promise.resolve();
				throw new Error('Handler1 failed');
			});
			const handler2 = vi.fn().mockImplementation(async (payload: { oldBar?: string; bar: string }) => {
				expect(payload).toEqual({ oldBar: 'old-bar', bar: 'new-bar' });
				await Promise.resolve();
			});
			eventBus.register(TestBarDomainEvent, handler1);
			eventBus.register(TestBarDomainEvent, handler2);

			// When: withTransaction updates field  
			// Then: first error aborts, second handler not called
			await expect(
				uow.withTransaction({}, (repo) => updateBarTransaction(repo, 'new-bar')),
			).rejects.toThrow('Handler1 failed');

			expect(eventBusDispatchSpy).toHaveBeenCalledWith(TestBarDomainEvent, {
				oldBar: 'old-bar',
				bar: 'new-bar',
			});
			expect(handler1).toHaveBeenCalledWith({
				oldBar: 'old-bar',
				bar: 'new-bar',
			});
			expect(handler2).not.toHaveBeenCalled();
			expect(integrationEventBusDispatchSpy).not.toHaveBeenCalled();
			const doc = await TestModel.findById(id).exec();
			expect(doc?.bar).toBe('old-bar');
		});

		it('should abort when async handler throws after delay', async () => {
			// Given: async handlers, first throws after delay
			const eventBusDispatchSpy = vi.spyOn(eventBus, 'dispatch');
			const integrationEventBusDispatchSpy = vi.spyOn(
				integrationEventBus,
				'dispatch',
			);
			const handler1 = vi.fn().mockImplementation(async (payload: { oldBar?: string; bar: string }) => {
				expect(payload).toEqual({ oldBar: 'old-bar', bar: 'new-bar' });
				await delay(20);
				throw new Error('Async handler1 failed');
			});
			const handler2 = vi.fn().mockImplementation(async (_payload: { oldBar?: string; bar: string }) => {
				// This should NOT be called
				await delay(20);
				throw new Error('Handler2 should not be called');
			});
			eventBus.register(TestBarDomainEvent, handler1);
			eventBus.register(TestBarDomainEvent, handler2);

			// When: withTransaction updates field
			// Then: async error aborts transaction
			await expect(
				uow.withTransaction({}, (repo) => updateBarTransaction(repo, 'new-bar')),
			).rejects.toThrow('Async handler1 failed');

			expect(eventBusDispatchSpy).toHaveBeenCalledWith(TestBarDomainEvent, {
				oldBar: 'old-bar',
				bar: 'new-bar',
			});
			expect(handler1).toHaveBeenCalledWith({
				oldBar: 'old-bar',
				bar: 'new-bar',
			});
			expect(handler2).not.toHaveBeenCalled();
			expect(integrationEventBusDispatchSpy).not.toHaveBeenCalled();
			const doc = await TestModel.findById(id).exec();
			expect(doc?.bar).toBe('old-bar');
		});

		it('should not dispatch events when invalid input causes value error', async () => {
			// Given: handler registered, invalid input
			const eventBusDispatchSpy = vi.spyOn(eventBus, 'dispatch');
			const integrationEventBusDispatchSpy = vi.spyOn(
				integrationEventBus,
				'dispatch',
			);
			const handler = vi.fn();
			eventBus.register(TestBarDomainEvent, handler);

			// When: withTransaction with invalid bar value
			// Then: error thrown, no events dispatched
			await expect(
				uow.withTransaction({}, (repo) => updateBarTransaction(repo, '')),
			).rejects.toThrow();

			expect(eventBusDispatchSpy).not.toHaveBeenCalled();
			expect(handler).not.toHaveBeenCalled();
			expect(integrationEventBusDispatchSpy).not.toHaveBeenCalled();
			const doc = await TestModel.findById(id).exec();
			expect(doc?.bar).toBe('old-bar');
	});

	// TODO: Scenario: Executing a transaction with integration events
	// The following tests need to be implemented:

	// TODO: Test definition: When withTransaction is called and integration event is added during aggregate save
	// Expected result: Then the integration event should be dispatched by integrationEventBus after the transaction commits
	// Arrange: spy on integrationEventBus.dispatch and add an integration event during aggregate.save
	// Act: call uow.withTransaction()
	// Assert: integration event dispatched after db commit

	// TODO: Test definition: When withTransaction is called but no integration event is registered
	// Expected result: Then no integration events should be dispatched
	// Arrange: Spy on integrationEventBus.dispatch
	// Act: update aggregate, don't register integration events
	// Assert: no dispatch calls

	// TODO: Test definition: When withTransaction is called and multiple integration events are added
	// Expected result: Then all integration events should be dispatched by integrationEventBus after the transaction commits
	// Arrange: add multiple integration events to aggregate
	// Act: save aggregate within transaction
	// Assert: all dispatched after commit

	// TODO: Test definition: When withTransaction is called and integration event handler throws
	// Expected result: Then the transaction should still commit and persist data, and the error should not abort the operation
	// Arrange: handler throws
	// Act: run transaction
	// Assert: db data is updated, error logged/thrown after commit

	// TODO: Test definition: When withTransaction is called and dispatching integration events is delayed
	// Expected result: Then the dispatching should not block transaction completion but should still be awaited
	// Arrange: delayed handler (e.g. sleep 100ms)
	// Act: run transaction
	// Assert: no early commit exit

	// TODO: Test definition: When withTransaction is called and both domain and integration events are registered
	// Expected result: Then domain events should be dispatched before the transaction commits and integration events after
	// Arrange: register domain event + integration event
	// Act: update aggregate and save
	// Assert: domain -> before, integration -> after

	// TODO: Test definition: When withTransaction is called and integration event dispatch fails fatally
	// Expected result: Then the transaction should commit, but the failure should be surfaced/logged appropriately
	// Arrange: integration bus dispatch throws
	// Act: run transaction
	// Assert: transaction commits, error captured

	// You can now add more integration tests for real transaction scenarios!
	});
});
