Feature: Conversation Cleanup Handler
	As a system administrator
	I want to automatically clean up conversations for archived listings and reservation requests
	So that data retention policies are enforced

	Scenario: Executing both cleanup phases successfully
		Given a conversation cleanup handler
		When the timer trigger fires
		Then both cleanup phases should execute successfully
		And the handler should log listings cleanup completion
		And the handler should log reservation requests cleanup completion
		And the handler should log overall totals

	Scenario: Timer is past due
		Given a conversation cleanup handler
		When the timer trigger fires and is past due
		Then the handler should log that the timer is past due
		And both cleanup phases should still execute

	Scenario: Logging errors from listings cleanup without preventing reservation cleanup
		Given a conversation cleanup handler
		When the listings cleanup phase has errors
		Then the handler should log the listings errors
		And the reservation requests cleanup should still execute

	Scenario: Continuing with reservation cleanup even if listings cleanup throws
		Given a conversation cleanup handler
		When the listings cleanup phase throws a fatal error
		Then the handler should log the fatal listings error
		And the reservation requests cleanup should still execute
		And the handler should throw the listings error

	Scenario: Throwing if both cleanup phases fail
		Given a conversation cleanup handler
		When both cleanup phases throw fatal errors
		Then the handler should log that both phases failed
		And the handler should throw a combined error

	Scenario: Throwing only reservation error if only reservation phase fails
		Given a conversation cleanup handler
		When only the reservation cleanup phase throws a fatal error
		Then the listings cleanup should complete successfully
		And the handler should log the fatal reservation error
		And the handler should throw the reservation error
