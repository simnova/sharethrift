// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
export interface Passport {}

export const PassportFactory = {
	forReadOnly(): Passport {
		return {} as Passport; // need to implement read only passport implementation in IAM section
	},
};
