@e2e
Feature: Browse Listings

  As a ShareThrift user
  I want to discover available items
  So that I can find something useful to borrow

  Background:
    Given Alice is an authenticated user

  Scenario: Browse listings using discovery controls
    When Alice browses available listings
    Then Alice should see listing search, category, and location controls

  Scenario: Filter discovery by category
    When Alice browses available listings
    And Alice filters listings by "Electronics"
    Then Alice should see "Electronics" as the selected category

  Scenario: Find and open a published listing
    Given Alice has created a published listing titled "E2E Trail Projector"
    When Alice browses available listings
    And Alice searches listings for "E2E Trail Projector"
    Then Alice should find the listing "E2E Trail Projector"
    When Alice opens listing "E2E Trail Projector"
    Then Alice should see listing "E2E Trail Projector" details
