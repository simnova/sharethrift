Feature: UserAppealRequestReadRepository User Appeal Request Read Repository Exports

	Scenario: UserAppealRequestReadRepository exports
		Then getUserAppealRequestReadRepository should be exported from index
		And getUserAppealRequestReadRepository should be a function
		And UserAppealRequestReadRepository type should be exported from index
