import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.ts';
import type { ReservationRequestVisa } from '../reservation-request.visa.ts';
import { ReservationRequestStates } from './reservation-request.value-objects.ts';
import * as ValueObjects from './reservation-request.value-objects.ts';
import type { ItemListingEntityReference } from '../../listing/item/item-listing.entity.ts';
import type { PersonalUserEntityReference } from '../../user/personal-user/personal-user.entity.ts';
import type {
	ReservationRequestEntityReference,
	ReservationRequestProps,
} from './reservation-request.entity.ts';

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
		passport: Passport,
	): ReservationRequest<props> {
		const instance = new ReservationRequest(newProps, passport);
		instance.markAsNew();
		instance.listing = listing;
		instance.reserver = reserver;
		instance.reservationPeriodStart = reservationPeriodStart;
		instance.reservationPeriodEnd = reservationPeriodEnd;
		instance.props.state = state; // Set initial state directly
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
		console.log('Setting state to:', value);
		console.log('Current permissions:', this.passport?.reservationRequest);
		switch (value) {
			case ReservationRequestStates.ACCEPTED:
				console.log('Accepting request...');
				this.accept();
				break;
			case ReservationRequestStates.REJECTED:
				console.log('Rejecting request...');
				this.reject();
				break;
			case ReservationRequestStates.CANCELLED:
				console.log('Cancelling request...');
				this.cancel();
				break;
			case ReservationRequestStates.CLOSED:
				console.log('Closing request...');
				this.close();
				break;
            case ReservationRequestStates.REQUESTED:
				console.log('Setting to requested...');
                this.request();
                break;
		}
	}

  get reservationPeriodStart(): Date {
    return this.props.reservationPeriodStart;
  }
  set reservationPeriodStart(value: Date) {
		if (!value) {
			throw new DomainSeedwork.PermissionError(
				"value cannot be null or undefined"
			);
		}
		if (value.getTime() < Date.now()) {
			throw new DomainSeedwork.PermissionError(
				"Reservation period start date must be today or in the future"
			);
		}
		if (!this.isNew) {
			throw new DomainSeedwork.PermissionError(
				"Reservation period start date cannot be updated after creation"
			);
		}

    if (this.props.reservationPeriodEnd && value.getTime() >= this.props.reservationPeriodEnd.getTime()) {
        throw new DomainSeedwork.PermissionError(
            "Reservation period end date must be after the start date"
        );
    }
    this.props.reservationPeriodStart = value;
  }

  get reservationPeriodEnd(): Date {
    return this.props.reservationPeriodEnd;
  }
  set reservationPeriodEnd(value: Date) {
    if (!value) {
      throw new DomainSeedwork.PermissionError(
        "value cannot be null or undefined"
      );
    }
    if (value.getTime() < Date.now()) {
      throw new DomainSeedwork.PermissionError(
        "Reservation period end date must be in the future"
      );
    }
    if (this.props.reservationPeriodStart && value.getTime() <= this.props.reservationPeriodStart.getTime()) {
      throw new DomainSeedwork.PermissionError(
        "Reservation period end date must be after the start date"
      );
    }
    if (!this.isNew) {
      throw new DomainSeedwork.PermissionError(
        "You do not have permission to update this reservation period"
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
      !this.isNew
    ) {
      throw new DomainSeedwork.PermissionError(
        "Listing can only be set when creating a new reservation request"
      );
    }
    if (value === null || value === undefined) {
      throw new DomainSeedwork.PermissionError(
        "value cannot be null or undefined"
      );
    }

    if (value.state !== 'Published') {
        throw new DomainSeedwork.PermissionError(
            "Cannot create reservation request for listing that is not published"
        );
    }
    this.props.listing = value;
  }

  get reserver(): PersonalUserEntityReference {
    return this.props.reserver;
  }
  set reserver(value: PersonalUserEntityReference) {
    if (
      !this.isNew
    ) {
      throw new DomainSeedwork.PermissionError(
        "Reserver can only be set when creating a new reservation request"
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
				(domainPermissions) => domainPermissions.canCloseRequest,
			)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to request close for this reservation request',
			);
		}

		if (this.props.state !== ReservationRequestStates.ACCEPTED) {
			throw new Error('Cannot close reservation in current state');
		}

		this.props.closeRequestedBySharer = value;
	}

	get closeRequestedByReserver(): boolean {
		return this.props.closeRequestedByReserver;
	}
	set closeRequestedByReserver(value: boolean) {
		if (
			!this.visa.determineIf(
				(domainPermissions) => domainPermissions.canCloseRequest,
			)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to request close for this reservation request',
			);
		}

		if (this.props.state !== ReservationRequestStates.ACCEPTED) {
			throw new Error('Cannot close reservation in current state');
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
		console.log('In accept()...');
		console.log('Visa:', this.visa);
		const hasPermission = this.visa.determineIf(
			(domainPermissions) => domainPermissions.canAcceptRequest,
		);
		console.log('Has permission:', hasPermission);
		if (!hasPermission) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to accept this reservation request',
			);
		}

		if (this.props.state !== ReservationRequestStates.REQUESTED) {
			throw new DomainSeedwork.PermissionError('Can only accept requested reservations');
		}

		this.props.state = ReservationRequestStates.ACCEPTED;
	}

	private reject(): void {
		if (
			!this.visa.determineIf(
				(domainPermissions) => domainPermissions.canRejectRequest,
			)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to reject this reservation request',
			);
		}

		if (this.props.state !== ReservationRequestStates.REQUESTED) {
			throw new DomainSeedwork.PermissionError('Can only reject requested reservations');
		}

		this.props.state = ReservationRequestStates.REJECTED;
	}

	private cancel(): void {
		if (
			!this.visa.determineIf(
				(domainPermissions) => domainPermissions.canCancelRequest,
			)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to cancel this reservation request',
			);
		}

		if (this.props.state !== ReservationRequestStates.REQUESTED) {
			throw new DomainSeedwork.PermissionError('Cannot cancel reservation in current state');
		}

		this.props.state = ReservationRequestStates.CANCELLED;
	}

	private close(): void {
		if (
			!this.visa.determineIf(
				(domainPermissions) => domainPermissions.canCloseRequest,
			)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to close this reservation request',
			);
		}

		if (this.props.state !== ReservationRequestStates.ACCEPTED) {
			throw new DomainSeedwork.PermissionError('Can only close accepted reservations');
		}

		if (
			!(
				this.props.closeRequestedBySharer || this.props.closeRequestedByReserver
			)
		) {
			throw new DomainSeedwork.PermissionError(
				'Can only close reservation requests if at least one user requested it',
			);
		}

		this.props.state = ReservationRequestStates.CLOSED;
	}

  private request(): void {
    if (
      !this.isNew
    ) {
      throw new DomainSeedwork.PermissionError(
        "Can only set state to requested when creating new reservation requests"
      );
    }

    if (!this.isNew) {
        throw new DomainSeedwork.PermissionError("Can only set state to requested when creating new reservation requests");
    }
    
    this.props.state = new ValueObjects.ReservationRequestStateValue(ReservationRequestStates.REQUESTED).valueOf();
  }
}
