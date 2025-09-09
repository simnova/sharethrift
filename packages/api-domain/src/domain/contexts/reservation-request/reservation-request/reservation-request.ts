import { DomainSeedwork } from "@cellix/domain-seedwork";
import type { Passport } from "../../passport.ts";
import type { ReservationRequestVisa } from "../reservation-request.visa.ts";
import {
  ReservationRequestStates,
} from "./reservation-request.value-objects.ts";
import * as ValueObjects from './reservation-request.value-objects.ts';
import type { ItemListingEntityReference } from '../../listing/item/item-listing.ts';
import type { PersonalUserEntityReference } from '../../user/personal-user/personal-user.ts'

export interface ReservationRequestProps
  extends DomainSeedwork.DomainEntityProps {
    state: string;
    reservationPeriodStart: Date;
    reservationPeriodEnd: Date;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly schemaVersion: string;
    listing: Readonly<ItemListingEntityReference>;
    loadListing(): Promise<ItemListingEntityReference>;
    reserver: Readonly<PersonalUserEntityReference>;
    loadReserver(): Promise<PersonalUserEntityReference>;
    closeRequestedBySharer: boolean;
    closeRequestedByReserver: boolean;
}

export interface ReservationRequestEntityReference
  extends Readonly<Omit<ReservationRequestProps, "listing" | "reserver">> {
  readonly listing: Readonly<ItemListingEntityReference>;
  readonly reserver: Readonly<PersonalUserEntityReference>;
}

export class ReservationRequest<props extends ReservationRequestProps>
  extends DomainSeedwork.AggregateRoot<props, Passport>
  implements ReservationRequestEntityReference
{
  //#region Fields
  private isNew: boolean = false;
  private readonly visa: ReservationRequestVisa;
  //#endregion Fields

  //#region Constructor
  constructor(props: props, passport: Passport) {
    super(props, passport);
    this.visa = passport.reservationRequest.forReservationRequest(this);
  }
  //#endregion Constructor

  //#region Methods
  public static getNewInstance<props extends ReservationRequestProps>(
    newProps: props,
    state: string,
    listing: ItemListingEntityReference,
    reserver: PersonalUserEntityReference,
    reservationPeriodStart: Date,
    reservationPeriodEnd: Date,
    passport: Passport
  ): ReservationRequest<props> {
    const instance = new ReservationRequest(newProps, passport);
    instance.markAsNew();
    instance.state = state;
    instance.listing = listing;
    instance.reserver = reserver;
    instance.reservationPeriodStart = reservationPeriodStart;
    instance.reservationPeriodEnd = reservationPeriodEnd;
    instance.isNew = false;
    return instance;
  }

  private markAsNew(): void {
    this.isNew = true;
  }

  //#region Properties
  get state(): string {
    return this.props.state;
  }
  set state(value: string) {
    switch (value) {
      case ReservationRequestStates.ACCEPTED:
        this.accept();
        break;
      case ReservationRequestStates.REJECTED:
        this.reject();
        break;
      case ReservationRequestStates.CANCELLED:
        this.cancel();
        break;
      case ReservationRequestStates.CLOSED:
        this.close();
        break;
    }
  }

  get reservationPeriodStart(): Date {
    return this.props.reservationPeriodStart;
  }
  set reservationPeriodStart(value: Date) {
    if (
      !this.isNew &&
      !this.visa.determineIf(
        (domainPermissions) => domainPermissions.canUpdateRequest
      )
    ) {
      throw new DomainSeedwork.PermissionError(
        "You do not have permission to update this reservation period"
      );
    }
    if (!value) {
      throw new DomainSeedwork.PermissionError(
        "value cannot be null or undefined"
      );
    }
    this.props.reservationPeriodStart = value;
  }

  get reservationPeriodEnd(): Date {
    return this.props.reservationPeriodEnd;
  }
  set reservationPeriodEnd(value: Date) {
    if (
      !this.isNew &&
      !this.visa.determineIf(
        (domainPermissions) => domainPermissions.canUpdateRequest
      )
    ) {
      throw new DomainSeedwork.PermissionError(
        "You do not have permission to update this reservation period"
      );
    }
    if (!value) {
      throw new DomainSeedwork.PermissionError(
        "value cannot be null or undefined"
      );
    }
    this.props.reservationPeriodEnd = value;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get schemaVersion(): string {
    return this.props.schemaVersion;
  }

  get listing(): ItemListingEntityReference {
    return this.props.listing;
  }
  set listing(value: ItemListingEntityReference) {
    if (
      !this.isNew &&
      !this.visa.determineIf(
        (domainPermissions) => domainPermissions.canUpdateRequest
      )
    ) {
      throw new DomainSeedwork.PermissionError(
        "You do not have permission to update this listing"
      );
    }
    if (value === null || value === undefined) {
      throw new DomainSeedwork.PermissionError(
        "value cannot be null or undefined"
      );
    }
    this.props.listing = value;
  }

  get reserver(): PersonalUserEntityReference {
    return this.props.reserver;
  }
  set reserver(value: PersonalUserEntityReference) {
    if (
      !this.isNew &&
      !this.visa.determineIf(
        (domainPermissions) => domainPermissions.canUpdateRequest
      )
    ) {
      throw new DomainSeedwork.PermissionError(
        "You do not have permission to update this reserver"
      );
    }
    if (value === null || value === undefined) {
      throw new DomainSeedwork.PermissionError(
        "value cannot be null or undefined"
      );
    }
    this.props.reserver = value;
  }

  get closeRequestedBySharer(): boolean {
    return this.props.closeRequestedBySharer;
  }
  set closeRequestedBySharer(value: boolean) {
    if (
      !this.visa.determineIf(
        (domainPermissions) => domainPermissions.canCloseRequest
      )
    ) {
      throw new DomainSeedwork.PermissionError(
        "You do not have permission to request close for this reservation request"
      );
    }

    if (this.props.state.valueOf() !== ReservationRequestStates.ACCEPTED) {
      throw new Error("Cannot close reservation in current state");
    }

    this.props.closeRequestedBySharer = value;
  }

  get closeRequestedByReserver(): boolean {
    return this.props.closeRequestedByReserver;
  }
  set closeRequestedByReserver(value: boolean) {
    if (
      !this.visa.determineIf(
        (domainPermissions) => domainPermissions.canCloseRequest
      )
    ) {
      throw new DomainSeedwork.PermissionError(
        "You do not have permission to request close for this reservation request"
      );
    }

    if (this.props.state.valueOf() !== ReservationRequestStates.ACCEPTED) {
      throw new Error("Cannot close reservation in current state");
    }

    this.props.closeRequestedByReserver = value;
  }

  //#endregion Properties

  async loadReserver(): Promise<PersonalUserEntityReference> {
    return await this.props.loadReserver();
  }

  async loadListing(): Promise<ItemListingEntityReference> {
    return await this.props.loadListing();
  }

  private accept(): void {
    if (
      !this.visa.determineIf(
        (domainPermissions) => domainPermissions.canAcceptRequest
      )
    ) {
      throw new DomainSeedwork.PermissionError(
        "You do not have permission to accept this reservation request"
      );
    }

    if (this.props.state.valueOf() !== ReservationRequestStates.REQUESTED) {
      throw new Error("Can only accept requested reservations");
    }

    this.props.state = new ValueObjects.ReservationRequestStateValue(ReservationRequestStates.ACCEPTED).valueOf();
  }

  private reject(): void {
    if (
      !this.visa.determineIf(
        (domainPermissions) => domainPermissions.canRejectRequest
      )
    ) {
      throw new DomainSeedwork.PermissionError(
        "You do not have permission to reject this reservation request"
      );
    }

    if (this.props.state.valueOf() !== ReservationRequestStates.REQUESTED) {
      throw new Error("Can only reject requested reservations");
    }

    this.props.state =  new ValueObjects.ReservationRequestStateValue(ReservationRequestStates.REJECTED).valueOf();
  }

  private cancel(): void {
    if (
      !this.visa.determineIf(
        (domainPermissions) => domainPermissions.canCancelRequest
      )
    ) {
      throw new DomainSeedwork.PermissionError(
        "You do not have permission to cancel this reservation request"
      );
    }

    if (this.props.state.valueOf() !== ReservationRequestStates.REQUESTED) {
      throw new Error("Cannot cancel reservation in current state");
    }

    this.props.state = new ValueObjects.ReservationRequestStateValue(ReservationRequestStates.CANCELLED).valueOf();
  }

  private close(): void {
    if (
      !this.visa.determineIf(
        (domainPermissions) => domainPermissions.canCloseRequest
      )
    ) {
      throw new DomainSeedwork.PermissionError(
        "You do not have permission to close this reservation request"
      );
    }

    if (this.props.state.valueOf() !== ReservationRequestStates.ACCEPTED) {
      throw new Error("Can only close accepted reservations");
    }

    if (!(this.props.closeRequestedBySharer || this.props.closeRequestedByReserver)) {
      throw new Error("Can only close reservation requests if at least one user requested it");
    }

    this.props.state =  new ValueObjects.ReservationRequestStateValue(ReservationRequestStates.CLOSED).valueOf();
  }

}
