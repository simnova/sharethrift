import { Given, When, Then, Before } from '@cucumber/cucumber';
import { actorCalled } from '@serenity-js/core';
import { Ensure, equals } from '@serenity-js/assertions';
import { DomainSeedwork } from '@cellix/domain-seedwork';
import './shared.steps';
import { SystemPassport } from '../../../src/domain/iam/system/system.passport';
import { ReservationRequest } from '../../../src/domain/contexts/reservation-request/reservation-request/reservation-request';
import { ReservationRequestProps } from '../../../src/domain/contexts/reservation-request/reservation-request/reservation-request.entity';
import { ReservationRequestEntityReference } from '../../../src/domain/contexts/reservation-request/reservation-request/reservation-request.entity';
import { PersonalUserEntityReference } from '../../../src/domain/contexts/user/personal-user/personal-user.entity';
import { ItemListingEntityReference } from '../../../src/domain/contexts/listing/item/item-listing.entity';
import * as ValueObjects from '../../../src/domain/contexts/reservation-request/reservation-request/reservation-request.value-objects';
import { ReservationRequestStates } from '../../../src/domain/contexts/reservation-request/reservation-request/reservation-request.value-objects';
import type { ReservationRequestDomainPermissions } from '../../../src/domain/contexts/reservation-request/reservation-request.domain-permissions';

declare module '@serenity-js/core' {
    interface Actor {
        passport: SystemPassport;
        personalUser: PersonalUserEntityReference;
        itemListing: ItemListingEntityReference;
        reservationRequestFields: {
            state: string;
            reservationPeriodStart: Date;
            reservationPeriodEnd: Date;
        };
        currentReservationRequest?: ReservationRequest<ReservationRequestProps>;
        error?: Error;
        loadedListing?: ItemListingEntityReference;
        loadedReserver?: PersonalUserEntityReference;
    }
}

// Test data setup
const testUserRolePermissions = {
    listingPermissions: {
        canCreateItemListing: true,
        canUpdateItemListing: true,
        canDeleteItemListing: true,
        canViewItemListing: true,
        canPublishItemListing: true,
        canUnpublishItemListing: true,
        canReserveItemListing: true
    },
    conversationPermissions: {
        canCreateConversation: true,
        canManageConversation: true,
        canViewConversation: true
    },
    reservationRequestPermissions: {
        canCreateReservationRequest: true,
        canManageReservationRequest: true,
        canViewReservationRequest: true
    }
};

const testUserRole = {
    id: 'test-role',
    roleName: 'standard',
    isDefault: true,
    roleType: 'personal-user-role',
    createdAt: new Date(),
    updatedAt: new Date(),
    schemaVersion: '1.0.0',
    permissions: testUserRolePermissions
};

const testUserRef: PersonalUserEntityReference = {
    id: 'reserverUser',
    userType: 'personal-user',
    isBlocked: false,
    schemaVersion: '1.0.0',
    hasCompletedOnboarding: true,
    role: testUserRole,
    loadRole: async () => testUserRole,
    account: {
        accountType: 'personal',
        email: 'test@example.com',
        username: 'testuser',
        profile: {
            firstName: 'Test',
            lastName: 'User',
            location: {
                address1: '123 Test St',
                address2: null,
                city: 'Test City',
                state: 'Test State',
                country: 'Test Country',
                zipCode: '12345'
            },
            billing: {
                subscriptionId: null,
                cybersourceCustomerId: null,
                paymentState: 'none',
                lastTransactionId: null,
                lastPaymentAmount: null
            }
        }
    },
    createdAt: new Date(),
    updatedAt: new Date()
};

const testListingRef: ItemListingEntityReference = {
    id: 'listing1',
    title: 'Test Listing',
    description: 'Test listing description',
    category: 'test-category',
    location: 'Test Location',
    state: 'Published',
    sharingPeriodStart: new Date(),
    sharingPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    sharer: { ...testUserRef, id: 'sharerUser' },
    schemaVersion: '1.0.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    reservedBy: null
};

Before(function() {
    const actor = actorCalled('User');
    actor.error = undefined;
});

Given('a valid Passport with reservation request permissions', function () {
    const actor = actorCalled('User');
    const permissions: Partial<ReservationRequestDomainPermissions> = {
        canCloseRequest: true,
        canCancelRequest: true,
        canAcceptRequest: true,
        canRejectRequest: true
    };
    actor.passport = new SystemPassport(permissions);
});

// Note: Using shared step definition for "a valid PersonalUserEntityReference for {string}"

Given('a ReservationRequest aggregate with state {string}', function (state: string) {
    const actor = actorCalled('User');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const stateValue = state === 'REQUESTED' ? ReservationRequestStates.REQUESTED :
                    state === 'ACCEPTED' ? ReservationRequestStates.ACCEPTED :
                    state === 'REJECTED' ? ReservationRequestStates.REJECTED :
                    state === 'CANCELLED' ? ReservationRequestStates.CANCELLED :
                    state === 'CLOSED' ? ReservationRequestStates.CLOSED :
                    ReservationRequestStates.REQUESTED;

    try {
        // Create a new ReservationRequest with all permissions enabled by default
        const allPermissions: ReservationRequestDomainPermissions = {
            canAcceptRequest: true,
            canCancelRequest: true,
            canCloseRequest: true,
            canRejectRequest: true
        };
        actor.passport = new SystemPassport(allPermissions);
        
        const request = ReservationRequest.getNewInstance<ReservationRequestProps>(
            {
                id: 'test-id',
                state: stateValue,
                listing: actor.itemListing,
                reserver: actor.personalUser,
                reservationPeriodStart: tomorrow,
                reservationPeriodEnd: nextMonth,
                createdAt: new Date(),
                updatedAt: new Date(),
                schemaVersion: '1.0.0',
                closeRequestedBySharer: false,
                closeRequestedByReserver: false,
                loadListing: async () => actor.itemListing,
                loadReserver: async () => actor.personalUser
            },
            stateValue,
            actor.itemListing,
            actor.personalUser,
            tomorrow,
            nextMonth,
            actor.passport
        );
        actor.currentReservationRequest = request;
    } catch (e) {
        actor.error = e as Error;
    }
});

Given('a ReservationRequest aggregate', function () {
    const actor = actorCalled('User');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    actor.currentReservationRequest = ReservationRequest.getNewInstance<ReservationRequestProps>(
        {
            id: 'test-id',
            state: 'REQUESTED',
            listing: actor.itemListing,
            reserver: actor.personalUser,
            reservationPeriodStart: tomorrow,
            reservationPeriodEnd: nextMonth,
            createdAt: new Date(),
            updatedAt: new Date(),
            schemaVersion: '1.0.0',
            closeRequestedBySharer: false,
            closeRequestedByReserver: false,
            loadListing: async () => actor.itemListing,
            loadReserver: async () => actor.personalUser
        },
        'REQUESTED',
        actor.itemListing,
        actor.personalUser,
        tomorrow,
        nextMonth,
        actor.passport
    );
});

Given('a valid ItemListingEntityReference for {string} with state {string}', function (listingId: string, state: string) {
    const actor = actorCalled('User');
    actor.itemListing = { ...testListingRef, id: listingId.replace(/^"|"$/g, ''), state: state.replace(/^"|"$/g, '') };
});

Given('base reservation request properties with state {string}, listing {string}, reserver {string}, valid reservation period, and timestamps', function (state: string, listingId: string, reserverId: string) {
    const actor = actorCalled('User');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const stateValue = state === 'REQUESTED' ? ReservationRequestStates.REQUESTED :
                    state === 'ACCEPTED' ? ReservationRequestStates.ACCEPTED :
                    state === 'REJECTED' ? ReservationRequestStates.REJECTED :
                    state === 'CANCELLED' ? ReservationRequestStates.CANCELLED :
                    state === 'CLOSED' ? ReservationRequestStates.CLOSED :
                    state;

    actor.reservationRequestFields = {
        state: stateValue,
        reservationPeriodStart: tomorrow,
        reservationPeriodEnd: nextMonth
    };
});

When('I create a new ReservationRequest aggregate using getNewInstance with state {string}, listing {string}, reserver {string}, reservationPeriodStart {string}, and reservationPeriodEnd {string}', function (state: string, listingId: string, reserverId: string, periodStart: string, periodEnd: string) {
    const actor = actorCalled('User');
    try {
        const startDate = periodStart === "tomorrow" ? 
            (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d; })() :
            new Date(periodStart);
            
        const endDate = periodEnd === "next month" ?
            (() => { const d = new Date(); d.setMonth(d.getMonth() + 1); return d; })() :
            new Date(periodEnd);

        const stateValue = state === 'REQUESTED' ? ReservationRequestStates.REQUESTED :
                          state === 'ACCEPTED' ? ReservationRequestStates.ACCEPTED :
                          state === 'REJECTED' ? ReservationRequestStates.REJECTED :
                          state === 'CANCELLED' ? ReservationRequestStates.CANCELLED :
                          state === 'CLOSED' ? ReservationRequestStates.CLOSED :
                          state;

        actor.currentReservationRequest = ReservationRequest.getNewInstance<ReservationRequestProps>(
            {
                id: 'test-id',
                state: stateValue,
                listing: { ...actor.itemListing, id: listingId.replace(/^"|"$/g, '') },
                reserver: { ...actor.personalUser, id: reserverId.replace(/^"|"$/g, '') },
                reservationPeriodStart: startDate,
                reservationPeriodEnd: endDate,
                createdAt: new Date(),
                updatedAt: new Date(),
                schemaVersion: '1.0.0',
                closeRequestedBySharer: false,
                closeRequestedByReserver: false,
                loadListing: async () => actor.itemListing,
                loadReserver: async () => actor.personalUser
            },
            stateValue,
            { ...actor.itemListing, id: listingId.replace(/^"|"$/g, '') },
            { ...actor.personalUser, id: reserverId.replace(/^"|"$/g, '') },
            startDate,
            endDate,
            actor.passport
        );
    } catch (e) {
        actor.error = e as Error;
    }
});

Given('a new ReservationRequest aggregate being created', function () {
    const actor = actorCalled('User');
    
    // Set up initial dates - far enough in the future to avoid any timing issues
    const now = new Date();
    const start = new Date(now.getTime() + 86400000 * 5);  // 5 days from now
    const end = new Date(now.getTime() + 86400000 * 35);   // 35 days from now
    
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    
    // Create a new instance in NEW state for testing property setters
    actor.currentReservationRequest = ReservationRequest.getNewInstance<ReservationRequestProps>(
        {
            id: 'test-id',
            state: 'REQUESTED',
            listing: actor.itemListing,
            reserver: actor.personalUser,
            reservationPeriodStart: start,
            reservationPeriodEnd: end,
            createdAt: new Date(),
            updatedAt: new Date(),
            schemaVersion: '1.0.0',
            closeRequestedBySharer: false,
            closeRequestedByReserver: false,
            loadListing: async () => actor.itemListing,
            loadReserver: async () => actor.personalUser
        },
        'REQUESTED',
        actor.itemListing,
        actor.personalUser,
        start,
        end,
        actor.passport
    );
});

When('I try to set the reservationPeriodStart to a past date', function () {
    const actor = actorCalled('User');
    try {
        if (actor.currentReservationRequest) {
            // Create a date that's definitely in the past (yesterday at start of day)
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            yesterday.setHours(0, 0, 0, 0);  // Start of day to avoid timing edge cases
            actor.currentReservationRequest.reservationPeriodStart = yesterday;
        }
    } catch (e) {
        actor.error = e as Error;
    }
});

When('I try to set reservationPeriodEnd to a date before reservationPeriodStart', function () {
    const actor = actorCalled('User');
    try {
        if (actor.currentReservationRequest) {
            // Create a completely new instance for this test
            const now = new Date();
            const endDate = new Date(now.getTime() + 86400000 * 2);   // 2 days from now
            endDate.setHours(0, 0, 0, 0);
            
            // Use getNewInstance to create a fresh instance with these dates
            actor.currentReservationRequest = ReservationRequest.getNewInstance<ReservationRequestProps>(
                {
                    id: 'test-id',
                    state: 'REQUESTED',
                    listing: actor.itemListing,
                    reserver: actor.personalUser,
                    reservationPeriodStart: new Date(now.getTime() + 86400000 * 3), // 3 days from now
                    reservationPeriodEnd: endDate,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    schemaVersion: '1.0.0',
                    closeRequestedBySharer: false,
                    closeRequestedByReserver: false,
                    loadListing: async () => actor.itemListing,
                    loadReserver: async () => actor.personalUser
                },
                'REQUESTED',
                actor.itemListing,
                actor.personalUser,
                new Date(now.getTime() + 86400000 * 3), // 3 days from now
                endDate,
                actor.passport
            );

            // Now try to set the end date which should fail validation
            actor.currentReservationRequest.reservationPeriodEnd = endDate;
        }
    } catch (e) {
        actor.error = e as Error;
    }
});

Given('an existing ReservationRequest aggregate', function () {
    const actor = actorCalled('User');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    actor.currentReservationRequest = ReservationRequest.getNewInstance<ReservationRequestProps>(
        {
            id: 'test-id',
            state: 'REQUESTED',
            listing: actor.itemListing,
            reserver: actor.personalUser,
            reservationPeriodStart: tomorrow,
            reservationPeriodEnd: nextMonth,
            createdAt: new Date(),
            updatedAt: new Date(),
            schemaVersion: '1.0.0',
            closeRequestedBySharer: false,
            closeRequestedByReserver: false,
            loadListing: async () => actor.itemListing,
            loadReserver: async () => actor.personalUser
        },
        'REQUESTED',
        actor.itemListing,
        actor.personalUser,
        tomorrow,
        nextMonth,
        actor.passport
    );
});

When('I try to set a new listing', function () {
    const actor = actorCalled('User');
    try {
        if (actor.currentReservationRequest) {
            const newListing = { ...testListingRef, id: 'newListing' };
            actor.currentReservationRequest.listing = newListing;
        }
    } catch (e) {
        actor.error = e as Error;
    }
});

When('I try to set a new reserver', function () {
    const actor = actorCalled('User');
    try {
        if (actor.currentReservationRequest) {
            const newReserver = { ...testUserRef, id: 'newReserver' };
            actor.currentReservationRequest.reserver = newReserver;
        }
    } catch (e) {
        actor.error = e as Error;
    }
});

Given('the user has permission to {word} requests', function (action: string) {
    const actor = actorCalled('User');
    if (!actor.currentReservationRequest) {
        throw new Error('No reservation request was created');
    }

    // Create permissions with only the specified action enabled
    const permissions: ReservationRequestDomainPermissions = {
        canAcceptRequest: action === 'accept',
        canCancelRequest: action === 'cancel',
        canCloseRequest: action === 'close',
        canRejectRequest: action === 'reject'
    };
    
    // Create a new passport with the updated permissions
    actor.passport = new SystemPassport(permissions);
    
    // Create a new request instance using existing props and the new passport
    const { props } = actor.currentReservationRequest;
    actor.currentReservationRequest = new ReservationRequest(props, actor.passport);
});

Given('the user does not have permission to {word} requests', function (action: string) {
    const actor = actorCalled('User');
    if (!actor.currentReservationRequest) {
        throw new Error('No reservation request was created');
    }

    // Create permissions with all permissions enabled except the specified action
    const permissions: ReservationRequestDomainPermissions = {
        canAcceptRequest: action !== 'accept',
        canCancelRequest: action !== 'cancel',
        canCloseRequest: action !== 'close',
        canRejectRequest: action !== 'reject'
    };
    
    // Create a new passport with the updated permissions
    actor.passport = new SystemPassport(permissions);
    
    // Create a new request instance using existing props and the new passport
    const { props } = actor.currentReservationRequest;
    actor.currentReservationRequest = new ReservationRequest(props, actor.passport);
});

Given('closeRequestedBySharer is true', function () {
    const actor = actorCalled('User');
    if (actor.currentReservationRequest) {
        // The domain requires state to be ACCEPTED before setting closeRequested flags
        actor.currentReservationRequest.closeRequestedBySharer = true;
    }
});

Given('closeRequestedByReserver is true', function () {
    const actor = actorCalled('User');
    if (actor.currentReservationRequest) {
        // The domain requires state to be ACCEPTED before setting closeRequested flags
        actor.currentReservationRequest.closeRequestedByReserver = true;
    }
});

Given('neither closeRequestedBySharer nor closeRequestedByReserver is true', function () {
    const actor = actorCalled('User');
    if (actor.currentReservationRequest) {
        actor.currentReservationRequest.closeRequestedBySharer = false;
        actor.currentReservationRequest.closeRequestedByReserver = false;
    }
});

When('I set state to {string}', function (state: string) {
    const actor = actorCalled('User');
    try {
        if (actor.currentReservationRequest) {
            const stateValue = state === 'REQUESTED' ? ReservationRequestStates.REQUESTED :
                            state === 'ACCEPTED' ? ReservationRequestStates.ACCEPTED :
                            state === 'REJECTED' ? ReservationRequestStates.REJECTED :
                            state === 'CANCELLED' ? ReservationRequestStates.CANCELLED :
                            state === 'CLOSED' ? ReservationRequestStates.CLOSED :
                            state;
            actor.currentReservationRequest.state = stateValue;
        }
    } catch (e) {
        actor.error = e as Error;
    }
});

When('I try to set state to {string}', function (state: string) {
    const actor = actorCalled('User');
    try {
        if (!actor.currentReservationRequest) {
            throw new Error('No reservation request was created');
        }
        const stateValue = state === 'REQUESTED' ? ReservationRequestStates.REQUESTED :
                        state === 'ACCEPTED' ? ReservationRequestStates.ACCEPTED :
                        state === 'REJECTED' ? ReservationRequestStates.REJECTED :
                        state === 'CANCELLED' ? ReservationRequestStates.CANCELLED :
                        state === 'CLOSED' ? ReservationRequestStates.CLOSED :
                        state;
        actor.currentReservationRequest.state = stateValue;
    } catch (e) {
        actor.error = e as Error;
        console.log('Error captured in try/catch:', e);
    }
});

When('I try to set closeRequestedBySharer to true', function () {
    const actor = actorCalled('User');
    try {
        if (actor.currentReservationRequest) {
            actor.currentReservationRequest.closeRequestedBySharer = true;
        }
    } catch (e) {
        actor.error = e as Error;
    }
});

When('I try to set closeRequestedByReserver to true', function () {
    const actor = actorCalled('User');
    try {
        if (actor.currentReservationRequest) {
            actor.currentReservationRequest.closeRequestedByReserver = true;
        }
    } catch (e) {
        actor.error = e as Error;
    }
});

When('I call loadListing', async function () {
    const actor = actorCalled('User');
    if (actor.currentReservationRequest) {
        actor.loadedListing = await actor.currentReservationRequest.loadListing();
    }
});

When('I call loadReserver', async function () {
    const actor = actorCalled('User');
    if (actor.currentReservationRequest) {
        actor.loadedReserver = await actor.currentReservationRequest.loadReserver();
    }
});

Then('the reservation request\'s state should be {string}', function (expectedState: string) {
    const actor = actorCalled('User');
    const request = actor.currentReservationRequest;
    
    if (!request) {
        throw new Error('No reservation request was created');
    }

    const expected = expectedState === 'REQUESTED' ? ReservationRequestStates.REQUESTED :
                  expectedState === 'ACCEPTED' ? ReservationRequestStates.ACCEPTED :
                  expectedState === 'REJECTED' ? ReservationRequestStates.REJECTED :
                  expectedState === 'CANCELLED' ? ReservationRequestStates.CANCELLED :
                  expectedState === 'CLOSED' ? ReservationRequestStates.CLOSED :
                  expectedState;

    actor.attemptsTo(
        Ensure.that(request.state, equals(expected))
    );
});

Then('the reservation request\'s listing should reference {string}', function (listingId: string) {
    const actor = actorCalled('User');
    const request = actor.currentReservationRequest;
    
    if (!request) {
        throw new Error('No reservation request was created');
    }

    actor.attemptsTo(
        Ensure.that(request.listing.id, equals(listingId.replace(/^"|"$/g, '')))
    );
});

Then('the reservation request\'s reserver should reference {string}', function (reserverId: string) {
    const actor = actorCalled('User');
    const request = actor.currentReservationRequest;
    
    if (!request) {
        throw new Error('No reservation request was created');
    }

    actor.attemptsTo(
        Ensure.that(request.reserver.id, equals(reserverId.replace(/^"|"$/g, '')))
    );
});

Then('an error should be thrown indicating {string}', function (errorMessage: string) {
    const actor = actorCalled('User');
    actor.attemptsTo(
        Ensure.that(actor.error?.message || '', equals(errorMessage.replace(/^"|"$/g, '')))
    );
});

// Note: Using shared step definition for "a PermissionError should be thrown"

Then('a PermissionError should be thrown with message {string}', function (message: string) {
    const actor = actorCalled('User');
    actor.attemptsTo(
        Ensure.that(actor.error instanceof DomainSeedwork.PermissionError, equals(true)),
        Ensure.that(actor.error?.message || '', equals(message.replace(/^"|"$/g, '')))
    );
});

Then('it should return the associated listing', function () {
    const actor = actorCalled('User');
    actor.attemptsTo(
        Ensure.that(actor.loadedListing?.id || '', equals(actor.currentReservationRequest?.listing.id || ''))
    );
});

Then('it should return the associated reserver', function () {
    const actor = actorCalled('User');
    actor.attemptsTo(
        Ensure.that(actor.loadedReserver?.id || '', equals(actor.currentReservationRequest?.reserver.id || ''))
    );
});

Then('createdAt should return the correct date', function () {
    const actor = actorCalled('User');
    const request = actor.currentReservationRequest;
    
    if (!request) {
        throw new Error('No reservation request was created');
    }

    actor.attemptsTo(
        Ensure.that(request.createdAt instanceof Date, equals(true))
    );
});

Then('updatedAt should return the correct date', function () {
    const actor = actorCalled('User');
    const request = actor.currentReservationRequest;
    
    if (!request) {
        throw new Error('No reservation request was created');
    }

    actor.attemptsTo(
        Ensure.that(request.updatedAt instanceof Date, equals(true))
    );
});

Then('schemaVersion should return the correct version', function () {
    const actor = actorCalled('User');
    const request = actor.currentReservationRequest;
    
    if (!request) {
        throw new Error('No reservation request was created');
    }

    actor.attemptsTo(
        Ensure.that(request.schemaVersion, equals('1.0.0'))
    );
});