Feature: AdminUser User Visa
	Scenario: Admin user visa is created properly
		Given I create an admin user visa
		When I check the visa
		Then it should have determineIf function

	Scenario: Admin can block users with permission
		Given I have an admin user with canBlockUsers permission
		When I check if admin can block users
		Then permission should be granted

	Scenario: Admin cannot block users without permission
		Given I have an admin user without canBlockUsers permission
		When I check if admin can block users
		Then permission should be denied

	Scenario: Admin can unblock users with permission
		Given I have an admin user with canBlockUsers permission
		When I check if admin can unblock users
		Then permission should be granted

	Scenario: Admin cannot unblock users without permission
		Given I have an admin user without canBlockUsers permission
		When I check if admin can unblock users
		Then permission should be denied

	Scenario: Admin can block listings with moderation permission
		Given I have an admin user with canModerateListings permission
		When I check if admin can block listings
		Then permission should be granted

	Scenario: Admin cannot block listings without moderation permission
		Given I have an admin user without canModerateListings permission
		When I check if admin can block listings
		Then permission should be denied

	Scenario: Admin can unblock listings with moderation permission
		Given I have an admin user with canModerateListings permission
		When I check if admin can unblock listings
		Then permission should be granted

	Scenario: Admin cannot unblock listings without moderation permission
		Given I have an admin user without canModerateListings permission
		When I check if admin can unblock listings
		Then permission should be denied

	Scenario: Admin can remove listings with delete content permission
		Given I have an admin user with canDeleteContent permission
		When I check if admin can remove listings
		Then permission should be granted

	Scenario: Admin cannot remove listings without delete content permission
		Given I have an admin user without canDeleteContent permission
		When I check if admin can remove listings
		Then permission should be denied

	Scenario: Admin can view listing reports with view reports permission
		Given I have an admin user with canViewReports permission
		When I check if admin can view listing reports
		Then permission should be granted

	Scenario: Admin cannot view listing reports without view reports permission
		Given I have an admin user without canViewReports permission
		When I check if admin can view listing reports
		Then permission should be denied

	Scenario: Admin can view user reports with canViewAllUsers permission
		Given I have an admin user with canViewAllUsers permission
		When I check if admin can view user reports
		Then permission should be granted

	Scenario: Admin cannot view user reports without canViewAllUsers permission
		Given I have an admin user without canViewAllUsers permission
		When I check if admin can view user reports
		Then permission should be denied

	Scenario: Admin can manage user roles with permission
		Given I have an admin user with canManageUserRoles permission
		When I check if admin can manage user roles
		Then permission should be granted

	Scenario: Admin cannot manage user roles without permission
		Given I have an admin user without canManageUserRoles permission
		When I check if admin can manage user roles
		Then permission should be denied

	Scenario: Admin editing own account
		Given I have an admin user editing their own account
		When I check if admin is editing own account
		Then flag should be true

	Scenario: Admin editing another admin account
		Given I have an admin user editing another admin account
		When I check if admin is editing own account
		Then flag should be false
