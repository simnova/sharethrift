Feature: Process Expired Listing Deletions

  Background:
    Given the data sources are available
    And the blob storage service is available

  Scenario: Successfully processing expired listings with no expired listings found
    Given there are no expired listings
    When the expired deletion process runs
    Then the result should show 0 deleted listings
    And the result should show 0 deleted conversations
    And the result should show 0 deleted images
    And the result should have no errors

  Scenario: Successfully deleting a single expired listing with images and conversations
    Given there is 1 expired listing with id "listing-123"
    And the listing has 2 images
    And the listing has 3 conversations
    When the expired deletion process runs
    Then the result should show 1 deleted listings
    And the result should show 3 deleted conversations
    And the result should show 2 deleted images
    And the deleted listing ids should include "listing-123"

  Scenario: Successfully deleting multiple expired listings
    Given there are 3 expired listings
    When the expired deletion process runs
    Then the result should show 3 deleted listings

  Scenario: Handling image deletion failure gracefully
    Given there is 1 expired listing with id "listing-456"
    And the listing has 2 images
    And the blob storage fails to delete the first image
    When the expired deletion process runs
    Then the result should show 1 deleted listings
    And the result should show 1 deleted images

  Scenario: Handling listing deletion failure
    Given there is 1 expired listing with id "listing-789"
    And the listing deletion throws an error
    When the expired deletion process runs
    Then the result should show 0 deleted listings
    And the result errors should include listing id "listing-789"

  Scenario: Processing expired listings without blob storage service
    Given there is 1 expired listing with id "listing-no-blob"
    And the listing has 2 images
    And no blob storage service is provided
    When the expired deletion process runs
    Then the result should show 1 deleted listings
    And the result should show 0 deleted images
