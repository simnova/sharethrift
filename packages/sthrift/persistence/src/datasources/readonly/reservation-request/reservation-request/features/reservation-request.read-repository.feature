Feature: ReservationRequestReadRepository

Background:
Given a ReservationRequestReadRepository instance with a working Mongoose model and passport
And valid ReservationRequest documents exist in the database

	Scenario: Getting all reservation requests
		Given multiple ReservationRequest documents in the database
		When I call getAll
		Then I should receive an array of ReservationRequest entities
		And the array should contain all reservation requests

	Scenario: Getting a reservation request by ID
		Given a ReservationRequest document with id "reservation-1"
		When I call getById with "reservation-1"
		Then I should receive a ReservationRequest entity
		And the entity's id should be "reservation-1"

	Scenario: Getting a reservation request by nonexistent ID
		When I call getById with "nonexistent-id"
		Then it should return null

	Scenario: Getting reservation requests by reserver ID
		Given a ReservationRequest document with reserver "user-1"
		When I call getByReserverId with "user-1"
		Then I should receive an array of ReservationRequest entities
		And the array should contain reservation requests where reserver is "user-1"

	Scenario: Getting active reservation requests by reserver ID with listing and sharer
		Given a ReservationRequest document with reserver "user-1" and state "Accepted"
		When I call getActiveByReserverIdWithListingWithSharer with "user-1"
		Then I should receive an array of ReservationRequest entities
		And the array should contain active reservation requests with populated listing and reserver

	Scenario: Getting past reservation requests by reserver ID
		Given a ReservationRequest document with reserver "user-1" and state "Closed"
		When I call getPastByReserverIdWithListingWithSharer with "user-1"
		Then I should receive an array of ReservationRequest entities
		And the array should contain past reservation requests

	Scenario: Getting listing requests by sharer ID
		Given a ReservationRequest document with listing owned by "sharer-1"
		When I call getListingRequestsBySharerId with "sharer-1"
		Then I should receive a paginated result with items
		And the items array should contain reservation requests for listings owned by "sharer-1"

	Scenario: Getting listing requests by sharer ID with pagination
		Given multiple ReservationRequest documents for listings owned by "sharer-1"
		When I call getListingRequestsBySharerId with "sharer-1", page 2, and pageSize 2
		Then I should receive a paginated result with page 2 and pageSize 2
		And the items array should contain 2 reservation requests

	Scenario: Getting listing requests by sharer ID with search
		Given ReservationRequest documents with different listing titles
		When I call getListingRequestsBySharerId with "sharer-1" and searchText "camera"
		Then I should receive a paginated result with items
		And only items with listing titles containing "camera" should be included

	Scenario: Getting listing requests by sharer ID with status filters
		Given ReservationRequest documents with different states
		When I call getListingRequestsBySharerId with "sharer-1" and statusFilters ["Approved"]
		Then I should receive a paginated result with items
		And only items with state "Approved" should be included

	Scenario: Getting listing requests by sharer ID with sorting
		Given ReservationRequest documents with different createdAt dates
		When I call getListingRequestsBySharerId with "sharer-1" and sorter field "createdAt" order "descend"
		Then I should receive a paginated result with items
		And the items should be sorted by createdAt in descending order

	Scenario: Getting active reservation by reserver ID and listing ID
		Given a ReservationRequest document with reserver "user-1", listing "listing-1", and state "Accepted"
		When I call getActiveByReserverIdAndListingId with "user-1" and "listing-1"
		Then I should receive a ReservationRequest entity
		And the entity's reserver id should be "user-1"
		And the entity's listing id should be "listing-1"

	Scenario: Getting overlapping active reservation requests for a listing
		Given a ReservationRequest document for listing "listing-1" from "2025-10-20" to "2025-10-25" with state "Accepted"
		When I call getOverlapActiveReservationRequestsForListing with "listing-1", start "2025-10-22", end "2025-10-27"
		Then I should receive an array of ReservationRequest entities
		And the array should contain overlapping active reservation requests

	Scenario: Getting active reservations by listing ID
		Given a ReservationRequest document with listing "listing-1" and state "Requested"
		When I call getActiveByListingId with "listing-1"
		Then I should receive an array of ReservationRequest entities
		And the array should contain active reservation requests for the listing

