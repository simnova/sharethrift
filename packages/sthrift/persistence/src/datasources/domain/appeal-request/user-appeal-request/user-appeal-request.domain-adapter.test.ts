import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { expect, vi } from 'vitest';
import { UserAppealRequestDomainAdapter } from './index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/user-appeal-request.domain-adapter.feature'),
);

function makeAppealRequestDoc() {
	return {
		_id: 'appeal-1',
		user: new MongooseSeedwork.ObjectId(),
		blocker: new MongooseSeedwork.ObjectId(),
		reason: 'Test reason',
		state: 'pending',
		type: 'harassment',
		set: function (key: string, value: unknown) {
			(this as Record<string, unknown>)[key] = value;
		},
		populate: function (_field: string) {
			return Promise.resolve(this);
		},
	};
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let doc: ReturnType<typeof makeAppealRequestDoc>;
	let adapter: UserAppealRequestDomainAdapter;

	BeforeEachScenario(() => {
		doc = makeAppealRequestDoc();
		adapter = new UserAppealRequestDomainAdapter(doc as never);
	});

	Background(({ Given, And }) => {
		Given('a UserAppealRequest document from the database', () => {
			// Document created in BeforeEachScenario
		});
		And('a UserAppealRequestDomainAdapter wrapping the document', () => {
			// Adapter created in BeforeEachScenario
		});
	});

	Scenario('Accessing user appeal request properties', ({ Then, And }) => {
		Then('the domain adapter should have a user property', () => {
			expect(adapter.user).toBeDefined();
		});

		And('the domain adapter should have a blocker property', () => {
			expect(adapter.blocker).toBeDefined();
		});

		And('the domain adapter should have a reason property', () => {
			expect(adapter.reason).toBeDefined();
		});

		And('the domain adapter should have a state property', () => {
			expect(adapter.state).toBeDefined();
		});

		And('the domain adapter should have a type property', () => {
			expect(adapter.type).toBeDefined();
		});
	});

	Scenario('Getting user appeal request user reference', ({ When, Then }) => {
		let user: unknown;

		When('I access the user property', () => {
			user = adapter.user;
		});

		Then('I should receive a PersonalUser reference with an id', () => {
			expect(user).toBeDefined();
			expect((user as { id: string }).id).toBeDefined();
		});
	});

	Scenario('Getting user appeal request blocker reference', ({ When, Then }) => {
		let blocker: unknown;

		When('I access the blocker property', () => {
			blocker = adapter.blocker;
		});

		Then('I should receive a PersonalUser reference with an id', () => {
			expect(blocker).toBeDefined();
			expect((blocker as { id: string }).id).toBeDefined();
		});
	});

	Scenario('Modifying user appeal request reason', ({ When, Then }) => {
		When('I set the reason to "Updated reason"', () => {
			adapter.reason = 'Updated reason';
		});

		Then('the reason should be "Updated reason"', () => {
			expect(adapter.reason).toBe('Updated reason');
		});
	});

	Scenario('Modifying user appeal request state', ({ When, Then }) => {
		When('I set the state to "accepted"', () => {
			adapter.state = 'accepted';
		});

		Then('the state should be "accepted"', () => {
			expect(adapter.state).toBe('accepted');
		});
	});

	Scenario('Setting user property with valid reference', ({ When, Then }) => {
		When('I set the user property with a valid reference', () => {
			const setSpy = vi.spyOn(doc, 'set');
			adapter.user = { id: '507f1f77bcf86cd799439011' } as never;
			expect(setSpy).toHaveBeenCalledWith('user', expect.any(MongooseSeedwork.ObjectId));
		});

		Then('the document user field should be updated', () => {
			// Verified in When block
		});
	});

	Scenario('Setting user property with missing id throws error', ({ When, Then }) => {
		When('I set the user property with a reference missing id', () => {
			expect(() => {
				adapter.user = {} as never;
			}).toThrow('user reference is missing id');
		});

		Then('it should throw an error about missing user id', () => {
			// Error thrown in When block
		});
	});

	Scenario('Setting blocker property with valid reference', ({ When, Then }) => {
		When('I set the blocker property with a valid reference', () => {
			const setSpy = vi.spyOn(doc, 'set');
			adapter.blocker = { id: '507f1f77bcf86cd799439022' } as never;
			expect(setSpy).toHaveBeenCalledWith('blocker', expect.any(MongooseSeedwork.ObjectId));
		});

		Then('the document blocker field should be updated', () => {
			// Verified in When block
		});
	});

	Scenario('Setting blocker property with missing id throws error', ({ When, Then }) => {
		When('I set the blocker property with a reference missing id', () => {
			expect(() => {
				adapter.blocker = {} as never;
			}).toThrow('blocker reference is missing id');
		});

		Then('it should throw an error about missing blocker id', () => {
			// Error thrown in When block
		});
	});

	Scenario('Loading user when populated as ObjectId', ({ When, Then, And }) => {
		When('the user is an ObjectId and I call loadUser', async () => {
			const oid = new MongooseSeedwork.ObjectId();
			doc.user = oid as never;
			doc.populate = vi.fn().mockResolvedValue({
				...doc,
				user: { id: '123', userType: 'personal-user' },
			});
			adapter = new UserAppealRequestDomainAdapter(doc as never);
			await adapter.loadUser();
		});

		Then('it should populate the user field', () => {
			expect(doc.populate).toHaveBeenCalledWith('user');
		});

		And('return a PersonalUserDomainAdapter', () => {
			expect(doc.user).toBeDefined();
		});
	});

	Scenario('Loading blocker when populated as ObjectId', ({ When, Then, And }) => {
		When('the blocker is an ObjectId and I call loadBlocker', async () => {
			const oid = new MongooseSeedwork.ObjectId();
			doc.blocker = oid as never;
			doc.populate = vi.fn().mockResolvedValue({
				...doc,
				blocker: { id: '123', userType: 'personal-user' },
			});
			adapter = new UserAppealRequestDomainAdapter(doc as never);
			await adapter.loadBlocker();
		});

		Then('it should populate the blocker field', () => {
			expect(doc.populate).toHaveBeenCalledWith('blocker');
		});

		And('return a PersonalUserDomainAdapter', () => {
			expect(doc.blocker).toBeDefined();
		});
	});
});
