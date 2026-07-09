@e2e
Feature: Manage Listings

  As a ShareThrift sharer
  I want to manage listings and incoming requests
  So that I can share my items responsibly

  Background:
    Given Alice is an authenticated user

  Scenario: Start creating a listing from the application header
    When Alice starts a new listing
    Then Alice should see the create listing form

  Scenario: Review listings and incoming requests
    When Alice opens her listings dashboard
    Then Alice should see her listings
    When Alice views incoming listing requests
    Then Alice should see the requests tab
