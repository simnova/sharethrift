Feature: ReservationRequestNotificationService

  Background:
    Given a ReservationRequestNotificationService with a domain data source and email service
    And a system passport for accessing domain repositories

  Scenario: Successfully send reservation request notification to sharer
    Given a reservation request event with valid reserver, sharer, and listing IDs
    When sendReservationRequestNotification is called with all required parameters
    Then the system should log processing notification message
    And the system should fetch the sharer from PersonalUser repository
    And the system should fetch the reserver from PersonalUser repository
    And the system should fetch the listing from ItemListing repository
    And the email service should send a templated email to the sharer
    And the notification should include sharer name, reserver name, listing title, and reservation period
    And the system should log success message

  Scenario: Fallback to AdminUser when PersonalUser sharer not found
    Given a reservation request where sharer doesn't exist in PersonalUser
    When sendReservationRequestNotification is called
    Then the system should attempt to fetch sharer from PersonalUser first
    And log message about trying admin user
    And retry with AdminUser repository
    And if found in AdminUser, notification should be sent successfully
    And reserver lookups should complete normally

  Scenario: Fallback to AdminUser when PersonalUser reserver not found
    Given a reservation request where reserver doesn't exist in PersonalUser but exists in AdminUser
    When sendReservationRequestNotification is called
    Then the system should fetch sharer from PersonalUser successfully
    And attempt to fetch reserver from PersonalUser
    And log message about trying admin user for reserver
    And retry with AdminUser repository for reserver
    And successfully send notification with both users

  Scenario: Handle sharer not found in either PersonalUser or AdminUser
    Given a reservation request with a sharer ID that doesn't exist in either repository
    When sendReservationRequestNotification is called
    Then an error should be logged indicating sharer not found in AdminUser
    And the service should not send any email notification
    And the service should not throw an error

  Scenario: Handle reserver not found in either PersonalUser or AdminUser
    Given a reservation request where reserver doesn't exist in either PersonalUser or AdminUser
    When sendReservationRequestNotification is called
    Then the system should successfully fetch the sharer
    And an error should be logged indicating reserver not found in AdminUser
    And the service should not send any email notification
    And the service should return without throwing an error

  Scenario: Handle missing listing
    Given a reservation request with a listing ID that doesn't exist
    When sendReservationRequestNotification is called
    Then the system should successfully fetch both users
    And an error should be logged when fetching the listing fails
    And the service should not send any email notification
    And the service should return without throwing an error

  Scenario: Handle sharer with no email address
    Given a sharer user with no email in account or profile
    When sendReservationRequestNotification is called
    Then an error should be logged indicating sharer has no email
    And no email should be sent
    And the service should return gracefully

  Scenario: Extract name from PersonalUser with firstName and lastName
    Given a PersonalUser with both firstName and lastName in profile
    When resolving the display name
    Then it should return firstName and lastName combined

  Scenario: Extract name from PersonalUser with only firstName
    Given a PersonalUser with only firstName in profile
    When resolving the display name
    Then it should return only the firstName

  Scenario: Extract name from AdminUser profile
    Given an AdminUser with name in profile
    When resolving the display name for AdminUser
    Then it should return the name from profile

  Scenario: Use fallback name when user has no display name
    Given a user with no firstName, lastName, or name in profile
    When resolving the display name with a fallback
    Then it should return the provided fallback name or 'User' for sharer

  Scenario: Extract email from PersonalUser account
    Given a PersonalUser with email in account.email
    When resolving the email
    Then it should return the email from account.email

  Scenario: Extract email from AdminUser profile
    Given an AdminUser with email in profile.email
    When resolving the email for AdminUser
    Then it should return the email from profile.email

  Scenario: Return null when user has no email
    Given a user with no email in account or profile
    When resolving the email
    Then it should return null or fallback to 'Unknown Listing'

  Scenario: Format reservation dates correctly
    Given reservation dates as Date objects
    When sending email notification
    Then dates should be formatted using toLocaleDateString()
    And include year, month, and day information

  Scenario: Handle string date parameters
    Given reservation dates as ISO string format
    When sendReservationRequestNotification is called
    Then the system should convert strings to Date objects
    And format them correctly in the email template

  Scenario: Handle listing with no title
    Given a listing without title property
    When sending email notification
    Then it should use 'Unknown Listing' as fallback
    And email should still be sent successfully

  Scenario: Handle email service failure gracefully
    Given email service throws an error
    When sendReservationRequestNotification is called with valid data
    Then an error should be logged
    And the service should not throw an error to caller
    And the transaction should complete without failure
