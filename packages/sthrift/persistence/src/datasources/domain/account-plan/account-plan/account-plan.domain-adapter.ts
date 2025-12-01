import { Domain } from '@sthrift/domain';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';

export class AccountPlanConverter extends MongooseSeedwork.MongoTypeConverter<
	Models.AccountPlan.AccountPlan,
	AccountPlanDomainAdapter,
	Domain.Passport,
	Domain.Contexts.AccountPlan.AccountPlan.AccountPlan<AccountPlanDomainAdapter>
> {
	constructor() {
		super(
			AccountPlanDomainAdapter,
			Domain.Contexts.AccountPlan.AccountPlan
				.AccountPlan<AccountPlanDomainAdapter>,
		);
	}
}

export class AccountPlanDomainAdapter
	extends MongooseSeedwork.MongooseDomainAdapter<Models.AccountPlan.AccountPlan>
	implements Domain.Contexts.AccountPlan.AccountPlan.AccountPlanProps
{
	get name(): string {
		return this.doc.name;
	}
	set name(name: string) {
		this.doc.name = name;
	}

	get description(): string {
		return this.doc.description;
	}
	set description(description: string) {
		this.doc.description = description;
	}

	get billingPeriodLength(): number {
		return this.doc.billingPeriodLength;
	}
	set billingPeriodLength(length: number) {
		this.doc.billingPeriodLength = length;
	}

	get billingPeriodUnit(): string {
		return this.doc.billingPeriodUnit;
	}
	set billingPeriodUnit(unit: string) {
		this.doc.billingPeriodUnit = unit;
	}
	get billingCycles(): number {
		return this.doc.billingCycles;
	}
	set billingCycles(cycles: number) {
		this.doc.billingCycles = cycles;
	}
	get billingAmount(): number {
		return this.doc.billingAmount;
	}
	set billingAmount(amount: number) {
		this.doc.billingAmount = amount;
	}
	get currency(): string {
		return this.doc.currency;
	}
	set currency(currency: string) {
		this.doc.currency = currency;
	}
	get setupFee(): number {
		return this.doc.setupFee;
	}
	set setupFee(fee: number) {
		this.doc.setupFee = fee;
	}
	get feature(): Domain.Contexts.AccountPlan.AccountPlan.AccountPlanFeatureProps {
		if (!this.doc.feature) {
			this.doc.set('feature', {} as Models.AccountPlan.AccountPlanFeature);
		}
		return new AccountPlanFeatureDomainAdapter(this.doc.feature);
	}

	get status(): string {
		return this.doc.status;
	}
	set status(status: string) {
		this.doc.status = status;
	}

	get cybersourcePlanId(): string {
		return this.doc.cybersourcePlanId;
	}
	set cybersourcePlanId(planId: string) {
		this.doc.cybersourcePlanId = planId;
	}
}

export class AccountPlanFeatureDomainAdapter
	implements Domain.Contexts.AccountPlan.AccountPlan.AccountPlanFeatureProps
{
	public readonly props: Models.AccountPlan.AccountPlanFeature;
	constructor(props: Models.AccountPlan.AccountPlanFeature) {
		this.props = props;
	}

	get activeReservations(): number {
		return this.props.activeReservations;
	}
	set activeReservations(count: number) {
		this.props.activeReservations = count;
	}
	get bookmarks(): number {
		return this.props.bookmarks;
	}
	set bookmarks(count: number) {
		this.props.bookmarks = count;
	}
	get itemsToShare(): number {
		return this.props.itemsToShare;
	}
	set itemsToShare(count: number) {
		this.props.itemsToShare = count;
	}
	get friends(): number {
		return this.props.friends;
	}
	set friends(count: number) {
		this.props.friends = count;
	}
}
