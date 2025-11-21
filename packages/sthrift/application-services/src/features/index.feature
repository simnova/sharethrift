Feature: Application Services Factory

  Scenario: Exporting buildApplicationServicesFactory function
    Given the application services module
    When the module is imported
    Then buildApplicationServicesFactory should be defined
    And buildApplicationServicesFactory should be a function

  Scenario: Creating an application services factory
    Given valid infrastructure services
    When buildApplicationServicesFactory is called
    Then a factory should be returned
    And the factory should have a forRequest method

  Scenario: Creating application services for guest user without auth header
    Given a valid application services factory
    When forRequest is called without an auth header
    Then application services should be created
    And all context services should be available
    And verifiedUser should have undefined hints

  Scenario: Creating application services for guest user with invalid token
    Given a valid application services factory
    And an invalid authentication token
    When forRequest is called with the invalid token
    Then application services should be created
    And verifiedUser should have undefined hints
    And the token should be verified

  Scenario: Creating application services for personal user with valid UserPortal token
    Given a valid application services factory
    And a valid UserPortal authentication token
    And a personal user exists with matching email
    When forRequest is called with the UserPortal token
    Then application services should be created
    And verifiedUser should contain the JWT data
    And verifiedUser should have UserPortal as openIdConfigKey

  Scenario: Creating application services for admin user with valid AdminPortal token
    Given a valid application services factory
    And a valid AdminPortal authentication token
    And an admin user exists with matching email
    When forRequest is called with the AdminPortal token
    Then application services should be created
    And verifiedUser should contain the admin JWT data
    And verifiedUser should have AdminPortal as openIdConfigKey

  Scenario: Handling valid token but user not found in UserPortal
    Given a valid application services factory
    And a valid UserPortal token for non-existent user
    When forRequest is called with the token
    Then application services should be created
    And verifiedUser should contain the JWT data
    And a guest passport should be used

  Scenario: Handling valid token but admin not found in AdminPortal
    Given a valid application services factory
    And a valid AdminPortal token for non-existent admin
    When forRequest is called with the token
    Then application services should be created
    And verifiedUser should contain the JWT data
    And a guest passport should be used

  Scenario: Including hints in verifiedUser
    Given a valid application services factory
    And a valid authentication token
    And custom hints data
    When forRequest is called with the token and hints
    Then application services should be created
    And verifiedUser should include the custom hints

  Scenario: Stripping Bearer prefix from auth header
    Given a valid application services factory
    And an auth header with Bearer prefix and spaces
    When forRequest is called with the auth header
    Then the Bearer prefix should be stripped
    And the token should be trimmed and verified

  Scenario: Handling unknown openIdConfigKey
    Given a valid application services factory
    And a valid token with unknown portal
    When forRequest is called with the token
    Then application services should be created
    And verifiedUser should have the unknown portal key
    And a guest passport should be used
