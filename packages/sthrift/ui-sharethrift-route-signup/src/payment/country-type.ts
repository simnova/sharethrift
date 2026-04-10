export type State = {
	stateName: string;
	stateCode: string;
};

export type Country = {
	countryName: string;
	countryCode: string;
	states: State[] | null;
};
