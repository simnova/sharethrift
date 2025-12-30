Feature: <AggregateRoot> ReservationRequest

  Background:
    Given a valid Passport with reservation request permissions
    And a valid PersonalUserEntityReference for "reserverUser"
    And a valid ItemListingEntityReference for "listing1" with state "Active"
    And base reservation request properties with state "REQUESTED", listing "listing1", reserver "reserverUser", valid reservation period, and timestamps	
        
  Scenario: Creating a new reservation request instance
    When I create a new ReservationRequest aggregate using getNewInstance with state "REQUESTED", listing "listing1", reserver "reserverUser", reservationPeriodStart "tomorrow", and reservationPeriodEnd "next month"
    Then the reservation request's state should be "REQUESTED"
    And the reservation request's listing should reference "listing1"
    And the reservation request's reserver should reference "reserverUser"	
        
  Scenario: Setting reservation period start in the past	
    Given a new ReservationRequest aggregate being created	
    When I try to set the reservationPeriodStart to a past date	
    Then an error should be thrown indicating "Reservation period start date must be today or in the future"	
        
  Scenario: Setting reservation period end before start
    When I try to set reservationPeriodEnd to a date before reservationPeriodStart
    Then an error should be thrown indicating "Reservation start date must be before end date"	
        
  Scenario: Setting reserver after creation	
    Given an existing ReservationRequest aggregate	
    When I try to set a new listing	
    Then a PermissionError should be thrown with message "Listing can only be set when creating a new reservation request"	
        
  Scenario: Accepting a requested reservation with permission
    Given a ReservationRequest aggregate with state "REQUESTED"
    When I set state to "ACCEPTED"
    Then the reservation request's state should be "ACCEPTED"
        
  Scenario: Accepting a reservation without permission
    Given a ReservationRequest aggregate with state "REQUESTED"
    When I try to set state to "ACCEPTED"
    Then a PermissionError should be thrown
        
  Scenario: Rejecting a requested reservation with permission
    Given a ReservationRequest aggregate with state "REQUESTED"
    When I set state to "REJECTED"
    Then the reservation request's state should be "REJECTED"
        
  Scenario: Rejecting a reservation without permission
    Given a ReservationRequest aggregate with state "REQUESTED"
    When I try to set state to "REJECTED"
    Then a PermissionError should be thrown
        
  Scenario: Cancelling a requested reservation with permission
    Given a ReservationRequest aggregate with state "REQUESTED"
    When I set state to "CANCELLED"
    Then the reservation request's state should be "CANCELLED"
        
  Scenario: Cancelling a reservation without permission
    Given a ReservationRequest aggregate with state "REQUESTED"
    When I try to set state to "CANCELLED"
    Then a PermissionError should be thrown	
        
  Scenario: Closing an accepted reservation when reserver requested close
    Given a ReservationRequest aggregate with state "ACCEPTED"
    And closeRequestedBy is "RESERVER"
    When I set state to "CLOSED"
    Then the reservation request's state should be "CLOSED"	
        
  Scenario: Closing an accepted reservation without any close request
    Given a ReservationRequest aggregate with state "ACCEPTED"
    When I try to set state to "CLOSED"
    Then an error should be thrown indicating "Can only close reservation requests if at least one user requested it"
        
  Scenario: Requesting close without permission
    Given a ReservationRequest aggregate with state "ACCEPTED"
    When I try to set closeRequestedBy to "SHARER"
    Then a PermissionError should be thrown
        
  Scenario: Requesting close in invalid state
    Given a ReservationRequest aggregate with state "REQUESTED"
    When I try to set closeRequestedBy to "RESERVER"
    Then an error should be thrown indicating "Cannot close reservation in current state"	
        
  Scenario: Loading linked entities	
    Given a ReservationRequest aggregate	
    When I call loadListing	
    Then it should return the associated listing	
    When I call loadReserver	
    Then it should return the associated reserver	
        
  Scenario: Reading audit fields	
    Given a ReservationRequest aggregate	
    Then createdAt should return the correct date	
    And updatedAt should return the correct date	
    And schemaVersion should return the correct version

  Scenario: Setting reservation period start to null
    Given a new ReservationRequest aggregate being created
    When I try to set the reservationPeriodStart to null
    Then an error should be thrown indicating "value cannot be null or undefined"

  Scenario: Setting reservation period end to null
    Given a new ReservationRequest aggregate being created
    When I try to set the reservationPeriodEnd to null
    Then an error should be thrown indicating "value cannot be null or undefined"

  Scenario: Setting reservation period start to past date
    Given a new ReservationRequest aggregate being created
    When I try to set the reservationPeriodStart to a past date
    Then an error should be thrown indicating "Reservation period start date must be today or in the future"

  Scenario: Setting listing to null
    Given a new ReservationRequest aggregate being created
    When I try to set the listing to null
    Then an error should be thrown indicating "value cannot be null or undefined"

  Scenario: Setting listing with non-published state
    Given a new ReservationRequest aggregate being created
    When I try to set listing to a non-published listing
    Then an error should be thrown indicating "Cannot create reservation request for listing that is not active"

  Scenario: Setting reserver to null
    Given a new ReservationRequest aggregate being created
    When I try to set the reserver to null
    Then an error should be thrown indicating "value cannot be null or undefined"

  Scenario: Cancelling a rejected reservation with permission
    Given a ReservationRequest aggregate with state "REJECTED"
    When I set state to "CANCELLED"
    Then the reservation request's state should be "CANCELLED"

  Scenario: Cancelling an accepted reservation should fail
    Given a ReservationRequest aggregate with state "ACCEPTED"
    When I try to set state to "CANCELLED"
    Then an error should be thrown indicating "Cannot cancel reservation in current state"

  Scenario: Rejecting a non-requested reservation should fail
    Given a ReservationRequest aggregate with state "ACCEPTED"
    When I try to set state to "REJECTED"
    Then an error should be thrown indicating "Can only reject requested reservations"

  Scenario: Accepting a non-requested reservation should fail
    Given a ReservationRequest aggregate with state "REJECTED"
    When I try to set state to "ACCEPTED"
    Then an error should be thrown indicating "Can only accept requested reservations"

  Scenario: Closing a non-accepted reservation should fail
    Given a ReservationRequest aggregate with state "REQUESTED"
    When I try to close the reservation
    Then an error should be thrown indicating "Can only close accepted reservations"

  Scenario: Closing without permission should fail
    Given a ReservationRequest aggregate with state "ACCEPTED" without close permission
    When I try to set state to "CLOSED"
    Then a PermissionError should be thrown

  Scenario: Closing with only sharer request
    Given a ReservationRequest aggregate with state "ACCEPTED"
    And closeRequestedBy is "SHARER"
    When I set state to "CLOSED"
    Then the reservation request's state should be "CLOSED"

  Scenario: Setting reservation period start after end should fail
    Given a new ReservationRequest aggregate being created with end date set
    When I try to set reservationPeriodStart to a date after the end date
    Then an error should be thrown indicating "Reservation period start date must be before the end date"

  Scenario: Setting reservation period end at or before start should fail
    Given a new ReservationRequest aggregate being created with start date set
    When I try to set reservationPeriodEnd to a date before or equal to the start date
    Then an error should be thrown indicating "Reservation period end date must be after the start date"

  Scenario: Setting reservation period start after creation should fail
    Given an existing ReservationRequest aggregate
    When I try to update the reservation period start date
    Then a PermissionError should be thrown with message "Reservation period start date cannot be updated after creation"

  Scenario: Setting reservation period end after creation should fail
    Given an existing ReservationRequest aggregate
    When I try to update the reservation period end date
    Then a PermissionError should be thrown with message "You do not have permission to update this reservation period"

  Scenario: Setting reserver after creation should fail
    Given an existing ReservationRequest aggregate
    When I try to set a new reserver
    Then a PermissionError should be thrown with message "Reserver can only be set when creating a new reservation request"