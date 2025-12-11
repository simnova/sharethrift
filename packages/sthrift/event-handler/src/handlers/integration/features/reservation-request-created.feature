Feature: Register Reservation Request Created Handler

  Scenario: Handler registration with EventBusInstance
    Given a domain data source and email service are provided
    When the reservation request created handler is registered
    Then the EventBusInstance should register the handler with ReservationRequestCreated event

  Scenario: Handler sends reservation request notification
    Given the handler is registered and receives a reservation request created event
    When the event contains reservation request ID, listing ID, reserver ID, sharer ID, and reservation period
    Then the notification service should send a reservation request notification with the event details

  Scenario: Handler execution with valid payload
    Given a ReservationRequestCreated event is triggered
    When the handler processes the event payload with all required fields
    Then the notificationService.sendReservationRequestNotification should be called with the correct parameters

  Scenario: Multiple reservation request events
    Given multiple ReservationRequestCreated events occur
    When each event is processed by the registered handler
    Then each event should trigger a separate notification
