Feature: <DomainAdapter> AdminRoleDomainAdapter

Background:
Given an AdminRole document from the database
And an AdminRoleDomainAdapter wrapping the document

	Scenario: Accessing admin role properties
		Then the domain adapter should have a roleName property
		And the domain adapter should have a roleType property
		And the domain adapter should have an isDefault property
		And the domain adapter should have a permissions property

	Scenario: Modifying admin role name
		When I set the roleName to "Super Admin"
		Then the roleName should be "Super Admin"

	Scenario: Modifying admin role isDefault
		When I set the isDefault to true
		Then the isDefault should be true
