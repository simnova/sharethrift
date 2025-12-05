Feature: <AggregateRoot>ItemListing

Background:
  Given a valid Passport with listing permissions
  And a valid PersonalUserEntityReference for "user1"
  And base item listing fields with title "Old Title", description "Old Description", category "Electronics", location "Delhi", sharingPeriodStart "2025-10-06", sharingPeriodEnd "2025-11-06", and valid timestamps

Scenario: Creating a new item listing instance
  When I create a new ItemListing aggregate using getNewInstance with sharer "user1" and title "New Listing"
  Then the listing's title should be "New Listing"
  And the listing's sharer should reference "user1"
  And the listing state should be "Published"

Scenario: Creating a new draft listing with missing fields
  When I create a new ItemListing aggregate using getNewInstance with isDraft true and empty title, description, category, and location
  Then the listing's title should default to "Draft Title"
  And the listing's description should default to "Draft Description"
  And the listing's category should default to "Miscellaneous"
  And the listing's location should default to "Draft Location"
  And the listing state should be "Drafted"

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
  Then the listing's state should be "Published"
  And the updatedAt timestamp should change

Scenario: Setting state to Published transitions correctly
  Given an ItemListing aggregate with permission to publish item listing
  When I set the state to "Published"
  Then the listing's state should be "Published"
  And the updatedAt timestamp should change

Scenario: Setting state to Paused transitions correctly
  Given an ItemListing aggregate with permission to publish item listing
  And the listing state is "Published"
  When I set the state to "Paused"
  Then the listing's state should be "Paused"

Scenario: Setting state to Cancelled transitions correctly
  Given an ItemListing aggregate with permission to cancel item listing
  And the listing state is "Published"
  When I set the state to "Cancelled"
  Then the listing's state should be "Cancelled"

Scenario: Setting an invalid state throws PermissionError
  Given an ItemListing aggregate with permission to update item listing
  When I try to set the state to "InvalidState"
  Then a PermissionError should be thrown with message "Invalid listing state"
