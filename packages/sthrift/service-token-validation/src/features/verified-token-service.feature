Feature: VerifiedTokenService
  As a developer
  I want to verify JWT tokens using OpenID configuration
  So that I can authenticate users securely

  Background:
    Given a map of OpenID configurations for different portals

  Scenario: Constructing VerifiedTokenService with valid configurations
    Given a valid OpenID config map
    When the VerifiedTokenService is constructed
    Then it should initialize with the provided configurations
    And the keystore collection should be empty initially

  Scenario: Constructing VerifiedTokenService without configurations
    Given a null OpenID config map
    When the VerifiedTokenService is constructed
    Then it should throw an error indicating configurations are required

  Scenario: Starting the service to refresh keystores
    Given a VerifiedTokenService instance with valid configurations
    When the start method is called
    Then it should immediately refresh the keystore collection
    And it should set up a timer to refresh keystores periodically

  Scenario: Starting the service multiple times
    Given a VerifiedTokenService instance that has been started
    When the start method is called again
    Then it should not create multiple timer instances

  Scenario: Refreshing the keystore collection
    Given a VerifiedTokenService instance with valid configurations
    When the refreshCollection method is called
    Then it should create keystores for each OpenID configuration
    And each keystore should be associated with its configuration key

  Scenario: Verifying a JWT with a valid token
    Given a started VerifiedTokenService instance
    And a valid JWT token
    When getVerifiedJwt is called with the token and a valid config key
    Then it should return the verified JWT payload
    And the payload should contain the expected claims

  Scenario: Verifying a JWT before service is started
    Given a VerifiedTokenService instance that has not been started
    When getVerifiedJwt is called
    Then it should throw an error indicating the service is not started

  Scenario: Verifying a JWT with an invalid config key
    Given a started VerifiedTokenService instance
    When getVerifiedJwt is called with an invalid config key
    Then it should throw an error indicating the config key is invalid

  Scenario: Verifying a JWT with audience validation
    Given a started VerifiedTokenService instance with audience configuration
    When getVerifiedJwt is called with a token containing the correct audience
    Then it should successfully verify and return the token payload

  Scenario: Verifying a JWT with issuer validation disabled
    Given a started VerifiedTokenService instance with ignoreIssuer set to true
    When getVerifiedJwt is called with a token from any issuer
    Then it should skip issuer validation and verify the token

  Scenario: Verifying a JWT with custom clock tolerance
    Given a started VerifiedTokenService instance with custom clock tolerance
    When getVerifiedJwt is called with a token slightly expired
    Then it should accept the token within the clock tolerance window
