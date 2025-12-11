Feature: ReservationRequest Aggregate

Background: 
  Given a valid Passport with reservation request permissions
  And a valid PersonalUserEntityReference for "reserverUser"
  And a valid ItemListingEntityReference for "listing1" with state "Published"
  And base reservation request properties with state "REQUESTED", listing "listing1", reserver "reserverUser", valid reservation period, and timestamps

Scenario: Creating a new reservation request instance
  When I create a new ReservationRequest aggregate using getNewInstance with state "REQUESTED", listing "listing1", reserver "reserverUser", reservationPeriodStart "tomorrow", and reservationPeriodEnd "next month"
  Then the reservation request's state should be "REQUESTED"
  And the reservation request's listing should reference "listing1"
  And the reservation request's reserver should reference "reserverUser"

Scenario: Setting reservation period start in the past
  Given a new ReservationRequest aggregate being created
  When I try to set the reservationPeriodStart to a past date
  Then an error should be thrown indicating "Reservation period start date cannot be updated after creation"

Scenario: Setting reservation period end before start
  Given a new ReservationRequest aggregate being created
  When I try to set reservationPeriodEnd to a date before reservationPeriodStart
  Then an error should be thrown indicating "Reservation start date must be before end date"

Scenario: Setting listing after creation
  Given an existing ReservationRequest aggregate
  When I try to set a new listing
  Then a PermissionError should be thrown with message "Listing can only be set when creating a new reservation request"

Scenario: Setting reserver after creation
  Given an existing ReservationRequest aggregate
  When I try to set a new reserver
  Then a PermissionError should be thrown with message "Reserver can only be set when creating a new reservation request"

Scenario: Accepting a requested reservation with permission
  Given a ReservationRequest aggregate with state "REQUESTED"
  And the user can edit reservation requests
  When I set state to "ACCEPTED"
  Then the reservation request's state should be "ACCEPTED"

Scenario: Accepting a reservation without permission
  Given a ReservationRequest aggregate with state "REQUESTED"
  And the user cannot edit reservation requests
  When I try to set state to "ACCEPTED"
  Then a PermissionError should be thrown

Scenario: Rejecting a requested reservation with permission
  Given a ReservationRequest aggregate with state "REQUESTED"
  And the user can edit reservation requests
  When I set state to "REJECTED"
  Then the reservation request's state should be "REJECTED"

Scenario: Rejecting a reservation without permission
  Given a ReservationRequest aggregate with state "REQUESTED"
  And the user cannot edit reservation requests
  When I try to set state to "REJECTED"
  Then a PermissionError should be thrown

Scenario: Cancelling a requested reservation with permission
  Given a ReservationRequest aggregate with state "REQUESTED"
  And the user can edit reservation requests
  When I set state to "CANCELLED"
  Then the reservation request's state should be "CANCELLED"

Scenario: Cancelling a reservation without permission
  Given a ReservationRequest aggregate with state "REQUESTED"
  And the user cannot edit reservation requests
  When I try to set state to "CANCELLED"
  Then a PermissionError should be thrown

Scenario: Closing an accepted reservation when sharer requested close
  Given a ReservationRequest aggregate with state "ACCEPTED"
  And closeRequestedBySharer is true
  And the user can edit reservation requests
  When I set state to "CLOSED"
  Then the reservation request's state should be "CLOSED"

Scenario: Closing an accepted reservation when reserver requested close
  Given a ReservationRequest aggregate with state "ACCEPTED"
  And closeRequestedByReserver is true
  And the user can edit reservation requests
  When I set state to "CLOSED"
  Then the reservation request's state should be "CLOSED"

Scenario: Closing an accepted reservation without any close request
  Given a ReservationRequest aggregate with state "ACCEPTED"
  And neither closeRequestedBySharer nor closeRequestedByReserver is true
  When I try to set state to "CLOSED"
  Then an error should be thrown indicating "Can only close reservation requests if at least one user requested it"

Scenario: Requesting close without permission
  Given a ReservationRequest aggregate with state "ACCEPTED"
  And the user cannot edit reservation requests
  When I try to set closeRequestedBySharer to true
  Then a PermissionError should be thrown

Scenario: Requesting close in invalid state
  Given a ReservationRequest aggregate with state "REQUESTED"
  And the user can edit reservation requests
  When I try to set closeRequestedByReserver to true
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

Scenario: Re-setting REQUESTED on an accepted reservation fails with PermissionError
  Given a ReservationRequest aggregate with state "REQUESTED"
  And the user can edit reservation requests
  And an existing reservation request in state "ACCEPTED"
  Then setting state to REQUESTED on an existing reservation should raise a PermissionError

Scenario: Setting an invalid state throws PermissionError
  Given a ReservationRequest aggregate with state "REQUESTED"
  And the user can edit reservation requests
  When I try to set state to "INVALID_STATE"
  Then a PermissionError should be thrown with message "Invalid reservation request state"
