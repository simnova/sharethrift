import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { expect } from 'vitest';
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
});
