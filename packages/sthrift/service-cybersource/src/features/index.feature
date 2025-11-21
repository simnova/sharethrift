Feature: ServiceCybersource
  As a developer
  I want to interact with the Cybersource payment API
  So that I can process payments and manage subscriptions

  Scenario: Constructing ServiceCybersource with default base URL
    Given no base URL is provided
    When the ServiceCybersource is constructed
    Then it should use the environment variable or empty string as base URL

  Scenario: Constructing ServiceCybersource with custom base URL
    Given a custom base URL
    When the ServiceCybersource is constructed with the custom URL
    Then it should initialize with the provided base URL

  Scenario: Starting up the service in development mode
    Given a ServiceCybersource instance
    And NODE_ENV is set to development
    When startUp is called
    Then it should create an axios client with the base URL

  Scenario: Starting up the service when already started
    Given a started ServiceCybersource instance
    When startUp is called again
    Then it should throw an error indicating the service is already started

  Scenario: Shutting down the service
    Given a started ServiceCybersource instance
    When shutDown is called
    Then it should clear the client instance

  Scenario: Accessing service property when started
    Given a started ServiceCybersource instance
    When the service property is accessed
    Then it should return the axios client

  Scenario: Accessing service property when not started
    Given a ServiceCybersource instance that has not been started
    When the service property is accessed
    Then it should throw an error indicating the service is not started

  Scenario: Generating a public key
    Given a started ServiceCybersource instance
    When generatePublicKey is called
    Then it should post to the public key endpoint and return a key

  Scenario: Creating a customer profile
    Given a started ServiceCybersource instance
    And a customer profile and payment token info
    When createCustomerProfile is called
    Then it should post to the customers endpoint

  Scenario: Getting a customer profile
    Given a started ServiceCybersource instance
    And a customer ID
    When getCustomerProfile is called
    Then it should get from the customer endpoint

  Scenario: Adding a customer payment instrument
    Given a started ServiceCybersource instance
    And a customer profile and payment token info
    When addCustomerPaymentInstrument is called
    Then it should post to the payment instruments endpoint

  Scenario: Getting a customer payment instrument
    Given a started ServiceCybersource instance
    And a customer ID and payment instrument ID
    When getCustomerPaymentInstrument is called
    Then it should get the specific payment instrument

  Scenario: Getting customer payment instruments with pagination
    Given a started ServiceCybersource instance
    And a customer ID with offset and limit
    When getCustomerPaymentInstruments is called
    Then it should get payment instruments with pagination params

  Scenario: Deleting a customer payment instrument
    Given a started ServiceCybersource instance
    And a customer ID and payment instrument ID
    When deleteCustomerPaymentInstrument is called
    Then it should delete the payment instrument

  Scenario: Updating a customer payment instrument
    Given a started ServiceCybersource instance
    And a customer profile and payment instrument info
    When updateCustomerPaymentInstrument is called
    Then it should patch the payment instrument

  Scenario: Processing a payment
    Given a started ServiceCybersource instance
    And payment details
    When processPayment is called
    Then it should post to the payments endpoint

  Scenario: Processing a refund
    Given a started ServiceCybersource instance
    And refund details
    When processRefund is called
    Then it should post to the refunds endpoint

  Scenario: Getting transaction by reference ID
    Given a ServiceCybersource instance
    And a reference ID
    When getSuccessOrLatestFailedTransactionsByReferenceId is called
    Then it should return a mock transaction receipt

  Scenario: Creating a plan
    Given a started ServiceCybersource instance
    And plan creation details
    When createPlan is called
    Then it should post to the plans endpoint

  Scenario: Getting list of plans
    Given a started ServiceCybersource instance
    When listOfPlans is called
    Then it should get from the plans endpoint

  Scenario: Getting a specific plan
    Given a started ServiceCybersource instance
    And a plan ID
    When getPlan is called
    Then it should get the specific plan

  Scenario: Creating a subscription
    Given a started ServiceCybersource instance
    And subscription details
    When createSubscription is called
    Then it should post to the subscriptions endpoint

  Scenario: Updating plan for subscription
    Given a started ServiceCybersource instance
    And a subscription ID and plan ID
    When updatePlanForSubscription is called
    Then it should patch the subscription

  Scenario: Getting list of subscriptions
    Given a started ServiceCybersource instance
    When listOfSubscriptions is called
    Then it should get from the subscriptions endpoint

  Scenario: Suspending a subscription
    Given a started ServiceCybersource instance
    And a subscription ID
    When suspendSubscription is called
    Then it should post to the suspend endpoint
