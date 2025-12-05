Feature: AdminUser User Passport
	Scenario: Admin user can access personal user entities
		Given I have an admin user user passport
		When I request access to a personal user
		Then visa should be created with permission function

	Scenario: Admin user can access admin user entities
		Given I have an admin user user passport
		When I request access to an admin user
		Then visa should be created with permission function

	Scenario: Admin user user passport is defined
		Given I create an admin user user passport
		When I check the passport
		Then it should be defined

	Scenario: Admin can block personal users with permission
		Given I have an admin with canBlockUsers permission
		When I check if admin can block a personal user
		Then permission should be granted

	Scenario: Admin cannot block personal users without permission
		Given I have an admin without canBlockUsers permission
		When I check if admin can block a personal user
		Then permission should be denied

	Scenario: Admin can unblock personal users with permission
		Given I have an admin with canBlockUsers permission
		When I check if admin can unblock a personal user
		Then permission should be granted

	Scenario: Admin cannot unblock personal users without permission
		Given I have an admin without canBlockUsers permission
		When I check if admin can unblock a personal user
		Then permission should be denied

	Scenario: Admin can block personal user listings with moderation permission
		Given I have an admin with canModerateListings permission
		When I check if admin can block personal user listings
		Then permission should be granted

	Scenario: Admin cannot block personal user listings without moderation permission
		Given I have an admin without canModerateListings permission
		When I check if admin can block personal user listings
		Then permission should be denied

	Scenario: Admin can unblock personal user listings with moderation permission
		Given I have an admin with canModerateListings permission
		When I check if admin can unblock personal user listings
		Then permission should be granted

	Scenario: Admin cannot unblock personal user listings without moderation permission
		Given I have an admin without canModerateListings permission
		When I check if admin can unblock personal user listings
		Then permission should be denied

	Scenario: Admin can remove personal user listings with delete content permission
		Given I have an admin with canDeleteContent permission
		When I check if admin can remove personal user listings
		Then permission should be granted

	Scenario: Admin cannot remove personal user listings without delete content permission
		Given I have an admin without canDeleteContent permission
		When I check if admin can remove personal user listings
		Then permission should be denied

	Scenario: Admin can view personal user listing reports with view reports permission
		Given I have an admin with canViewReports permission
		When I check if admin can view personal user listing reports
		Then permission should be granted

	Scenario: Admin cannot view personal user listing reports without view reports permission
		Given I have an admin without canViewReports permission
		When I check if admin can view personal user listing reports
		Then permission should be denied

	Scenario: Admin can view personal user reports with canViewAllUsers permission
		Given I have an admin with canViewAllUsers permission
		When I check if admin can view personal user reports
		Then permission should be granted

	Scenario: Admin cannot view personal user reports without canViewAllUsers permission
		Given I have an admin without canViewAllUsers permission
		When I check if admin can view personal user reports
		Then permission should be denied

	Scenario: Admin can manage personal user roles with permission
		Given I have an admin with canManageUserRoles permission
		When I check if admin can manage personal user roles
		Then permission should be granted

	Scenario: Admin cannot manage personal user roles without permission
		Given I have an admin without canManageUserRoles permission
		When I check if admin can manage personal user roles
		Then permission should be denied

	Scenario: Admin is not editing personal user's own account
		Given I have an admin accessing a personal user account
		When I check if admin is editing own account
		Then flag should be false
