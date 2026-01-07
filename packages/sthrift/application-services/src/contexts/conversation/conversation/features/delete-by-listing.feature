Feature: Delete Conversations By Listing

  Background:
    Given the data sources are available
    And the conversation repository is available

  Scenario: Successfully deleting conversations when no conversations exist for listing
    Given the listing with id "listing-no-conversations" has no conversations
    When conversations are deleted for listing id "listing-no-conversations"
    Then the result should show 0 deleted conversations
    And the result should have no errors

  Scenario: Successfully deleting a single conversation for a listing
    Given the listing with id "listing-single-conv" has 1 conversation
    When conversations are deleted for listing id "listing-single-conv"
    Then the result should show 1 deleted conversations
    And the deleted conversation ids should be returned

  Scenario: Successfully deleting multiple conversations for a listing
    Given the listing with id "listing-multi-conv" has 3 conversations
    When conversations are deleted for listing id "listing-multi-conv"
    Then the result should show 3 deleted conversations
    And all 3 conversation ids should be included in the result

  Scenario: Handling conversation deletion failure
    Given the listing with id "listing-error" has 2 conversations
    And the first conversation deletion throws an error
    When conversations are deleted for listing id "listing-error"
    Then the result should show 1 deleted conversations
    And the result errors should include 1 error
