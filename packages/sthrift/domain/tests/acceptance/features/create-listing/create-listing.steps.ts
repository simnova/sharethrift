import { Given, Then, When } from '@cucumber/cucumber';
import { createListingAbility } from '../abilities/create-listing.ability';
import { expect } from 'chai';

Given('I am a registered user', async function () {
  // Set up a registered user context
  this.currentUser = {
    id: 'test-user-1',
    username: 'testuser',
    email: 'test@example.com',
  };
});

Given('I am logged in', async function () {
  // Verify user is logged in
  expect(this.currentUser).to.exist;
});

When('I create a listing with:', async function (dataTable) {
  const listings = dataTable.hashes();
  const listing = listings[0];

  // Store the listing data for later assertions
  this.currentListing = listing;

  // Create the listing using the domain layer
  const result = await createListingAbility.createListing({
    title: listing.Title,
    description: listing.Description,
    category: listing.Category,
  // ...existing code...
  } as any);

  // Store the result for later assertions
  this.listingResult = result;
});

When('I try to create a listing without a title', async function () {
  try {
    await createListingAbility.createListing({
      title: '', // Empty title
      description: 'Test description',
      category: 'Other',
  // ...existing code...
    } as any);
  } catch (error) {
    // Store the error for later assertions
    this.lastError = error;
  }
});

Then('the listing should be created successfully', function () {
  expect(this.listingResult).to.exist;
  expect(this.listingResult).to.have.property('id');
  expect(this.listingResult).to.have.property('title', this.currentListing.Title);
});

Then('the listing should be visible in my listings', async function () {
  // Verify the listing is in the user's listings
  const userListings = await createListingAbility.getUserListings(this.currentUser.id);
  const createdListing = userListings.find(l => l.id === this.listingResult.id);
  expect(createdListing).to.exist;
});

Then('I should see an error message', function () {
  expect(this.lastError).to.exist;
  expect(this.lastError.message).to.include('title is required');
});

Then('no listing should be created', async function () {
  const userListings = await createListingAbility.getUserListings(this.currentUser.id);
  const listingsBeforeTest = this.listingsBeforeTest || [];
  expect(userListings).to.have.length(listingsBeforeTest.length);
});