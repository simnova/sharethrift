import { DomainSeedwork } from "@cellix/domain-seedwork";
import type { Passport } from "../../passport.ts";
import type { ReservationRequestVisa } from "../reservation-request.visa.ts";
import {
  ReservationRequestStates,
} from "./reservation-request.value-objects.ts";
import * as ValueObjects from './reservation-request.value-objects.ts';

// Temporary Until listing task is completeted
export interface ListingEntityReference
  extends DomainSeedwork.DomainEntityProps {
  readonly title: string;
  readonly description: string;
}

// Temporary Until user task is completeted
export interface UserEntityReference extends DomainSeedwork.DomainEntityProps {
  readonly name: string;
  readonly email: string;
}

export interface ReservationRequestProps
  extends DomainSeedwork.DomainEntityProps {
    state: string;
    reservationPeriodStart: Date;
    reservationPeriodEnd: Date;
    readonly createdAt: Date;
    updatedAt: Date;
    readonly schemaVersion: string;
    listing: Readonly<ListingEntityReference>;
    loadListing(): Promise<ListingEntityReference>;
    reserver: Readonly<UserEntityReference>;
    loadReserver(): Promise<UserEntityReference>;
    closeRequested: boolean;
}

export interface ReservationRequestEntityReference
  extends Readonly<Omit<ReservationRequestProps, "listing" | "reserver">> {
  readonly listing: Readonly<ListingEntityReference>;
  readonly reserver: Readonly<UserEntityReference>;
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
    listing: ListingEntityReference,
    reserver: UserEntityReference,
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
      case ReservationRequestStates.RESERVATION_PERIOD:
        this.close();
        break;
      default:
        this.props.state = value;
        this.props.updatedAt = new Date();
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
    this.props.updatedAt = new Date();
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
    this.props.updatedAt = new Date();
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get schemaVersion(): string {
    // changed from number to string
    return this.props.schemaVersion;
  }

  get listing(): ListingEntityReference {
    return this.props.listing;
  }
  set listing(value: ListingEntityReference) {
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

  get reserver(): UserEntityReference {
    return this.props.reserver;
  }
  set reserver(value: UserEntityReference) {
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

  get closeRequested(): boolean {
    return this.props.closeRequested;
  }
  set closeRequested(value: boolean) {
    if (value) {
      this.requestClose();
    } else {
      this.props.closeRequested = false;
      this.props.updatedAt = new Date();
    }
  }
  //#endregion Properties

  async loadReserver(): Promise<UserEntityReference> {
    return await this.props.loadReserver();
  }

  async loadListing(): Promise<ListingEntityReference> {
    return await this.props.loadListing();
  }

  public accept(): void {
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
    this.props.updatedAt = new Date();
  }

  public reject(): void {
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
    this.props.updatedAt = new Date();
  }

  public cancel(): void {
    if (
      !this.visa.determineIf(
        (domainPermissions) => domainPermissions.canCancelRequest
      )
    ) {
      throw new DomainSeedwork.PermissionError(
        "You do not have permission to cancel this reservation request"
      );
    }

    if (!(this.props.state.valueOf() === ReservationRequestStates.REQUESTED || 
            this.props.state.valueOf() === ReservationRequestStates.REJECTED)) {
      throw new Error("Cannot cancel reservation in current state");
    }

    new ValueObjects.ReservationRequestStateValue(ReservationRequestStates.CANCELLED).valueOf();
    this.props.updatedAt = new Date();
  }

  public requestClose(): void {
    if (
      !this.visa.determineIf(
        (domainPermissions) => domainPermissions.canCloseRequest
      )
    ) {
      throw new DomainSeedwork.PermissionError(
        "You do not have permission to request close for this reservation request"
      );
    }

    if (!(this.props.state.valueOf() === ReservationRequestStates.ACCEPTED)) {
      throw new Error("Cannot close reservation in current state");
    }

    this.props.closeRequested = true;
    this.props.updatedAt = new Date();
  }

  public close(): void {
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

    this.props.state =  new ValueObjects.ReservationRequestStateValue(ReservationRequestStates.RESERVATION_PERIOD).valueOf();
    this.props.updatedAt = new Date();
  }

}
