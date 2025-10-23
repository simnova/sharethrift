Feature: ServiceTwilio

  Scenario: Initializing ServiceTwilio in mock mode
    Given TWILIO_USE_MOCK and TWILIO_MOCK_URL are set
    When the ServiceTwilio instance is created
    Then it should set useMock to true and use configured mock URL

  Scenario: Initializing ServiceTwilio in real mode
    Given TWILIO_USE_MOCK is set to false and credentials are set
    When the ServiceTwilio instance is created
    Then it should set useMock to false

  Scenario: Starting up ServiceTwilio in mock mode
    Given a ServiceTwilio instance configured for mock mode
    When startUp is called
    Then it should create a MockTwilioAPI adapter
    And it should log "ServiceTwilio started in MOCK mode"
    And it should return the service instance

  Scenario: Starting up ServiceTwilio in real mode
    Given a ServiceTwilio instance configured for real mode
    When startUp is called
    Then it should create a RealTwilioAPI adapter
    And it should log "ServiceTwilio started with real Twilio client"
    And it should return the service instance

  Scenario: Starting up ServiceTwilio when already started
    Given a ServiceTwilio instance that has been started
    When startUp is called again
    Then it should throw an error "ServiceTwilio is already started"

  Scenario: Starting up in real mode without credentials
    Given TWILIO_USE_MOCK is set to "false"
    And TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN are not set
    When startUp is called
    Then it should throw an error about missing credentials

  Scenario: Shutting down ServiceTwilio when started
    Given a started ServiceTwilio instance
    When shutDown is called
    Then it should clear the client and mockClient
    And it should log "ServiceTwilio stopped"

  Scenario: Shutting down ServiceTwilio when not started
    Given a ServiceTwilio instance that has not been started
    When shutDown is called
    Then it should throw an error "ServiceTwilio is not started - shutdown cannot proceed"

  Scenario: Accessing service property in mock mode
    Given a started ServiceTwilio instance in mock mode
    When the service property is accessed
    Then it should return undefined (since mock uses HTTP client)

  Scenario: Accessing service property when not started
    Given a ServiceTwilio instance that has not been started
    When the service property is accessed
    Then it should throw an error "ServiceTwilio is not started - cannot access service"

  Scenario: Getting a conversation via mock API
    Given a started ServiceTwilio instance in mock mode
    And a conversation exists with ID "CH123"
    When getConversation is called with "CH123"
    Then it should delegate to the mock adapter
    And it should return the conversation data

  Scenario: Sending a message via mock API
    Given a started ServiceTwilio instance in mock mode
    And a conversation exists with ID "CH123"
    When sendMessage is called with conversation ID, body, and author
    Then it should delegate to the mock adapter
    And it should return the created message data

  Scenario: Deleting a conversation via mock API
    Given a started ServiceTwilio instance in mock mode
    And a conversation exists with ID "CH123"
    When deleteConversation is called with "CH123"
    Then it should delegate to the mock adapter
    And the conversation should be removed

  Scenario: Listing conversations via mock API
    Given a started ServiceTwilio instance in mock mode
    And multiple conversations exist
    When listConversations is called
    Then it should delegate to the mock adapter
    And it should return an array of conversations

  Scenario: Creating a conversation via mock API
    Given a started ServiceTwilio instance in mock mode
    When createConversation is called with friendlyName and uniqueName
    Then it should delegate to the mock adapter
    And it should return the created conversation data
