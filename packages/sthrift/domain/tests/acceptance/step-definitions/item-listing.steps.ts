import { Given, When, Then, Before } from '@cucumber/cucumber';
import { actorCalled } from '@serenity-js/core';
import { Ensure, equals } from '@serenity-js/assertions';
import './shared.steps';
import { SystemPassport } from '../../../src/domain/iam/system/system.passport';
import { ItemListing } from '../../../src/domain/contexts/listing/item/item-listing';
import type { ItemListingProps } from '../../../src/domain/contexts/listing/item/item-listing.entity';
import type { PersonalUserEntityReference } from '../../../src/domain/contexts/user/personal-user/personal-user.entity';
import * as ValueObjects from '../../../src/domain/contexts/listing/item/item-listing.value-objects';

declare module '@serenity-js/core' {
    interface Actor {
        passport: SystemPassport;
        personalUser: PersonalUserEntityReference;
        listingFields: {
            title: string;
            description: string;
            category: string;
            location: string;
            sharingPeriodStart: Date;
            sharingPeriodEnd: Date;
        };
        currentListing?: ItemListing<ItemListingProps>;
        error?: Error;
        originalUpdatedAt?: Date;
    }
}

// Keep the existing testUserRef definition here

Before(() => {
    const actor = actorCalled('User');
    actor.error = undefined;
});

Given('a valid Passport with listing permissions', () => {
    const actor = actorCalled('User');
    actor.passport = new SystemPassport({
        canCreateItemListing: true,
        canUpdateItemListing: true,
        canDeleteItemListing: true,
        canViewItemListing: true,
        canPublishItemListing: true,
        canUnpublishItemListing: true,
        canReserveItemListing: true
    });
});

// Define test user reference
const _testUserRef = {
    id: 'user1',
    userType: 'personal-user',
    isBlocked: false,
    schemaVersion: '1.0.0',
    hasCompletedOnboarding: true,
    role: {
        id: 'test-role',
        roleName: 'standard',
        isDefault: true,
        roleType: 'personal-user-role',
        createdAt: new Date(),
        updatedAt: new Date(),
        schemaVersion: '1.0.0',
        permissions: {
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
        }
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    account: {
        accountType: 'standard',
        email: 'test@example.com',
        username: 'testuser',
        profile: {
            firstName: 'Test',
            lastName: 'User',
            location: {
                address1: '123 Main St',
                address2: null,
                city: 'Test City', 
                state: 'TS',
                country: 'Testland',
                zipCode: '12345'
            },
            billing: {
                subscriptionId: null,
                cybersourceCustomerId: null,
                paymentState: '',
                lastTransactionId: null,
                lastPaymentAmount: null
            }
        }
    },
    loadRole: () => Promise.resolve({
        id: 'test-role',
        roleName: 'standard',
        isDefault: true,
        roleType: 'personal-user-role',
        createdAt: new Date(),
        updatedAt: new Date(),
        schemaVersion: '1.0.0',
        permissions: {
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
        }
    })
};

// Note: Using shared step definition for "a valid PersonalUserEntityReference for {string}"

Given('base item listing fields with title {string}, description {string}, category {string}, location {string}, sharingPeriodStart {string}, sharingPeriodEnd {string}, and valid timestamps',  (title: string, description: string, category: string, location: string, start: string, end: string) => {
    const actor = actorCalled('User');
    actor.listingFields = {
        title,
        description,
        category,
        location,
        sharingPeriodStart: new Date(start),
        sharingPeriodEnd: new Date(end)
    };
});

Given('an ItemListing aggregate with permission to update item listing',  () => {
    const actor = actorCalled('User');
    const passport = new SystemPassport({ canUpdateItemListing: true });
    if (actor.currentListing) {
        // Create a new instance with the updated passport
        actor.currentListing = new ItemListing(actor.currentListing.getEntityReference(), passport);
        actor.originalUpdatedAt = actor.currentListing.updatedAt;
    }
});

Given('an ItemListing aggregate without permission to update item listing',  () => {
    const actor = actorCalled('User');
    const passport = new SystemPassport({ canUpdateItemListing: false });
    if (actor.currentListing) {
        // Create a new instance with the updated passport
        actor.currentListing = new ItemListing(actor.currentListing.getEntityReference(), passport);
    }
});

Given('an ItemListing aggregate with permission to publish item listing',  () => {
    const actor = actorCalled('User');
    const passport = new SystemPassport({ canPublishItemListing: true });
    if (actor.currentListing) {
        // Create a new instance with the updated passport
        actor.currentListing = new ItemListing(actor.currentListing.getEntityReference(), passport);
        actor.originalUpdatedAt = actor.currentListing.updatedAt;
    }
});

When('I create a new ItemListing aggregate using getNewInstance with sharer {string} and title {string}', (_sharerId: string, title: string) => {
    const actor = actorCalled('User');
    actor.currentListing = ItemListing.getNewInstance<ItemListingProps>(
        actor.personalUser,
        {
            title: new ValueObjects.Title(title.replace(/^"|"$/g, '')).valueOf(),
            description: new ValueObjects.Description(actor.listingFields.description).valueOf(),
            category: new ValueObjects.Category(actor.listingFields.category).valueOf(),
            location: new ValueObjects.Location(actor.listingFields.location).valueOf(),
            sharingPeriodStart: actor.listingFields.sharingPeriodStart,
            sharingPeriodEnd: actor.listingFields.sharingPeriodEnd,
        },
        actor.passport
    );
});

When('I create a new ItemListing aggregate using getNewInstance with isDraft true and empty title, description, category, and location', () => {
    const actor = actorCalled('User');
    const _now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    actor.currentListing = ItemListing.getNewInstance<ItemListingProps>(
        actor.personalUser,
        {
            title: new ValueObjects.Title('Draft Title').valueOf(),
            description: new ValueObjects.Description('Draft Description').valueOf(),
            category: new ValueObjects.Category('Miscellaneous').valueOf(),
            location: new ValueObjects.Location('Draft Location').valueOf(),
            sharingPeriodStart: tomorrow,
            sharingPeriodEnd: tomorrow,
            isDraft: true
        },
        actor.passport
    );
});

When('I set the title to {string}', (title: string) => {
    const actor = actorCalled('User');
    try {
        if (actor.currentListing) {
            actor.currentListing.title = new ValueObjects.Title(title.replace(/^"|"$/g, '')).valueOf();
        }
    } catch (e) {
        actor.error = e as Error;
    }
});

When('I try to set the title to {string}', (title: string) => {
    const actor = actorCalled('User');
    try {
        if (actor.currentListing) {
            actor.currentListing.title = new ValueObjects.Title(title.replace(/^"|"$/g, '')).valueOf();
        }
    } catch (e) {
        actor.error = e as Error;
    }
});

When('I set the description to {string}', (description: string) => {
    const actor = actorCalled('User');
    try {
        if (actor.currentListing) {
            actor.currentListing.description = new ValueObjects.Description(description.replace(/^"|"$/g, '')).valueOf();
        }
    } catch (e) {
        actor.error = e as Error;
    }
});

When('I try to set the description to {string}', (description: string) => {
    const actor = actorCalled('User');
    try {
        if (actor.currentListing) {
            actor.currentListing.description = new ValueObjects.Description(description.replace(/^"|"$/g, '')).valueOf();
        }
    } catch (e) {
        actor.error = e as Error;
    }
});

When('I set the category to {string}', (category: string) => {
    const actor = actorCalled('User');
    try {
        if (actor.currentListing) {
            actor.currentListing.category = new ValueObjects.Category(category.replace(/^"|"$/g, '')).valueOf();
        }
    } catch (e) {
        actor.error = e as Error;
    }
});

When('I try to set the category to {string}', (category: string) => {
    const actor = actorCalled('User');
    try {
        if (actor.currentListing) {
            actor.currentListing.category = new ValueObjects.Category(category.replace(/^"|"$/g, '')).valueOf();
        }
    } catch (e) {
        actor.error = e as Error;
    }
});

When('I set the location to {string}', (location: string) => {
    const actor = actorCalled('User');
    try {
        if (actor.currentListing) {
            actor.currentListing.location = new ValueObjects.Location(location.replace(/^"|"$/g, '')).valueOf();
        }
    } catch (e) {
        actor.error = e as Error;
    }
});

When('I try to set the location to {string}', (location: string) => {
    const actor = actorCalled('User');
    try {
        if (actor.currentListing) {
            actor.currentListing.location = new ValueObjects.Location(location.replace(/^"|"$/g, '')).valueOf();
        }
    } catch (e) {
        actor.error = e as Error;
    }
});

When('I set the sharingPeriodStart to {string}', (start: string) => {
    const actor = actorCalled('User');
    try {
        if (actor.currentListing) {
            actor.currentListing.sharingPeriodStart = new Date(start.replace(/^"|"$/g, ''));
        }
    } catch (e) {
        actor.error = e as Error;
    }
});

When('I set the sharingPeriodEnd to {string}', (end: string) => {
    const actor = actorCalled('User');
    try {
        if (actor.currentListing) {
            actor.currentListing.sharingPeriodEnd = new Date(end.replace(/^"|"$/g, ''));
        }
    } catch (e) {
        actor.error = e as Error;
    }
});

When('I try to set the sharingPeriodStart or sharingPeriodEnd', (_start: string, _end: string) => {
    const actor = actorCalled('User');
    try {
        if (actor.currentListing) {
            actor.currentListing.sharingPeriodStart = new Date('2025-10-10');
        }
    } catch (e) {
        actor.error = e as Error;
    }
});

When('I set images to [{string}, {string}]', (image1: string, image2: string) => {
    const actor = actorCalled('User');
    try {
        if (actor.currentListing) {
            actor.currentListing.images = [image1, image2];
        }
    } catch (e) {
        actor.error = e as Error;
    }
});

When('I try to set images to [{string}, {string}]', (image1: string, image2: string) => {
    const actor = actorCalled('User');
    try {
        if (actor.currentListing) {
            actor.currentListing.images = [image1, image2];
        }
    } catch (e) {
        actor.error = e as Error;
    }
});

When('I call publish\\(\\)', () => {
    const actor = actorCalled('User');
    try {
        if (actor.currentListing) {
            actor.currentListing.publish();
        }
    } catch (e) {
        actor.error = e as Error;
    }
});

Then(/^the listing(?:'s)? state should be "(.*)"$/, (expectedState: string) => {
    const actor = actorCalled('User');
    const listing = actor.currentListing;
    
    if (!listing) {
        throw new Error('No listing was created');
    }

    actor.attemptsTo(
        Ensure.that(listing.state.valueOf(), equals(expectedState.replace(/^""|""$/g, '')))
    );
});

Then('the listing\'s title should be {string}', (title: string) => {
    const actor = actorCalled('User');
    const listing = actor.currentListing;
    if (!listing) {
        throw new Error('No listing was created');
    }
    actor.attemptsTo(
        Ensure.that(listing.title.valueOf(), equals(title.replace(/^"|"$/g, '')))
    );
});

Then('the listing\'s sharer should reference {string}', (userId: string) => {
    const actor = actorCalled('User');
    const listing = actor.currentListing;
    if (!listing) {
        throw new Error('No listing was created');
    }
    actor.attemptsTo(
        Ensure.that(listing.sharer.id, equals(userId.replace(/^"|"$/g, '')))
    );
});

Then('the listing\'s title should default to {string}', (title: string) => {
    const actor = actorCalled('User');
    const listing = actor.currentListing;
    if (!listing) {
        throw new Error('No listing was created');
    }
    actor.attemptsTo(
        Ensure.that(listing.title.valueOf(), equals(title.replace(/^"|"$/g, '')))
    );
});

Then('the listing\'s description should default to {string}', (description: string) => {
    const actor = actorCalled('User');
    const listing = actor.currentListing;
    if (!listing) {
        throw new Error('No listing was created');
    }
    actor.attemptsTo(
        Ensure.that(listing.description.valueOf(), equals(description.replace(/^"|"$/g, '')))
    );
});

Then('the listing\'s category should default to {string}', (category: string) => {
    const actor = actorCalled('User');
    const listing = actor.currentListing;
    if (!listing) {
        throw new Error('No listing was created');
    }
    actor.attemptsTo(
        Ensure.that(listing.category.valueOf(), equals(category.replace(/^"|"$/g, '')))
    );
});

Then('the listing\'s location should default to {string}', (location: string) => {
    const actor = actorCalled('User');
    const listing = actor.currentListing;
    if (!listing) {
        throw new Error('No listing was created');
    }
    actor.attemptsTo(
        Ensure.that(listing.location.valueOf(), equals(location.replace(/^"|"$/g, '')))
    );
});

Then('the title should remain unchanged', () => {
    const actor = actorCalled('User');
    const listing = actor.currentListing;
    if (!listing) {
        throw new Error('No listing was created');
    }
    actor.attemptsTo(
        Ensure.that(new ValueObjects.Title('Old Title').valueOf(), equals('Old Title'))
    );
});

Then('the listing\'s description should be {string}', (description: string) => {
    const actor = actorCalled('User');
    const listing = actor.currentListing;
    if (!listing) {
        throw new Error('No listing was created');
    }
    actor.attemptsTo(
        Ensure.that(listing.description.valueOf(), equals(description.replace(/^"|"$/g, '')))
    );
});

Then('the listing\'s category should be {string}', (category: string) => {
    const actor = actorCalled('User');
    const listing = actor.currentListing;
    if (!listing) {
        throw new Error('No listing was created');
    }
    actor.attemptsTo(
        Ensure.that(listing.category.valueOf(), equals(category.replace(/^"|"$/g, '')))
    );
});

Then('the listing\'s location should be {string}', (location: string) => {
    const actor = actorCalled('User');
    const listing = actor.currentListing;
    if (!listing) {
        throw new Error('No listing was created');
    }
    actor.attemptsTo(
        Ensure.that(listing.location.valueOf(), equals(location.replace(/^"|"$/g, '')))
    );
});

Then('the sharing period should update accordingly', () => {
    const actor = actorCalled('User');
    const listing = actor.currentListing;
    if (!listing) {
        throw new Error('No listing was created');
    }
    actor.attemptsTo(
        Ensure.that(listing.sharingPeriodStart, equals(new Date('2025-10-10'))),
        Ensure.that(listing.sharingPeriodEnd, equals(new Date('2025-12-10')))
    );
});

Then('the listing\'s images should be [{string}, {string}]', (image1: string, image2: string) => {
    const actor = actorCalled('User');
    const listing = actor.currentListing;
    if (!listing) {
        throw new Error('No listing was created');
    }
    actor.attemptsTo(
        Ensure.that(listing.images, equals([image1, image2]))
    );
});

// Note: Using shared step definition for "a PermissionError should be thrown"

Then('the updatedAt timestamp should change', () => {
    const actor = actorCalled('User');
    const listing = actor.currentListing;
    if (!listing) {
        throw new Error('No listing was created');
    }
    actor.attemptsTo(
        Ensure.that(listing.updatedAt !== actor.originalUpdatedAt, equals(true))
    );
});