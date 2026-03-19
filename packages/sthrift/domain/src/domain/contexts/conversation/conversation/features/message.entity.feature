Feature: Message entity

  Background:
    Given a valid message with contents and author

  Scenario: Creating a new message instance
    When I create a new Message entity
    Then the message should have the correct messagingMessageId
    And the message should have the correct authorId
    And the message should have the correct contents
    And the message should have the correct createdAt timestamp

  Scenario: Getting messagingMessageId property
    Given a Message entity
    When I get the messagingMessageId property
    Then it should return the correct messaging message ID

  Scenario: Getting authorId property
    Given a Message entity
    When I get the authorId property
    Then it should return the correct author ID

  Scenario: Getting contents property
    Given a Message entity
    When I get the contents property
    Then it should return the correct contents

  Scenario: Getting createdAt property
    Given a Message entity
    When I get the createdAt property
    Then it should return the correct creation date

  Scenario: Message entity is readonly
    Given a Message entity
    Then all properties should be readonly and not modifiable
