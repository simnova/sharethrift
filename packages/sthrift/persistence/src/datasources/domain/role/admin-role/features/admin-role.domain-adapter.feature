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

	Scenario: Accessing user permissions
		When I access the permissions
		Then I can access the userPermissions property
		And the userPermissions should have all expected properties

	Scenario: Modifying user permissions
		When I access the permissions
		And I set canBlockUsers to true
		Then the canBlockUsers permission should be true
		When I set canViewAllUsers to true
		Then the canViewAllUsers permission should be true
		When I set canEditUsers to true
		Then the canEditUsers permission should be true
		When I set canDeleteUsers to true
		Then the canDeleteUsers permission should be true
		When I set canManageUserRoles to true
		Then the canManageUserRoles permission should be true
		When I set canAccessAnalytics to true
		Then the canAccessAnalytics permission should be true
		When I set canManageRoles to true
		Then the canManageRoles permission should be true
		When I set canViewReports to true
		Then the canViewReports permission should be true
		When I set canDeleteContent to true
		Then the canDeleteContent permission should be true

	Scenario: Accessing conversation permissions
		When I access the permissions
		Then I can access the conversationPermissions property
		And the conversationPermissions should have all expected properties

	Scenario: Modifying conversation permissions
		When I access the permissions
		And I set canViewAllConversations to true
		Then the canViewAllConversations permission should be true
		When I set canEditConversations to true
		Then the canEditConversations permission should be true
		When I set canDeleteConversations to true
		Then the canDeleteConversations permission should be true
		When I set canCloseConversations to true
		Then the canCloseConversations permission should be true
		When I set canModerateConversations to true
		Then the canModerateConversations permission should be true

	Scenario: Accessing listing permissions
		When I access the permissions
		Then I can access the listingPermissions property
		And the listingPermissions should have all expected properties

	Scenario: Modifying listing permissions
		When I access the permissions
		And I set canViewAllListings to true
		Then the canViewAllListings permission should be true
		When I set canManageAllListings to true
		Then the canManageAllListings permission should be true
		When I set canEditListings to true
		Then the canEditListings permission should be true
		When I set canDeleteListings to true
		Then the canDeleteListings permission should be true
		When I set canApproveListings to true
		Then the canApproveListings permission should be true
		When I set canRejectListings to true
		Then the canRejectListings permission should be true
		When I set canBlockListings to true
		Then the canBlockListings permission should be true
		When I set canUnblockListings to true
		Then the canUnblockListings permission should be true
		When I set canModerateListings to true
		Then the canModerateListings permission should be true

	Scenario: Accessing reservation request permissions
		When I access the permissions
		Then I can access the reservationRequestPermissions property
		And the reservationRequestPermissions should have all expected properties

	Scenario: Modifying reservation request permissions
		When I access the permissions
		And I set canViewAllReservations to true
		Then the canViewAllReservations permission should be true
		When I set canApproveReservations to true
		Then the canApproveReservations permission should be true
		When I set canRejectReservations to true
		Then the canRejectReservations permission should be true
		When I set canCancelReservations to true
		Then the canCancelReservations permission should be true
		When I set canEditReservations to true
		Then the canEditReservations permission should be true
		When I set canModerateReservations to true
		Then the canModerateReservations permission should be true
