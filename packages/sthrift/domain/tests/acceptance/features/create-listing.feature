@domain @listing
Feature: Domain - Create and manage listings

  As a registered user
  I want to create and manage item listings
  So that I can share my items with others

  Rule: A user should be able to create listings
    Background:
      Given a registered user is authenticated

    Scenario: Successfully create a listing
      When the user creates a new listing titled "Frying Pan"
      Then the listing should appear in the shared catalog

  Rule: Listings should expire after the maximum period
    Background:
      Given a registered user is authenticated

    Scenario: Listing expires after 6 months
      Given the user creates a new listing titled "Old Item"
      And a listing has been active for 6 months
      When the system checks for expired listings
      Then the listing should be removed from public view
