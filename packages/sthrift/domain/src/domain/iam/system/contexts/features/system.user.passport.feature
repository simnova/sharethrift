Feature: System User Passport

Scenario: System passport for user should use permission function
	Given I have a system user passport
	When I request access to a user
	Then visa should use permission function

Scenario: System user passport should extend SystemPassportBase
	Given I create a system user passport
	When I check its prototype chain
	Then it should be an instance of the passport

Scenario: System passport forAdminUser should return visa with permission function
	Given I have a system user passport
	When I request access to an admin user
	Then admin user visa should use permission function

Scenario: System passport forPersonalUser visa should evaluate permission correctly
	Given I have a system user passport
	When I request access to a personal user and check permissions
	Then the permission function should be called with permissions object
