Feature: <AggregateRoot> PersonalUserRole
 
  Background:
    Given a valid Passport with user management permissions
    And base personal user role properties with roleName "Member", isDefault true, valid timestamps and permissions

	Scenario: Creating a new personal user role instance
		When I create a new PersonalUserRole aggregate using getNewInstance
		Then the created role should have roleName "Member"
		And it should be marked as not new after creation
		And isDefault should be true
		And permissions should be properly assigned

	Scenario: Updating role name
		Given an existing PersonalUserRole aggregate
		When I set roleName to "Admin"
		Then the roleName value object should be updated to "Admin"

	Scenario: Getting permissions
		Given a valid PersonalUserRole aggregate
		When I access permissions
		Then it should return a PersonalUserRolePermissions instance

	Scenario: Checking readonly properties
		Given a valid PersonalUserRole aggregate
		Then schemaVersion, createdAt, and updatedAt should be accessible and valid