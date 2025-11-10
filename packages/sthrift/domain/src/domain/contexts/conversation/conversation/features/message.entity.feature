Feature: Message Entity

  Background:
    Given a valid Message entity with twilioMessageSid, authorId, content, and createdAt

  Scenario: Getting readonly properties from a Message entity
    When I access the twilioMessageSid property
    Then it should return the TwilioMessageSid value object
    And when I access the authorId property
    Then it should return the ObjectId
    And when I access the content property
    Then it should return the MessageContent value object
    And when I access the createdAt property
    Then it should return the Date

  Scenario: Creating a Message entity with valid properties
    Given a TwilioMessageSid "IM12345678901234567890123456789012"
    And an authorId ObjectId
    And MessageContent "Hello, this is a test message"
    And a createdAt timestamp
    When I create a Message entity with these properties
    Then the entity should be created successfully
    And the twilioMessageSid should match the provided value
    And the authorId should match the provided ObjectId
    And the content should match the provided MessageContent
    And the createdAt should match the provided timestamp
