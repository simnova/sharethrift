
Feature: <AggregateRoot>ItemListing

  Background:
    Given a valid Passport with listing permissions
    And a valid PersonalUserEntityReference for ""user1""
    And base item listing fields with title ""Old Title"", description ""Old Description"", category ""Electronics"", location ""Delhi"", sharingPeriodStart ""2025-10-06"", sharingPeriodEnd ""2025-11-06"", and valid timestamps"	
        
  Scenario: Creating a new item listing instance	
    When I create a new ItemListing aggregate using getNewInstance with sharer "user1" and title "New Listing"	
    Then the listing's title should be "New Listing"	
    And the listing's sharer should reference "user1"	
    And the listing state should be "Active"	
        
  Scenario: Creating a new draft listing with missing fields	
    When I create a new ItemListing aggregate using getNewInstance with isDraft true and empty title, description, category, and location	
    Then the listing's title should default to empty
    And the listing's description should default to empty
    And the listing's category should default to empty
    And the listing's location should default to empty
    And the listing state should be "Draft"	
        
  Scenario: Changing the title with permission to update listings	
    Given an ItemListing aggregate with permission to update item listing	
    When I set the title to "Updated Title"	
    Then the listing's title should be "Updated Title"	
    And the updatedAt timestamp should change	
        
  Scenario: Changing the title without permission	
    Given an ItemListing aggregate without permission to update item listing	
    When I try to set the title to "Updated Title"	
    Then a PermissionError should be thrown	
    And the title should remain unchanged	
        
  Scenario: Changing the description with permission	
    Given an ItemListing aggregate with permission to update item listing	
    When I set the description to "Updated Description"	
    Then the listing's description should be "Updated Description"	
        
  Scenario: Changing the description without permission	
    Given an ItemListing aggregate without permission to update item listing	
    When I try to set the description to "Updated Description"	
    Then a PermissionError should be thrown	
        
  Scenario: Changing the category with permission	
    Given an ItemListing aggregate with permission to update item listing	
    When I set the category to "Books"	
    Then the listing's category should be "Books"	
        
  Scenario: Changing the category without permission	
    Given an ItemListing aggregate without permission to update item listing	
    When I try to set the category to "Books"	
    Then a PermissionError should be thrown	
        
  Scenario: Changing the location with permission	
    Given an ItemListing aggregate with permission to update item listing	
    When I set the location to "Mumbai"	
    Then the listing's location should be "Mumbai"	
        
  Scenario: Changing the location without permission	
    Given an ItemListing aggregate without permission to update item listing	
    When I try to set the location to "Mumbai"	
    Then a PermissionError should be thrown	
        
  Scenario: Changing sharing period with permission	
    Given an ItemListing aggregate with permission to update item listing	
    When I set the sharingPeriodStart to "2025-10-10"	
    And I set the sharingPeriodEnd to "2025-12-10"	
    Then the sharing period should update accordingly	
        
  Scenario: Changing sharing period without permission	
    Given an ItemListing aggregate without permission to update item listing	
    When I try to set the sharingPeriodStart or sharingPeriodEnd	
    Then a PermissionError should be thrown	
        
  Scenario: Changing images with permission	
    Given an ItemListing aggregate with permission to update item listing	
    When I set images to ["img1.png", "img2.png"]	
    Then the listing's images should be ["img1.png", "img2.png"]	
        
  Scenario: Changing images without permission	
    Given an ItemListing aggregate without permission to update item listing	
    When I try to set images to ["img1.png", "img2.png"]	
    Then a PermissionError should be thrown	
        
  Scenario: Publishing a listing with permission	
    Given an ItemListing aggregate with permission to publish item listing	
    When I call publish()	
    Then the listing's state should be "Active"	
    And the updatedAt timestamp should change

  Scenario: Publishing a listing without permission
    Given an ItemListing aggregate without permission to publish item listing
    When I try to call publish()
    Then a PermissionError should be thrown

  Scenario: Requesting delete with permission
    Given an ItemListing aggregate with permission to delete item listing
    When I call requestDelete()
    Then the listing's isDeleted flag should be true

  Scenario: Requesting delete without permission
    Given an ItemListing aggregate without permission to delete item listing
    When I try to call requestDelete()
    Then a PermissionError should be thrown
    And the listing's isDeleted flag should remain false

  Scenario: Requesting delete when already deleted
    Given an ItemListing aggregate with permission to delete item listing
    And the listing is already marked as deleted
    When I call requestDelete() again
    Then the listing's isDeleted flag should remain true
    And no error should be thrown

  Scenario: Pausing a listing with permission
    Given an ItemListing aggregate with permission to unpublish item listing
    When I call pause()
    Then the listing's state should be "Paused"
    And the updatedAt timestamp should change

  Scenario: Pausing a listing without permission
    Given an ItemListing aggregate without permission to unpublish item listing
    When I try to call pause()
    Then a PermissionError should be thrown

  Scenario: Cancelling a listing with permission
    Given an ItemListing aggregate with permission to delete item listing
    When I call cancel()
    Then the listing's state should be "Cancelled"

  Scenario: Cancelling a listing without permission
    Given an ItemListing aggregate without permission to delete item listing
    When I try to call cancel()
    Then a PermissionError should be thrown

  Scenario: Blocking a listing with permission
    Given an ItemListing aggregate with permission to publish item listing
    When I call setBlocked(true)
    Then the listing's state should be "Blocked"

  Scenario: Blocking already blocked listing
    Given an ItemListing aggregate with permission to publish item listing that is already blocked
    When I call setBlocked(true) again
    Then the listing's state should remain "Blocked"

  Scenario: Unblocking non-blocked listing
    Given an ItemListing aggregate with permission to publish item listing in Active state
    When I call setBlocked(false)
    Then the listing's state should remain "Active"

  Scenario: Blocking a listing without permission
    Given an ItemListing aggregate without permission to publish item listing
    When I try to call setBlocked(true)
    Then a PermissionError should be thrown

  Scenario: Unblocking a listing without permission
    Given an ItemListing aggregate without permission to publish item listing that is blocked
    When I try to call setBlocked(false)
    Then a PermissionError should be thrown

  Scenario: Getting listingType from item listing
    Given an ItemListing aggregate
    When I access the listingType property
    Then it should return "item"

  Scenario: Setting listingType for item listing
    Given an ItemListing aggregate
    When I set the listingType to "premium-listing"
    Then the listingType should be updated to "premium-listing"

  Scenario: Loading sharer asynchronously
    Given an ItemListing aggregate
    When I call loadSharer()
    Then sharer should be loaded

  Scenario: Getting entity reference
    Given an ItemListing aggregate
    When I call getEntityReference()
    Then it should return ItemListingEntityReference

  Scenario: Accessing displayLocation getter
    Given an ItemListing aggregate with location "San Francisco"
    When I access displayLocation
    Then it should return the same location value

  Scenario: Setting blocked state using setter
    Given an ItemListing aggregate with permission to publish item listing
    When I set blocked = true using the setter
    Then the listing's state should be "Blocked"

  Scenario: Setting blocked state to false using setter
    Given an ItemListing aggregate with permission to publish item listing that is blocked
    When I set blocked = false using the setter
    Then the listing's state should be "Appeal Requested"

  Scenario: Creating new instance with images
    Given a new ItemListing aggregate factory method with images
    When I access the images
    Then images array should contain all provided images

  Scenario: Creating new instance without images
    Given a new ItemListing aggregate factory method without images
    When I access the images
    Then images array should be empty

  Scenario: Getting reports count when not set
    Given an ItemListing aggregate without reports
    When I access reports property
    Then it should return 0

  Scenario: Getting reports count when set
    Given an ItemListing aggregate with 5 reports
    When I access reports property
    Then it should return 5

  Scenario: Getting sharingHistory when empty
    Given an ItemListing aggregate without sharing history
    When I access sharingHistory property
    Then it should return an empty array

  Scenario: Getting sharingHistory when populated
    Given an ItemListing aggregate with sharing history
    When I access sharingHistory property
    Then it should return the sharing history array

  Scenario: Accessing createdAt timestamp
    Given an ItemListing aggregate with a specific createdAt timestamp
    When I access createdAt property
    Then it should return the correct timestamp

  Scenario: Accessing updatedAt timestamp
    Given an ItemListing aggregate with a specific updatedAt timestamp
    When I access updatedAt property
    Then it should return the correct timestamp

  Scenario: Accessing schemaVersion
    Given an ItemListing aggregate with schemaVersion "2.0.0"
    When I access schemaVersion property
    Then it should return "2.0.0"

  Scenario: Checking isActive when state is Active
    Given an ItemListing aggregate in Active state
    When I access isActive property
    Then it should return true

  Scenario: Checking isActive when state is Paused
    Given an ItemListing aggregate in Paused state
    When I access isActive property
    Then it should return false

  Scenario: Checking isActive when state is Blocked
    Given an ItemListing aggregate in Blocked state
    When I access isActive property
    Then it should return false

  Scenario: Getting polymorphic sharer as PersonalUser
    Given an ItemListing aggregate with PersonalUser sharer
    When I access the sharer property
    Then it should instantiate as PersonalUser

  Scenario: Getting title returns string
    Given an ItemListing aggregate with title "Test Item"
    When I access the title property
    Then it should return "Test Item"

  Scenario: Setting title when isNew is true
    Given a new ItemListing instance created via getNewInstance
    When I set the title to "New Title"
    Then the title should be updated without permission check

  Scenario: Setting state directly
    Given an ItemListing aggregate
    When I set state directly to "Drafted"
    Then the state should be "Drafted"
  Scenario: Getting expiresAt from item listing
    Given an ItemListing aggregate with expiresAt set
    When I access the expiresAt property
    Then it should return the expiration date

  Scenario: Getting expiresAt when undefined
    Given an ItemListing aggregate without expiresAt set
    When I access the expiresAt property
    Then it should return undefined

  Scenario: Setting expiresAt with permission
    Given an ItemListing aggregate with permission to update item listing
    When I set the expiresAt to a specific date
    Then the expiresAt should be updated

  Scenario: Setting expiresAt without permission
    Given an ItemListing aggregate without permission to update item listing
    When I try to set the expiresAt
    Then a PermissionError should be thrown

  Scenario: Setting expiresAt to undefined with permission
    Given an ItemListing aggregate with permission to update item listing and expiresAt set
    When I set the expiresAt to undefined
    Then the expiresAt should be cleared
