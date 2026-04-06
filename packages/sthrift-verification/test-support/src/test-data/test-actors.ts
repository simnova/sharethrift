// Pre-defined test actors for acceptance tests
export interface TestActor {
	name: string;
	email: string;
	givenName: string;
	familyName: string;
}

const alice: TestActor = { name: 'Alice', email: 'alice@example.com', givenName: 'Alice', familyName: 'Smith' };
const bob: TestActor = { name: 'Bob', email: 'bob@example.com', givenName: 'Bob', familyName: 'Jones' };
const admin: TestActor = { name: 'Admin', email: 'admin@test.com', givenName: 'Admin', familyName: 'User' };

export const actors = { Alice: alice, Bob: bob, Admin: admin } as const;

export function getActor(name: string): TestActor {
	const actor = actors[name as keyof typeof actors];
	if (!actor) {
		throw new Error(`Unknown test actor "${name}". Known actors: ${Object.keys(actors).join(', ')}`);
	}
	return actor;
}

export const defaultActor: TestActor = alice;
