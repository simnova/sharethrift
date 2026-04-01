// Resolve Gherkin pronoun references to actor names
export function resolveActorName(actorName: string, defaultName = 'Alice'): string {
	return /^(she|he|they)$/i.test(actorName) ? defaultName : actorName;
}

interface TestUserData {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
}

export function makeTestUserData(actorName: string, overrides?: Partial<TestUserData>): TestUserData {
	const defaultId = `test-user-${actorName.toLowerCase()}`;
	const defaultEmail = `${actorName.toLowerCase()}@test.com`;
	const defaultFirstName = actorName;
	const defaultLastName = 'Tester';

	return {
		id: overrides?.id ?? defaultId,
		email: overrides?.email ?? defaultEmail,
		firstName: overrides?.firstName ?? defaultFirstName,
		lastName: overrides?.lastName ?? defaultLastName,
	};
}
