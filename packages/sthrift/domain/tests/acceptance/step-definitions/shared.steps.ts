import { Given, Then } from '@cucumber/cucumber';
import { actorCalled } from '@serenity-js/core';
import { Ensure, equals } from '@serenity-js/assertions';
import { DomainSeedwork } from '@cellix/domain-seedwork';

// Common test data setup
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

const baseUserRef = {
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

Given('a valid PersonalUserEntityReference for {string}', function (userId: string) {
    const actor = actorCalled('User');
    actor.personalUser = { ...baseUserRef, id: userId.replace(/^"|"$/g, '') };
});

Then('a PermissionError should be thrown', function () {
    const actor = actorCalled('User');
    if (!actor.error) {
        throw new Error('Expected an error to be thrown but no error was captured');
    }
    console.log('Error in assertion:', {
        error: actor.error,
        name: actor.error.name,
        constructor: actor.error.constructor.name,
        message: actor.error.message,
        isPermissionError: actor.error instanceof DomainSeedwork.PermissionError
    });
    actor.attemptsTo(
        Ensure.that(actor.error instanceof DomainSeedwork.PermissionError, equals(true))
    );
});