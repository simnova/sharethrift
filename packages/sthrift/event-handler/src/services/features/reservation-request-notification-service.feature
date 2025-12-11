Feature: ReservationRequestNotificationService

  Background:
    Given a ReservationRequestNotificationService with a domain data source and email service
    And a system passport for accessing domain repositories

  Scenario: Successfully send reservation request notification to sharer
    Given a reservation request event with valid reserver, sharer, and listing IDs
    When sendReservationRequestNotification is called with all required parameters
    Then the system should fetch the sharer from PersonalUser repository
    And the system should fetch the reserver from PersonalUser repository
    And the system should fetch the listing from ItemListing repository
    And the email service should send a templated email to the sharer
    And the notification should include sharer name, reserver name, listing title, and reservation period

  Scenario: Fallback to AdminUser when PersonalUser not found
    Given a reservation request with a user ID that doesn't exist in PersonalUser
    When sendReservationRequestNotification is called
    Then the system should attempt to fetch the user from PersonalUser first
    And on PersonalUser failure, it should retry with AdminUser repository
    And if found in AdminUser, the notification should be sent successfully

  Scenario: Handle missing sharer gracefully
    Given a reservation request with a sharer ID that doesn't exist in either PersonalUser or AdminUser
    When sendReservationRequestNotification is called
    Then an error should be logged for the missing sharer
    And the service should not send any email notification
    And the service should not throw an error

  Scenario: Handle missing reserver gracefully
    Given a reservation request with a reserver ID that doesn't exist
    When sendReservationRequestNotification is called
    Then the system should successfully fetch the sharer
    And an error should be logged when fetching the reserver fails
    And the service should return without throwing an error

  Scenario: Handle missing listing gracefully
    Given a reservation request with a listing ID that doesn't exist
    When sendReservationRequestNotification is called
    Then the system should successfully fetch both users
    And an error should be logged when fetching the listing fails
    And the service should return without throwing an error

  Scenario: Handle sharer with no email address
    Given a sharer user that has no email address
    When sendReservationRequestNotification is called
    Then an error should be logged indicating sharer has no email
    And no email should be sent
    And the service should return gracefully

  Scenario: Extract email from PersonalUser account
    Given a PersonalUser with email in user.account.email
    When getUserEmail helper is called
    Then it should return the email from user.account.email

  Scenario: Extract email from AdminUser profile
    Given an AdminUser with email in user.profile.email
    When getUserEmail helper is called
    Then it should return the email from user.profile.email

  Scenario: Return null when user has no email
    Given a user with no email in either account or profile
    When getUserEmail helper is called
    Then it should return null

  Scenario: Extract display name from PersonalUser profile
    Given a PersonalUser with firstName and lastName in user.profile
    When getUserDisplayName helper is called
    Then it should return firstName and lastName combined

  Scenario: Extract display name from PersonalUser with only firstName
    Given a PersonalUser with only firstName in user.profile
    When getUserDisplayName helper is called
    Then it should return only the firstName

  Scenario: Extract display name from AdminUser profile
    Given an AdminUser with name in user.profile.name
    When getUserDisplayName helper is called
    Then it should return the name from user.profile.name

  Scenario: Use fallback name when user has no display name
    Given a user with no display name in profile
    When getUserDisplayName helper is called with fallback name
    Then it should return the provided fallback name

  Scenario: Get complete contact information for user
    Given a user with valid email and display name
    When getUserContactInfo helper is called
    Then it should return an object with both email and name

  Scenario: Return null when user has no email in contact info
    Given a user with no email
    When getUserContactInfo helper is called
    Then it should return null regardless of display name
