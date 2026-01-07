Feature: Cleanup archived reservation request conversations

Scenario: Successfully processing conversations for archived reservation requests
	Given archived reservation requests exist with states "Closed", "Rejected", and "Cancelled"
	And each reservation request has conversations without expiration dates
	When the processConversationsForArchivedReservationRequests command is executed
	Then the result should show the correct processed count
	And conversations without expiresAt should be scheduled for deletion
	And no errors should be reported

Scenario: Processing conversations already scheduled for deletion
	Given archived reservation requests exist
	And all conversations already have expiresAt set
	When the processConversationsForArchivedReservationRequests command is executed
	Then the processed count should reflect all conversations
	And the scheduled count should be zero
	And no errors should be reported

Scenario: Handling partial failures during cleanup
	Given archived reservation requests exist
	And one reservation request's conversations will fail to process
	When the processConversationsForArchivedReservationRequests command is executed
	Then the result should include errors for the failed reservation request
	And successful reservation requests should still be processed
	And the error count should match the number of failures

Scenario: Handling complete failure during cleanup
	Given the readonly data source fails when querying reservation requests
	When the processConversationsForArchivedReservationRequests command is executed
	Then the command should throw a fatal error
	And the error should be logged

Scenario: Processing when no archived reservation requests exist
	Given no archived reservation requests exist
	When the processConversationsForArchivedReservationRequests command is executed
	Then the processed count should be zero
	And the scheduled count should be zero
	And no errors should be reported
