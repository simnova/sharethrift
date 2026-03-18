Feature: Create Listing

  As a personal user
  I want to create a new item listing
  So that I can share items with others

  Background:
    Given I am a personal user

  Scenario: Successfully create a draft listing
    When I create a draft listing with the following details:
      | title       | My Amazing Drill       |
      | description | A high-quality drill   |
      | category    | Tools                  |
      | location    | San Francisco, CA      |
    Then the listing should be created successfully
    And the listing should be in draft state
