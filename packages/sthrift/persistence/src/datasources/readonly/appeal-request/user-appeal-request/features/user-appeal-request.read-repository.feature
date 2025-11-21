Feature: <ReadRepository> UserAppealRequestReadRepository

Background:
Given a UserAppealRequestReadRepository instance with models and passport

	Scenario: Repository initialization
		Then the read repository should be defined
		And the read repository should have a getAll method
		And the read repository should have a getById method
