Feature: Message value objects

  # AuthorId
  Scenario: Creating an AuthorId with valid value
    When I create an AuthorId with "507f1f77bcf86cd799439011"
    Then the value should be "507f1f77bcf86cd799439011"

  Scenario: Creating an AuthorId with invalid value
    When I try to create an AuthorId with "invalid-id"
    Then an error should be thrown indicating the value is invalid

  # MessagingMessageId
  Scenario: Creating a MessagingMessageId with valid value
    When I create a MessagingMessageId with "MSG123456"
    Then the value should be "MSG123456"

  Scenario: Creating a MessagingMessageId with empty string
    When I try to create a MessagingMessageId with empty string
    Then an error should be thrown indicating the value is too short

  Scenario: Creating a MessagingMessageId with too long value
    When I try to create a MessagingMessageId with a string of 256 characters
    Then an error should be thrown indicating the value is too long

  Scenario: Creating a MessagingMessageId with whitespace that gets trimmed
    When I create a MessagingMessageId with "  MSG123456  "
    Then the value should be "MSG123456"

  # MessageContent
  Scenario: Creating a MessageContent with valid value
    When I create a MessageContent with "Hello, this is a test message"
    Then the value should be "Hello, this is a test message"

  Scenario: Creating a MessageContent with empty string
    When I try to create a MessageContent with empty string
    Then an error should be thrown indicating the value is too short

  Scenario: Creating a MessageContent with too long value
    When I try to create a MessageContent with a string of 2001 characters
    Then an error should be thrown indicating the value is too long

  Scenario: Creating a MessageContent with whitespace that gets trimmed
    When I create a MessageContent with "  Hello World  "
    Then the value should be "Hello World"

  Scenario: Using the ANONYMOUS_AUTHOR_ID constant
    When I use the ANONYMOUS_AUTHOR_ID constant
    Then the value should be "000000000000000000000000"
