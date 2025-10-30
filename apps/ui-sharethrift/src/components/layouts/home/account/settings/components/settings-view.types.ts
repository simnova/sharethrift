//will be removed when new collection AccountPlan is merged into main
export interface PlanOption {
	id: string;
	name: string;
	price: string;
	features: string[];
	isSelected: boolean;
	isPopular?: boolean;
}
