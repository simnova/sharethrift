@e2e
Feature: Manage Reservations

  As a ShareThrift borrower
  I want to review current and previous reservations
  So that I can keep track of borrowed items

  Background:
    Given Alice is an authenticated user

  Scenario: Review active and historical reservations
    When Alice opens her reservations
    Then Alice should see active reservations
    When Alice views reservation history
    Then Alice should see reservation history
