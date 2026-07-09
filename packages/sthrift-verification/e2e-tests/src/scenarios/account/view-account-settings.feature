@e2e
Feature: View Account Settings

  As a ShareThrift user
  I want to access my account settings
  So that I can maintain my personal information

  Background:
    Given Alice is an authenticated user

  Scenario: Edit profile details
    When Alice opens her account settings
    And Alice changes her first name to "Alicia"
    Then Alice should see the saved first name "Alicia"
