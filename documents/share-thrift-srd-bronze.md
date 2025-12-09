Sharethrift {st} – SRD

INTEALTH – CONNECTED APPS TEAM

Version 1.0

# Table of Contents

[Table of Contents 1](#_Toc380898808)

[Terms, Definitions and Concepts 2](#_Toc319639271)

[Abbreviations 3](#_Toc95579346)

[Existing Terminology 3](#_Toc1455235242)

[User 3](#_Toc510512934)

[Account 3](#_Toc1458172272)

[Profile 3](#_Toc979872535)

[Report 3](#_Toc1344460252)

[Non-Verified Personal Account 3](#_Toc568472142)

[Verified Personal Account 3](#_Toc995241827)

[Verified Personal Plus Account 3](#_Toc1190917279)

[Business Account 3](#_Toc889038749)

[Business Plus Account 3](#_Toc212024415)

[Enterprise Account 3](#_Toc202232361)

[Admin Account 3](#_Toc820688466)

[Listing Processing 3](#_Toc681223772)

[Active 4](#_Toc345003237)

[Inactive 4](#_Toc1413354068)

[Review 4](#_Toc620126294)

[Appeal 4](#_Toc2124816059)

[Publish 4](#_Toc124741438)

[Delete 4](#_Toc979543696)

[Cancel 4](#_Toc1639692774)

[Pause 4](#_Toc402666273)

[Unpause 4](#_Toc830980384)

[Reinstate 4](#_Toc1223402985)

[Block 4](#_Toc185566249)

[Unblock 4](#_Toc1173075490)

[Bookmark 4](#_Toc1258077911)

[Sharer 4](#_Toc1950126401)

[Listing - Draft 4](#_Toc1814363465)

[Listing - Blocked 4](#_Toc1762346429)

[Listing - Active 5](#_Toc40541785)

[Listing - Paused 5](#_Toc1471342789)

[Listing - Cancelled 5](#_Toc58929774)

[Listing - Expired 5](#_Toc750325861)

[Bookmarked Listing 5](#_Toc211119727)

[Item 5](#_Toc1329767154)

[Service 5](#_Toc87066313)

[Reservation Lifecycle 5](#_Toc608932356)

[Reserve 5](#_Toc81475816)

[Reservation Request 5](#_Toc1832204576)

[Reserver 5](#_Toc1695893632)

[Sharer 5](#_Toc1843440561)

[Reservation Request – Requested 5](#_Toc591838581)

[Reservation Request – Accepted 5](#_Toc1067453062)

[Reservation Request – Rejected 6](#_Toc139214753)

[Reservation Request - Reservation Period 6](#_Toc1859558579)

[Reservation Request – Closed 6](#_Toc438665792)

[Cancel 6](#_Toc1220398964)

[Admin Operations 6](#_Toc1129224905)

[Admin 6](#_Toc1015841286)

[Block – Blocking User 6](#_Toc424000944)

[Block – Blocking Listing 6](#_Toc700452545)

[Remove Listing 6](#_Toc982899748)

[User Journeys 6](#_Toc1726760645)

[User 7](#_Toc1301286991)

[Onboarding and Log In/Log Out 7](#_Toc1736125926)

[Login 7](#_Toc631777857)

[Select Account Type 8](#_Toc1536411042)

[Account Setup 11](#_Toc1144109931)

[Profile Setup 12](#_Toc555117201)

[Billing 14](#_Toc1165628970)

[Terms 16](#_Toc463979598)

[Profile Management 18](#_Toc726516215)

[View Profile - Other 19](#_Toc1310447039)

[View Profile - Own 20](#_Toc1303142888)

[Settings 22](#_Toc1909500682)

[View Account Settings 23](#_Toc578383129)

[Edit Account Settings 25](#_Toc310035458)

[Listing Process 27](#_Toc588671423)

[Listing 28](#_Toc207199946)

[Browse Listings 28](#_Toc728869412)

[Search and Filter Listings 29](#_Toc379449288)

[Create Listing 31](#_Toc1719470591)

[View Listing 35](#_Toc718461396)

[Delete Listing 37](#_Toc1981614493)

[Publish Listing 39](#_Toc45648908)

[Edit Listing 40](#_Toc879127447)

[Reinstate Listing 41](#_Toc264095516)

[Appeal Block 43](#_Toc1552864869)

[Messaging 45](#_Toc536975666)

[View Messages 46](#_Toc971418436)

[Reservation 46](#_Toc1306748503)

[Reservation Request 47](#_Toc1957990692)

[Make reservation request 47](#_Toc688592953)

[Requested 48](#_Toc1634442397)

[Reservation Request Accepted/Rejected 49](#_Toc809107139)

[Reservation Request Rejected 50](#_Toc1154728436)

[Cancel Reservation Request 51](#_Toc1396137058)

[Close Reservation Request 52](#_Toc159396222)

[Admin 55](#_Toc84377413)

[Dashboard 56](#_Toc1712891774)

[Listings 56](#_Toc790705737)

[Listings - Unblock Listing 57](#_Toc748931661)

[Listings - Remove Listing 59](#_Toc973905679)

[Users 60](#_Toc1556130)

[Users - Block User 62](#_Toc1574956080)

[User - Unblock User 64](#_Toc338453168)

[Admin View 66](#_Toc1810311540)

[Listing - View Listing 67](#_Toc164397133)

[Listing - Block Listing 67](#_Toc1339057637)

[Listing - View Listing (Blocked) 68](#_Toc1969817110)

[Listing – Unblock Listing 69](#_Toc357922576)

[User Profile - View 70](#_Toc2011398382)

[User Profile - Block User 72](#_Toc123642948)

[User Profile - View (Blocked) 73](#_Toc1364198795)

[User Profile - Unblock User 75](#_Toc405750222)

[Assumptions 76](#_Toc1060233087)

[Data Management 77](#_Toc1118054861)

[Data Retention Strategy 77](#_Toc591914986)

[Cross-System Communication 78](#_Toc1863895748)

[Overview 78](#_Toc733173446)

[Terminology: 78](#_Toc1172046014)

[External Data 78](#_Toc710325057)

[Data Coordination 78](#_Toc312111558)

[Summary of Events 78](#_Toc15401848)

[Event Specifications 78](#_Toc2025134838)

[Inbound Business Events 78](#_Toc1159389025)

[Name: 79](#_Toc874295827)

[Triggers: 79](#_Toc1940324497)

[Assumptions: 79](#_Toc1276840189)

[Queue Storage Attributes: 79](#_Toc138355169)

[Payload: 79](#_Toc2117155954)

[Subscribers: 79](#_Toc1947953501)

[Mapping / Analysis: 79](#_Toc547566059)

[<<Complex System Process>> 79](#_Toc949693666)

[Cross Team Worksheets 79](#_Toc186700888)

[Source Code Repository: 79](#_Toc1441777725)

[Application Home Page URLs 79](#_Toc1124869451)

[<<Portal Name>> 80](#_Toc1196328285)

[Other URLs 80](#_Toc1142423919)

[Data Access 80](#_Toc1601058139)

[Azure Queue Storage Account 80](#_Toc399939984)

[Azure Blob Storage Account 81](#_Toc696866061)

[Login Payload - TODO 81](#_Toc1082918977)

[Decision Log 82](#_Toc732120454)

[Changelog 83](#_Toc666109008)

# Terms, Definitions and Concepts

Note: *All definitions are scoped to the context of ShareThrift* – Other areas of Intealth’s business may use the same words to convey different meanings. When speaking about ShareThrift, these definitions hold true.

## Abbreviations

**Developer Abbreviations**

ST Stands for ShareThrift

## Existing Terminology

## User

### Account

A unique user identity used to access ShareThrift. An account includes login credentials (email, username, and password) and is associated with an account type (Personal, Business, or Enterprise). A single user can have multiple accounts under the same login.

### Profile

The set of details specific to a user's identity within a particular account. Profile information varies by account type and may include a name, business name, region, team members, and profile photo.

#### Report

Reporting is the act of notifying admin about a user account that may be violating rules or policies, so that it can be reviewed and appropriate action can be taken.

#### Non-Verified Personal Account

A non-verified personal account is an account that has not been confirmed to belong to a real person.

#### Verified Personal Account

A verified personal account is an account that has been verified to belong to a real person.

#### Verified Personal Plus Account

A verified personal plus account is an account that requires a monthly fee for additional features in addition to being verified to belong to a real person.

## Listing Processing

#### Active

Visible to users via browsing or searching and accepts reservation requests.

#### Inactive

Not Visible to users via browsing or searching, doesn't accept reservation requests.

#### Review

The process in which a blocked listing with an associated appeal request is evaluated by an admin to determine whether it meets the necessary criteria to be unblocked. This is done by an admin.

#### Appeal

The process a sharer can enact to request a review from an admin on a listing that has been blocked. This is done by the sharer.

#### Publish

Make a listing that is a draft or being created become active. This is done by the sharer.

#### Delete

Make a listing not currently reserved be deleted from the application, meaning its data is no longer within the system. This is done by the sharer.

#### Cancel

Make a listing that is active become cancelled (inactive) indefinitely (Listing expires after 6 months). This is done by the sharer.

#### Pause

Make a listing that is active become paused (inactive) for a timeframe. This is done by the sharer.

#### Unpause

Make a paused listing active again. This is done by the sharer.

#### Reinstate

Make a listing that has been cancelled active again. This is done by the sharer.

#### Block

To make an active listing inactive and require admin to be made active. This is done by an admin.

#### Unblock

To make a blocked listing active. This is done by an admin.

#### Bookmark

Save an active listing for later viewing. This is done by the sharer or the reserver.

#### Sharer

The person who created and owns the listing

#### Listing - Draft

A draft listing is a listing that has been created but may not contain all required information and has not yet requested to be published. This is one of listing states.

#### Listing - Blocked

A listing that has been made inactive and deemed not suitable to be active; user needs to request a manual admin review. This is one of listing states.

#### Listing - Active

An active listing is a listing that has been published and is available to be seen and requested. A listing will be active for as long as specified. This is one of listing states.

#### Listing - Paused

A paused listing is a listing that was previously published but has been set to be temporarily inactive. This is one of listing states.

#### Listing - Cancelled

A cancelled listing is a listing that was once active and was cancelled by the listing and made to be inactive. This is one of listing states.

#### Listing - Expired

An active listing that has hit the maximum time frame allocated by the sharer and become expired for a time frame of 6 months and is then deleted from the system.

#### Bookmarked Listing

A listing that a user has saved to go back and view later

#### Item

An *item* is a tangible listing that can be shared, reserved, or shared for a specific period. It is a physical thing, such as a book, tool, or device, that can be returned after use.

#### Service

A *service* is an intangible listing provided by the sharer. It involves performing a task, action, or duty for someone else.

## Reservation Lifecycle

#### Reserve

To temporarily be in possession of an item listed by another user with the understanding that it will be returned at the end of the sharing period.

#### Reservation Request

A request to reserve an item that another user has listed

#### Reserver

A reserver is a user that searches for listings and sends reservation requests to other users

#### Sharer

A sharer is a user who makes an item available to others for temporary use through the ShareThrift platform

#### Reservation Request – Requested

A request that is requested is a request that has been made by a user that has not been accepted or rejected.

#### Reservation Request – Accepted

An accepted request is a reservation request made by a user that been accepted by a sharer, referring to the period of time after acceptance but before the start of the sharing period.

#### Reservation Request – Rejected

A rejected request is a request made by a potential reserver that has been rejected by the sharer.

#### Reservation Request - Reservation Period

A reservation period is the period that begins at the start time that the item was reserved for and ends once both parties confirm that it is over. Pickup and return arrangements may occur inside or outside this period and are negotiated independently by the reserver and sharer.

#### Reservation Request – Closed

A closed request is a reservation request where the reservation period has ended.

#### Cancel

Stop the current reservation request, which is in the requested state still.

## Admin Operations

#### Admin

A staff member with the authority to review users, manage user accounts (e.g., block), and oversee listing content (e.g., block, approve, remove).

#### Block – Blocking User

Prevents the user from taking any action (e.g. reserving, creating a listing).

#### Block – Blocking Listing

Prevents a listing from having new reservation requests and being publicly viewed temporarily.

#### Remove Listing

Permanently remove a listing from being reserved and visible.

# User Journeys

## User

### Onboarding and Log In/Log Out

#### Login

|  |  |  |
| --- | --- | --- |
| User | Onboarding and Log In/Log Out | **Login** | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/jpeg;base64...) | ![](data:image/png;base64...) | Users can securely access and close out of their accounts once they have been created |

#### Select Account Type

|  |  |  |
| --- | --- | --- |
| User | Onboarding and Log In/Log Out | **Select Account Type and Plan** | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/jpeg;base64...) | ![](data:image/jpeg;base64...) | Upon signing up, users must first view and select a plan available under their desired account type. For example: A Personal Account Type with a Verified Personal Plan    **For account plans that require verification:**  Continuing account setup will be disabled until account verification has been started/submitted    Users that choose a paid account plan will be met with a billing screen after Account and Profile Setup.    User must contact ShareThrift to discuss creating an enterprise account with custom restrictions and custom identity integrations.  ![](data:image/png;base64...) |

#### Account Setup

|  |  |  |
| --- | --- | --- |
| User | Onboarding and Log In/Log Out | **Account Setup** | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/jpeg;base64...) | ![](data:image/jpeg;base64...) | user completes their account setup with email, username, and password.    The same email/user can have accounts of different types, ex: personal and business. |

#### Profile Setup

|  |  |  |
| --- | --- | --- |
| User | Onboarding and Log In/Log Out | **Profile Setup** | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/jpeg;base64...) | ![](data:image/png;base64...) | Once the user has completed their account setup (email, username, and password), they are prompted to provide the minimum profile information needed based on their selected account type.    **Personal Account Minimum Profile Information:**   * First/Last Name (optional) * Profile Photo (optional) * Region/Address (required)     User must contact ShareThrift to discuss creating an enterprise account with custom restrictions and custom identity integrations.    The same email/user can have accounts of different types, ex: personal and business. |

#### Billing

|  |  |  |
| --- | --- | --- |
| User | Onboarding and Log In/Log Out |**Billing** | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/jpeg;base64...) | ![](data:image/jpeg;base64...) | If the account plan selected is a paid plan the user must provide their billing details. They will not be charged until their verification is complete and their account becomes live |

#### Terms

|  |  |  |
| --- | --- | --- |
| User | Onboarding and Log In/Log Out | **Terms** | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/jpeg;base64...) | ![](data:image/png;base64...) | User must approve of ShareThrift Terms and Conditions waiving the platform’s liability regarding broken or non returned items.  Any contracts or payment for sharing are handled off the platform. If items are broken or not returned sharers should pursue legal action independently of ShareThrift  If these terms are updated, users will be prompted to reaffirm them the next time they sign in |

### Profile Management

#### View Profile - Other

|  |  |  |
| --- | --- | --- |
| User|User Profile|**View Profile - Other** | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/jpeg;base64...) | ![](data:image/jpeg;base64...) | Allows a logged-in user to view profile information associated with the currently active account type (e.g., personal, business).  **Public Viewers can see:**   * Username * First Name, Last Initial * User Type Label (e.g., Personal, Business) * “Verified User” Badge (Phase 2) * Average Rating (In Stars) * Profile Photo * Bio (About Me/About Us) * Location (City, State) * Account Creation Month/Year * Posted Listings |

#### View Profile - Own

|  |  |  |
| --- | --- | --- |
| User|User Profile|**View Profile - Own** | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/jpeg;base64...) | ![](data:image/png;base64...) | **Profile Owner can see:**   * All Public Information * Friends or Team Members * Account Settings Button |

### Settings

#### View Account Settings

|  |  |  |
| --- | --- | --- |
| User|User Profile|**View Account Settings** | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/jpeg;base64...) | ![](data:image/png;base64...) | Only accessible to account owner.  Users can view information associated with their account or use the edit buttons on each section.  Can edit their own profile details to keep their account, contact information, and details up to date.  Cannot change username or email. |

#### Edit Account Settings

|  |  |  |
| --- | --- | --- |
| User|User Profile|**Edit Account Settings** | | |
| **Mobile** | **Desktop** | **Details** |
| **Personal Edit Profile Information:**  ![](data:image/jpeg;base64...) | **Personal Edit Profile Information:**  ![](data:image/jpeg;base64...) | Only accessible to account owner.  Users can edit their own account details to keep their information up to date. Each section is edited independently  Users can Change:   * Profile Information * Location Information * Plan Information * Billing Information * Password * Communication Preferences   Cannot change username or email. |

## Listing Process

### Listing

#### Browse Listings

|  |  |  |
| --- | --- | --- |
| Listing Process| Listing |Browse Listings | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/jpeg;base64...) | ![](data:image/png;base64...) | Users are able to browse listings without being logged into the platform |

#### Search and Filter Listings

|  |  |  |
| --- | --- | --- |
| Listing Process| Listing |Search and Filter Listings | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/jpeg;base64...) | ![](data:image/png;base64...) | Can filter by geographical location, availability, and category  When a reserver filters listings by a future date, items that are currently lent out should still appear in search if they are available during the filtered date range.  If a reserver is blocked by a sharer, they will not be be to view or discover their listing. |

#### Create Listing

|  |  |  |
| --- | --- | --- |
| Listing Process| Listing |Create Listing | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/png;base64...)  ![](data:image/jpeg;base64...)  ![](data:image/jpeg;base64...) | ![](data:image/png;base64...)  ![](data:image/jpeg;base64...)  ![](data:image/png;base64...) | Sharer can create a listing with all required fields and can choose to save it as a draft or publish it.  A sharer can either create a listing of type item  Required Information   * Listing Title (Required) * Listing Description (Required) * Listing Category (Required) * Listing Photos (Optional) Maximum 5 * Listing Location (Required) * Listing Availability   *Restrict to only verified identities (phase 2)*  *Restrict to only specific groups or users (phase 2)*  *Restrict to only specific region (phase 2)*  *Dates available for Lending*  *Calendar view, can mark of dates when available*  ![](data:image/png;base64...)  ![](data:image/png;base64...) |

#### View Listing

|  |  |  |
| --- | --- | --- |
| Listing Process| Listing |View Listing | | |
| **Mobile** | **Desktop** | **Details** |
| **Reserver:**  ![](data:image/jpeg;base64...)  **Sharer:**  ![](data:image/jpeg;base64...) | **Reserver:**  ![](data:image/png;base64...)  **Sharer:**  ![](data:image/jpeg;base64...) | A logged in or logged out user can view a listing, and see information including images, reservation period, category, location, and the name of the item.  Once the user tries to reserve an item, if logged out they will be prompted to create an account or sign in. |

#### Delete Listing

|  |  |  |
| --- | --- | --- |
| Listing Process| Listing |Delete Listing | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/png;base64...) | ![](data:image/png;base64...) | Within my listings, a user can delete a listing in any state.  Deleting a listing will remove it permanently.  ![](data:image/png;base64...) |

#### Publish Listing

|  |  |  |
| --- | --- | --- |
| Listing Process| Listing |Publish Listing | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/png;base64...) | ![](data:image/png;base64...) | Within my listings, a user can publish a listing that is in the draft state, if they decide to save it for later instead of publishing it.  Will be active for time frame specified in creation  Limit is 6 months |

#### Edit Listing

|  |  |  |
| --- | --- | --- |
| Listing Process| Listing |Edit Listing | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/jpeg;base64...) | ![](data:image/png;base64...) | Users can edit their listing details, as well as delete, cancel or pause listings.  A user can pause their own listing that is currently active. The user can pause it up to the duration of the listing.  If it is not unpaused before the listing duration ends it will behave as a normal expiration.    Within my listings, a user can cancel a listing that is currently active. If a listing is cancelled for more than 6 months, it will be permanently deleted. |

#### Reinstate Listing

|  |  |  |
| --- | --- | --- |
| Listing Process| Listing |Reinstate Listing | | |
| **Mobile** | **Desktop** | **Details** |
| **View:** ![](data:image/jpeg;base64...)  **Edit:**![](data:image/jpeg;base64...) | **View:**  ![](data:image/jpeg;base64...)  **Edit:**![](data:image/jpeg;base64...) | Listing can only be reinstated if cancelled or expired, and before 6 months have passed, making it active again.  ![](data:image/png;base64...) |

#### Appeal Block

|  |  |  |
| --- | --- | --- |
| Listing Process| Listing |Appeal Block | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/jpeg;base64...) | ![](data:image/png;base64...) | A listing that has been blocked by an admin, and changes need to be made for it to become unblocked (active again).  Pressing View Details will open up a modal with the block information. From here, you can go to edit the listing appropriately as well as appeal.  Listing has to be in the blocked state.  ![](data:image/png;base64...) |

### Messaging

#### View Messages

|  |  |  |
| --- | --- | --- |
| Listing Process| Listing |View and Send Messages | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/png;base64...)  ![](data:image/png;base64...) | ![](data:image/png;base64...) | Reservers can initiate a chat on a Listing with the Sharer before a Reservation Request is created. Sharer can respond the chat at this time. Sharer can initiate chat request once a Reservation Request is created, and Reservers can respond.  Messages expire after 6 months (connected to the listing expiration) |

## Reservation

### Reservation Request

#### Make reservation request

|  |  |  |
| --- | --- | --- |
| Reservation| Reservation Request | Create Reservation Request | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/jpeg;base64...) | ![](data:image/png;base64...) | Calendar-based booking with date selection  Supports flexible date ranges (e.g., any 1 day between Mon-Fri).  Prevents double-booking by blocking out dates with an already accepted request |

#### Requested

|  |  |  |
| --- | --- | --- |
| Reservation| Reservation Request | Requested | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/png;base64...) | ![](data:image/png;base64...) | A reservation request can be cancelled at any time before the reservation request is accepted or rejected |

#### Reservation Request Accepted/Rejected

|  |  |  |
| --- | --- | --- |
| Reservation| Reservation Request | Reservation Request Accepted | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/png;base64...) | ![](data:image/png;base64...) | Once a reservation request is accepted, users are not able to cancel the request. They may instead close the request if they choose not to go through with the reservation |

#### Reservation Request Rejected

|  |  |  |
| --- | --- | --- |
| Reservation| Reservation Request | Reservation Request Rejected | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/png;base64...) | ![A screenshot of a computer  AI-generated content may be incorrect.](data:image/png;base64...) | Once a reservation request is accepted, users are not able to cancel the request. They may instead close the request if they choose not to go through with the reservation |

#### Cancel Reservation Request

|  |  |  |
| --- | --- | --- |
| Reservation| Reservation Request | Cancel Reservation Request | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/png;base64...) | ![](data:image/png;base64...) | A reservation can be cancelled at any time before the decision for the request has been made. If a request has been accepted, and a user decides not to go through with the reservation, they may mutually close the request. |

#### Close Reservation Request

|  |  |  |
| --- | --- | --- |
| Reservation| Reservation Request | Close Reservation Request | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/jpeg;base64...)  ![](data:image/png;base64...) | ![](data:image/png;base64...)  ![](data:image/png;base64...) | **Functionality:**   * Users can initiate a **close request** from the **listing management page** or the **reservation details page**. * Once one party closes the request, the status will update to **"Closing - Awaiting Response"** and the other party will be prompted to confirm. * The reservation will only be considered **fully closed** once **both users have confirmed** the closure.   **Use Cases:**   * Reservation completed successfully, both users want to formally close it. * One user cancels or backs out, initiates a close, the other confirms. * An agreed-upon early termination of the reservation.   **Status Behavior:**   1. While awaiting the second user’s confirmation, the request will be labeled **"Closing - Awaiting Response"** 2. Once confirmed, the status will update to **"Closed"**. |

## Admin

### Dashboard

#### Listings

|  |  |  |
| --- | --- | --- |
| Admin | Dashboard | Listings | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/jpeg;base64...) | ![](data:image/png;base64...) | Listings is the default page for the Admin Dashboard.  It contains a table of currently blocked listings, which includes:   * Listing Name and Image * Published At * Reservation Period * Status (Blocked only) * Actions   1. View Listing   2. Unblock Listing   3. Remove Listing.   Admins can use the above actions to manage listings. |

#### Listings - Unblock Listing

|  |  |  |
| --- | --- | --- |
| Admin | Dashboard | Listings - Unblock Listing | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/jpeg;base64...) | ![](data:image/jpeg;base64...) | Admins can unblock a listing directly from the Admin Dashboard.  This requires a confirmation. The modal displays how many days are left on the current block. |

#### Listings - Remove Listing

|  |  |  |
| --- | --- | --- |
| Admin | Dashboard | Listings - Remove Listing | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/jpeg;base64...) | ![](data:image/png;base64...) | Admins can remove (delete) a listing directly from the dashboard. This action is irreversible and requires a confirmation. |

#### Users

|  |  |  |
| --- | --- | --- |
| Admin | Dashboard | Users | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/jpeg;base64...) | ![](data:image/png;base64...) | The User Dashboard contains a table of currently blocked users, which includes:   1. Username 2. Last Name 3. First Name 4. Account Creation 5. Status 6. Actions    1. View Profile    2. View Report    3. Block or Unblock User   Admins can use the above actions to manage reports and blocked users. |

#### Users - Block User

|  |  |  |
| --- | --- | --- |
| Admin | Dashboard | Users - Block User | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/jpeg;base64...) | ![](data:image/jpeg;base64...) | Admins can block a user directly from the dashboard.  To block a user, the admin must fill out:   1. Reason (dropdown) 2. Description for reason of block – this message is shown to the user |

#### User - Unblock User

|  |  |  |
| --- | --- | --- |
| Admin | Dashboard | Users - Unblock User | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/jpeg;base64...) | ![](data:image/jpeg;base64...) | Admins can unblock a user directly from the dashboard.  This requires a confirmation. The modal displays how many days are left on the current block. |

### Admin View

#### Listing - View Listing

|  |  |  |
| --- | --- | --- |
| Admin | Admin View | Listing - View Listing | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/jpeg;base64...) | ![](data:image/png;base64...) | Admins can view listings like regular users, but with the additional option to block the listing.  Pressing block opens up the corresponding modal. |

#### Listing - Block Listing

|  |  |  |
| --- | --- | --- |
| Admin | Admin View | Listing - Block Listing | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/jpeg;base64...) | ![](data:image/png;base64...) | Admins can block a listing by opening pressing the “Block Listing” button on a listing and fill out the modal with   1. Reason (dropdown) 2. Description for the blocking (shown to the user who uploaded the listing) |

#### Listing - View Listing (Blocked)

|  |  |  |
| --- | --- | --- |
| Admin | Admin View | Listing - View Listing (Blocked) | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/jpeg;base64...) | ![](data:image/png;base64...) | Admins can view blocked listings.  They have the option to unblock the listing. Clicking unblock opens up the corresponding modal.  The contents of the listing are grayed out to indicate the blocked status. |

#### Listing – Unblock Listing

|  |  |  |
| --- | --- | --- |
| Admin | Admin View | Listing - Unblock Listing | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/jpeg;base64...) | ![](data:image/png;base64...) | Admins can view blocked listings.  They have the option to unblock the listing. Clicking unblock opens up the corresponding modal.  This requires a confirmation. The modal displays how many days are left on the current block. |

#### User Profile - View

|  |  |  |
| --- | --- | --- |
| Admin | Admin View | User Profile - View | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/jpeg;base64...) | ![](data:image/png;base64...) | Admins can view other profiles like regular users, but with the additional option to block the user.  Pressing block opens up the corresponding modal.  **NOTE:** Admins do not have an ‘admin view’ for their own profile (i.e. they cannot block themselves, nor can they see any pending reports when viewing their profile). |

#### User Profile - Block User

|  |  |  |
| --- | --- | --- |
| Admin | Admin View | User Profile - Block User | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/jpeg;base64...) | ![](data:image/jpeg;base64...) | Pressing “Block User” on a user’s profile brings up the “Block User” modal where admins can input   1. Reason for blocking (dropdown) 2. Description of the blocking (shown to the user)   This requires a confirmation. The modal displays how many days are left on the current block. |

#### User Profile - View (Blocked)

|  |  |  |
| --- | --- | --- |
| Admin | Admin View | User Profile - View (Blocked) | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/jpeg;base64...) | ![](data:image/png;base64...) | Admins can view blocked user profiles.  They have the option to unblock the users. Clicking unblock opens up the corresponding modal. |

#### User Profile - Unblock User

|  |  |  |
| --- | --- | --- |
| Admin | Admin View | User Profile - Unblock User | | |
| **Mobile** | **Desktop** | **Details** |
| ![](data:image/jpeg;base64...) | ![](data:image/png;base64...) | Clicking “Unblock User” on a blocked user profile brings up the “Unblock User” modal where admins can decide whether to unblock that user. |

# Assumptions

**<< PORTAL NAME>>**

1. <<EVERY ASSUMPTION MUST BE DOCUMENTED>>

# Data Management

## Data Retention Strategy

This section outlines the data retention strategy for both operational and image storage systems, including deletion policies. The strategy ensures efficient storage management, compliance, and scalability while supporting long-term data access and integrity.

1. **Operational Database: Azure Cosmos DB (MongoDB API)**

**Short-term Retention**

* Listings and Reservation Requests: All listings and reservation requests regardless of state will be stored in Azure Cosmos DB using the MongoDB API, offering high availability and low-latency access for operational purposes.
* **Auto-Archival Policy**: Once a listing or request is cancelled or expired, it will be considered “archived” for 6 months. A reservation request that is completed is “archived” for 6 months as well.

**Deletion Policy**

* **Expired and Cancelled Listings**: Any listings that remain in a cancelled or expired state will be automatically deleted after 6 months. This ensures that inactive listings are removed from the operational database without consuming unnecessary resources.
* Completed Reservation Requests: Any reservation requests in the completed state will be deleted after 6 months have passed.

1. **Document Storage: Azure Blob Storage**

Azure Blob Storage serves as the storage solution for images, such as PNGs, and JPEGs. Images stored in Blob Storage will be remain for the lifetime of the listing, or as long as it is kept for the user profile.

**Document Overwriting Policies**

* **Images:** When a user uploads a new profile picture, the previous will be overwritten and removed from blob storage. When uploading a listing photo to the same slot as one that already exists, it will also be overwritten and removed from blob storage.

**Image Retention**

* Only profile pictures will be kept indefinitely; other images tied to listings will be removed at the end of that lifecycle.

**Access to Images**

* Images stored in Azure Blob Storage will be accessible via API or manual queries for any operational or compliance needs.

# Cross-System Communication

## Overview

### Terminology:

Communication Direction:

Communication Type:

### External Data

<<PROVIDE DIAGRAM OF ALL SYSTEM TO SYSTEM COMMUNICATIONS, NUMBER EACH COMMUNICATION>>

### Data Coordination

<<PROVIDE DIAGRAM OF ALL SYSTEM TO SYSTEM COMMUNICATIONS, NUMBER EACH COMMUNICATION>>

<< CALL OUT AREAS THAT ARE OTHER TEAMS RESPONSIBILITY AND NOTE IMPLEMENTATION IS A SUGGESTION>>

### Summary of Events

Cross-system events are either emitted from the ShareThrift System to be consumed by other systems or produced by other systems to be consumed by the ShareThrift System.

The ShareThrift System will leverage Azure Storage Queues to handle events that cross system boundaries; the following table summarizes the events that enable cross-system communications.

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
|  | **Direction** | **Type** | **Source (for inbound)/Destination (for outbound)** | **Name** | **Handler (for inbound)/Emitter (for outbound)** |
| 1 |  |  |  |  |  |

<<ALIGN NUMBERS IN ABOVE TABLE TO NUMBERS IN DIAGRAMS, NAME EACH ACCURATELY AND DEFINE HANDLERS>>

## Event Specifications

### Inbound Business Events

##### Name:

##### Triggers:

##### Assumptions:

##### Queue Storage Attributes:

##### Payload:

{

}

##### Subscribers:

* Storage Queue Details:
* Handlers:

##### Mapping / Analysis:

|  |  |
| --- | --- |
|  |  |
|  |  |

## <<Complex System Process>>

<<PROVIDE DIAGRAMS TO EXPLAIN COMPLEX SYSTEM PROCESSING>>

# Cross Team Worksheets

## Source Code Repository:

*Provided by the Connected Apps Team*

<https://github.com/TODO>

<<PROVIDE REPO DETAILS>>

## Application Home Page URLs

*Provided by the Connected Apps Team*

### <<Portal Name>>

<<PROVIDE URLS FOR EACH PORTAL IN EACH ENVIRONENT>>

|  |  |
| --- | --- |
| **Env** | **Application Home Page** |
| **Dev** |  |
| **QA** |  |
| **UAT** |  |
| **TRN** |  |
| **Prod** |  |

## Other URLs

### Data Access

<< PROVIDE DATA ACCESS URL>>

|  |  |
| --- | --- |
| **Env** | **URL** |
| **Dev** |  |
| **QA** |  |
| **UAT** |  |
| **TRN** |  |
| **Prod** |  |

Storybook

EXample PORTAL

*Provided by the Connected Apps Team*

Latest Build URL

Invite Acceptance URL

## Azure Queue Storage Account

*Provided by the Connected Apps Team*

|  |  |  |
| --- | --- | --- |
| **Env** | **Storage Account Name** | **Storage Account Key (in Azure Key Vault)** |
| **Dev** |  |  |
| **QA** |  |  |
| **UAT** |  |  |
| **TRN** |  |  |
| **Prod** |  |  |

|  |  |  |
| --- | --- | --- |
| **Env** | **Storage Account Name** | **Storage Account Connection String (in Azure Key Vault)** |
| **DEV** |  |  |
| **QA** |  |  |
| **UAT** |  |  |
| **TRN** |  |  |
| **PROD** |  |  |

## Azure Blob Storage Account

(AAMC transfer package blob)

*Provided by the Connected Apps Team*

|  |  |  |
| --- | --- | --- |
| **Env** | **Storage Account Name** | **Key Vault Key** |
| **Dev** |  |  |
| **QA** |  |  |
| **UAT** |  |  |
| **TRN** |  |  |
| **Prod** |  |  |

### Login Payload - TODO

QA BlobStorage Account & Container: <<TBD – Salesforce Team to Provide>>

Prod BlobStorage Account & Container: <<TBD– Salesforce Team to Provide>>

Notes: 26169

Types of documents that can be uploaded:

* Photograph (JPG) ([User Story 24591](https://dev.azure.com/ECFMGTFS/BusinessTransformation/_backlogs/backlog/Data%20and%20SF%20Integration%20Team/Work%20Package/?workitem=25491))
* MSPE (PDF) ([User Story 25492](https://dev.azure.com/ECFMGTFS/BusinessTransformation/_backlogs/backlog/Data%20and%20SF%20Integration%20Team/Work%20Package/?workitem=25492))
* Transcript (PDF) ([User Story 25600](https://dev.azure.com/ECFMGTFS/BusinessTransformation/_backlogs/backlog/Data%20and%20SF%20Integration%20Team/Work%20Package/?workitem=25600))
* ABSITE Transcript (PDF) ([User Story 25601](https://dev.azure.com/ECFMGTFS/BusinessTransformation/_backlogs/backlog/Data%20and%20SF%20Integration%20Team/Work%20Package/?workitem=25601))

<<DETAILS BELOW TO BE CONFIRMED BY EXTERNAL TEAM>>

|  |  |  |
| --- | --- | --- |
| Blob Attribute | Example | Details |
| Blob name: |  |  |
| BLOB ATTRIBUTE: |  |  |
|  |  |  |
|  |  |  |

Blob Spec:

<<DETAILS BELOW TO BE CONFIRMED BY SALESFORCE TEAM>>

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **Field Name** | **Required** | **Data Type** | **Valid Values** | **Description** |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |

<<DETAILS BELOW TO BE CONFIRMED BY EXTERNAL TEAM>>

Open Questions:

# Decision Log

|  |  |  |  |
| --- | --- | --- | --- |
| **KEY DECISIONS MADE** | | | |
| **Date** | **Decision** | **Decision Maker** | **Action Added?** |
| MM/DD/YYYY | **D<<NUMBER>>)** <<DESCRIPTION>> | <<NAME>> | <<OPTIONAL ACTION NUMBER>> |

# Changelog

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Version** | **Change Description** | **Update Date** | **Updated By** | **Review Date** | **Reviewed By** |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
