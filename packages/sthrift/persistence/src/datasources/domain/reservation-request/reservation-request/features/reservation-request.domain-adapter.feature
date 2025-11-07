Feature: ReservationRequestDomainAdapter

  Background:
    Given a valid ReservationRequest document with populated reserver and listing

  Scenario: Getting the state property
    When I get the state property
    Then it should return the correct value

  Scenario: Setting the state property
    When I set the state property to "ACCEPTED"
    Then the document's state should be "ACCEPTED"

  Scenario: Getting the closeRequestedBySharer property
    When I get the closeRequestedBySharer property
    Then it should return the correct value

  Scenario: Setting the closeRequestedBySharer property
    When I set the closeRequestedBySharer property to true
    Then the document's closeRequestedBySharer should be true

  Scenario: Getting the closeRequestedByReserver property
    When I get the closeRequestedByReserver property
    Then it should return the correct value

  Scenario: Setting the closeRequestedByReserver property
    When I set the closeRequestedByReserver property to true
    Then the document's closeRequestedByReserver should be true

  Scenario: Getting the reservationPeriodStart property
    When I get the reservationPeriodStart property
    Then it should return a Date

  Scenario: Setting the reservationPeriodStart property
    When I set the reservationPeriodStart property to a new date
    Then the document's reservationPeriodStart should be updated

  Scenario: Getting the reservationPeriodEnd property
    When I get the reservationPeriodEnd property
    Then it should return a Date

  Scenario: Setting the reservationPeriodEnd property
    When I set the reservationPeriodEnd property to a new date
    Then the document's reservationPeriodEnd should be updated

  Scenario: Getting the reserver property when populated
    When I get the reserver property
    Then it should return a PersonalUserDomainAdapter with the correct doc

  Scenario: Getting the reserver property when not populated
    When I get the reserver property on a doc with no reserver
    Then an error should be thrown indicating reserver is not populated

  Scenario: Getting the reserver property when it is an ObjectId
    When I get the reserver property on a doc with reserver as ObjectId
    Then an error should be thrown indicating reserver is not populated or is not of the correct type

  Scenario: Setting the reserver property
    When I set the reserver property to a valid PersonalUserDomainAdapter
    Then the document's reserver should be set to the user's ObjectId

  Scenario: Getting the listing property when populated
    When I get the listing property
    Then it should return an ItemListingDomainAdapter with the correct doc

  Scenario: Getting the listing property when not populated
    When I get the listing property on a doc with no listing
    Then an error should be thrown indicating listing is not populated

  Scenario: Getting the listing property when it is an ObjectId
    When I get the listing property on a doc with listing as ObjectId
    Then an error should be thrown indicating listing is not populated or is not of the correct type

  Scenario: Setting the listing property
    When I set the listing property to a valid ItemListingDomainAdapter
    Then the document's listing should be set to the listing's ObjectId
