import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.ts';
import type {
	AccountPlanEntityReference,
	AccountPlanProps,
} from './account-plan.entity.ts';
import { AccountPlanFeature } from './account-plan-feature.ts';
import type { AccountPlanFeatureProps } from './account-plan-feature.entity.ts';
export class AccountPlan<props extends AccountPlanProps>
	extends DomainSeedwork.AggregateRoot<props, Passport>
	implements AccountPlanEntityReference
{
	private isNew: boolean = false;
	// private readonly visa: any; //AccountPlanVisa

	constructor(props: props, passport: Passport) {
		super(props, passport);
		// this.visa = passport.accountPlan.forAccountPlan(this);
		console.log('AccountPlan created with props:', this.isNew); // temporary to suppress unused variable warning
	}

	public static getNewInstance<props extends AccountPlanProps>(
		newProps: props,
		passport: Passport,
		planInfo: {
			name: string;
			description: string;
			billingPeriodLength: number;
			billingPeriodUnit: string;
			billingCycles: number;
			billingAmount: number;
			currency: string;
			setupFee: number;
			feature: AccountPlanFeatureProps;
		},
	): AccountPlan<props> {
		const newInstance = new AccountPlan(newProps, passport);
		newInstance.markAsNew();
		//field assignments
		newInstance.name = planInfo.name;
		newInstance.description = planInfo.description;
		newInstance.billingPeriodLength = planInfo.billingPeriodLength;
		newInstance.billingPeriodUnit = planInfo.billingPeriodUnit;
		newInstance.billingCycles = planInfo.billingCycles;
		newInstance.billingAmount = planInfo.billingAmount;
		newInstance.currency = planInfo.currency;
		newInstance.setupFee = planInfo.setupFee;
		newInstance.feature.activeReservations =
			planInfo.feature.activeReservations;
		newInstance.feature.bookmarks = planInfo.feature.bookmarks;
		newInstance.feature.itemsToShare = planInfo.feature.itemsToShare;
		newInstance.feature.friends = planInfo.feature.friends;
		newInstance.isNew = false;
		return newInstance;
	}

	private markAsNew(): void {
		this.isNew = true;
	}

	get name() {
		return this.props.name;
	}
	set name(value: string) {
		this.props.name = value;
	}
	get description() {
		return this.props.description;
	}
	set description(value: string) {
		this.props.description = value;
	}
	get billingPeriodLength() {
		return this.props.billingPeriodLength;
	}
	set billingPeriodLength(value: number) {
		this.props.billingPeriodLength = value;
	}
	get billingPeriodUnit() {
		return this.props.billingPeriodUnit;
	}
	set billingPeriodUnit(value: string) {
		this.props.billingPeriodUnit = value;
	}
	get billingCycles() {
		return this.props.billingCycles;
	}
	set billingCycles(value: number) {
		this.props.billingCycles = value;
	}
	get billingAmount() {
		return this.props.billingAmount;
	}
	set billingAmount(value: number) {
		this.props.billingAmount = value;
	}
	get currency() {
		return this.props.currency;
	}
	set currency(value: string) {
		this.props.currency = value;
	}
	get setupFee() {
		return this.props.setupFee;
	}
	set setupFee(value: number) {
		this.props.setupFee = value;
	}
	get feature(): AccountPlanFeature {
		return new AccountPlanFeature(this.props.feature);
	}

	get status() {
		return this.props.status;
	}
	set status(value: string) {
		this.props.status = value;
	}
	get cybersourcePlanId() {
		return this.props.cybersourcePlanId;
	}
	set cybersourcePlanId(value: string) {
		this.props.cybersourcePlanId = value;
	}
}
