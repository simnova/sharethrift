SHARETHRIFT – BRD

INTEALTH

VERSION 1.0

## Table of Contents

[Table of Contents 1](#_Toc1686641511)

[Project Overview 2](#_Toc1074880685)

[Problem 2](#_Toc13444708)

[Goal 2](#_Toc487663420)

[Business Goals 2](#_Toc1306393725)

[Terminology 3](#_Toc848547218)

[General Terminology 4](#_Toc1243500981)

[User 4](#_Toc304042212)

[Listing Processing 5](#_Toc680606474)

[Reservation Lifecycle 7](#_Toc429851460)

[Admin Operations 7](#_Toc763134886)

[Communication 8](#_Toc1019900335)

[Scope 8](#_Toc1040801934)

[Out of Scope 9](#_Toc532938486)

[Project Stakeholders 9](#_Toc514294941)

[Functional Requirements 10](#_Toc1171612599)

[User 10](#_Toc695834941)

[Listing Processing 15](#_Toc1579675365)

[Reservation Lifecycle 19](#_Toc1764717939)

[Admin Operations 21](#_Toc1421095846)

[Communication 24](#_Toc1035073458)

[Business Model 25](#_Toc431530260)

[Revenue Strategy 25](#_Toc1165224890)

[Logistics 26](#_Toc1345796518)

[Risks 26](#_Toc818121712)

[Constraints 27](#_Toc1728490521)

[Assumptions 28](#_Toc337771470)

[Project Timeline 28](#_Toc1925905257)

[Appendices 29](#_Toc787438876)

[Changelog 30](#_Toc484218428)

[Links and Resources 30](#_Toc1460586547)

## Project Overview

ShareThrift aims to help reduce waste by encouraging the growth of the sharing economy allowing sharing of all sorts of goods such as tools, board games, and more among its members and partner organizations. ShareThrift's business model is to be self-sustaining by charging a fee for boosted listings on its platform. There are a number of different sharing models to be supported, allowing for individual to individual, as well as allowing for partners. Partners can be existing companies such as tool rental companies, or the platform may help to spur new businesses. ShareThrift is looking to develop a minimal viable product (MVP) to prove its business model.

### Problem

As peer-to-peer services like Turo, Airbnb, and Swimply gain popularity, there is a growing demand for a generalized, secure, and trusted platform that supports the sharing and reserving of a wide variety of goods and services. Current platforms are often limited in scope only handling reserving and sharing within niche categories.

### Goal

Design and develop **ShareThrift**, a web-based platform that enables individuals and organizations to share and reserve items, services, and classes with ease. Similar to Craigslist or Facebook Marketplace, but focused specifically on sharing, ShareThrift aims to provide a more structured and secure experience for temporary exchanges. This project serves as a proof of concept to explore modern web technologies and product design strategies, rather than launching a commercial product.

### Business Goals

#### User Acquisition and Growth

Target an initial user base of at least 100 active users within the first month following launch. Aim for a sustained month-over-month growth rate of 20%, driven by targeted outreach, user referrals, and platform usability.

#### Market Positioning

Establish ShareThrift as a modern, community-driven alternative to traditional classifieds and niche sharing platforms. Differentiate through a focused sharing model, streamlined user experience, and trust-building features such as verified accounts and user ratings.

#### Revenue Model

Offer core platform features free of charge by generating revenue through optional paid enhancements such as boosted listings and premium account tiers (e.g., Personal Plus, Business, Business Plus), which are processed securely through third-party payment platforms. All item rental or reserving transactions are arranged independently between users, keeping the platform financially lightweight.

## Terminology

### General Terminology

#### Request

A message that is sent to a user that prompts them to accept or decline an action, such as a request to reserve an item or a request to be a user’s friend.

#### Decline

To refuse the action proposed by a request, resulting in no changes being made as a result of that request.

#### Accept

To agree to the action proposed by a request, resulting in that action being carried out.

#### Core

A feature that is the focus of the section, a primary or essential feature of the system that is fundamental to its purpose and value

#### Supporting

A feature that supports the core one, supplemental to the core feature, and is required for the core features full functionality.

#### General

A feature that may be referenced from other features in different sections, other core and supporting features may require it.

#### Context

The concept and name of the section that encompasses core, supporting, and general features, for example Listing Processing is a context.

### User

#### Account

A unique user identity used to access ShareThrift. An account includes login credentials (email, username, and password) and is associated with an account type (Personal, Business, or Enterprise). A single user can have multiple accounts under the same login.

#### Profile

The set of details specific to a user's identity within a particular account. Profile information varies by account type and may include a name, business name, region, team members, and profile photo.

#### Friend (Phase 2)

A user with whom another user has mutually connected with, allowing easier access to communication between them. Phase 2 planned addition will allow users to limit reservers to specific groups, including friends.

#### Group (Phase 2)

A Group is a collection of users.

#### Report

Reporting is the act of notifying admin about a user account that may be violating rules or policies, so that it can be reviewed and appropriate action can be taken.

#### Non-Verified Personal Account

A non-verified personal account is an account that has not been confirmed to belong to a real person.

#### Verified Personal Account

A verified personal account is an account that has been verified to belong to a real person.

#### Verified Personal Plus Account

A verified personal plus account is an account that requires a monthly fee for additional features in addition to being verified to belong to a real person.

#### Business Account

A verified and paid account that has features catered to businesses, such as reports, increased listing limits, and multiple users.

#### Business Plus Account

A business plus account is a verified and paid account that offers additional features and increased limits of a regular business account.

#### Enterprise Account

An enterprise account is an account with features catered to enterprise level sharers such as custom identity integrations and custom restrictions.

#### Admin Account

An admin account is an account that has capabilities to moderate listings on the website, view site analytics, and perform other management functions.

### Listing Processing

#### Active

Visible to users via browsing or searching and accepts reservation requests.

#### Inactive

Not Visible to users via browsing or searching, doesn't accept reservation requests

#### Review

The process in which a blocked listing with an associated appeal request is evaluated by an admin to determine whether it meets the necessary criteria to be unblocked.


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

The person who created and owns the listing.

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

A listing that a user has saved to go back and view later.

#### Item

An *item* is a tangible listing that can be shared, reserved, or shared for a specific period. It is a physical thing, such as a book, tool, or device, that can be returned after use.

#### Service

A *service* is an intangible listing provided by the sharer. It involves performing a task, action, or duty for someone else.

#### Class

A *class* refers to a structured session or series of sessions in which individuals are taught specific knowledge or skills, a variation of listing. Multiple accounts can register within the same period for a class, unlike an item or service.

### Reservation Lifecycle

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

A reservation period is the period that begins at the start time that the item was reserved for and ends once both parties confirm that it is over. Pickup and return arrangements may occur inside or outside this period and are negotiated independently by the reserver and sharer

#### Reservation Request – Closed

A closed request is a reservation request where the reservation period has ended.

#### Cancel

Stop the current reservation request, which is in the requested state still.

### Admin Operations

#### Admin

A staff member with the authority to review users, manage user accounts (e.g., block), and oversee listing content (e.g., block, review, remove).

#### Block – Blocking User

Prevents the user from taking any action (e.g. reserving, creating a listing).

#### Block – Blocking Listing

Prevents a listing from having new reservation requests and being publicly viewed temporarily.

#### Remove Listing

Permanently remove a listing from being reserved and visible.

#### Feature Activation / Deactivation

Admins can switch specific features on or off for users or environments without changing code.

### Communication

#### Notification

An alert sent to users about updates like requests, messages, listing changes, or reviews, via email.

## Scope

This Business Requirements Document (BRD) outlines the functional and non-functional scope of the **ShareThrift MVP,** a web-based platform designed to facilitate secure item sharing between individuals and organizations. The platform will support listing, reserving, and managing temporary use of physical goods, offering account types with tiered access and business functionality.

### Out of Scope

* Escrow/payment coordination for item rentals
* Process for handling returns/disputes
* Reserver legal signing of sharing terms per item
* Recurring reservations
* No SSO integrations (Google, Apple, Facebook)
* GPS, mapping, or proximity sorting for location

## Project Stakeholders

|  |  |  |  |
| --- | --- | --- | --- |
| **Stakeholder Role** | **Responsibilities** | **Involvement Level** | **Domain Expert** |
| SME Liaisons | Provision Azure resources using MSDN credits. | Informant | Azure Cloud, IT Ops |
| Development Team | Build and maintain platform, produce MVP based on BRD/SRD. | Informant | Technical, System Design |
| Admin Staff | Review listings and manage user/business accounts. | Informant | Moderation, User Management |
| Business Stakeholders | Approve Gold, Silver, or Bronze solutions based on SRD. | Approver | Business Strategy, Financials |
| End Users | Personal, Business, and Enterprise sharers and reservers. | Informant | User Experience, Sharing Economy |

## Context Diagram

#### Purpose

Diagram representing the functional requirements' context visually, and interconnecting overlap that occurs via shared usage of a feature or referenced concepts from a feature.

#### Diagram

![](data:image/png;base64...)

## Functional Requirements

### User

#### Purpose

Users are able to create accounts, be classified as different account types, manage profile information, and manage friends (phase 2). Different account types afford users different permissions and abilities in the ShareThrift platform. Paid plans provide more sharing and reserving power.

#### Onboarding and Log In/Log Out

|  |  |  |  |
| --- | --- | --- | --- |
| **Capability** | **Description** | **Priority** | **Constraints/ Notes** |
| Create Account | Users can sign up for the platform, setting up a profile and account on the ShareThrift platform  Optional identity verification using free-tier services or low-cost alternatives, prioritizing free options | High | User supplies email/username and password to create an account. User is then prompted to supply minimum profile information  **Minimum Profile Information:**   * Public Username * First/Last Name (optional) * Profile Photo (optional) * Region/Address (required) * Email (required) * Password (required)   The same email/user can have accounts of different types, ex: personal and business.  Users can switch between multiple account types from a single login. |
| Terms and Conditions | User must check/approve of ShareThrift Terms and Conditions waiving the platform’s liability regarding broken or non returned items | High | Any contracts or payment for sharing are handled off the platform. If items are broken or not returned sharers should pursue legal action independently of ShareThrift  If these terms are updated, users will be prompted to reaffirm them the next time they sign in |
| Log In/Log Out | Users can securely access and close out of their accounts once they have been created | High |  |

#### User Types (Core)

|  |  |  |
| --- | --- | --- |
| **Category** | **Type** | **Details** |
| Personal | Non-Verified Personal | **Account Details:**   * No cost * Maximum 3 reserved items * 3 listing bookmarks * 15 simple items to share * Restricted to 5 friends |
| Verified Personal | **Account Details:**   * No cost * Maximum 10 reserved items * 10 listing bookmarks * 30 items to share (including services) * Restricted to 10 friends |
| Verified Personal Plus | **Account Details:**   * Monthly fee * Max 30 reserved items * 30 listing bookmarks * 50 items to share   + Expandable to 150 for additional cost * Restricted to 30 friends   + Expandable to 100 for additional cost |
| Business | Business | **Account Details:**   * Monthly fee * Maximum 200 items to share   + Expandable to 500 for additional cost * 200 listing saves * Up to 4 class-type Listings can be published simultaneously * 100 user group for users allowed to reserve the business’s listings privately (phase 2) * Up to 5 individual users can have shared access to manage (phase 2)   + Expandable to 10 for additional cost * Basic business reports * Verification via automated third-party service with manual review |
| Business Plus | **Account Details:**   * Monthly fee * Max 1000 items to share   + Expandable for additional cost * 1000 listing saves * Up to 20 class-type Listings can be published simultaneously * 1000 user group for users allowed to reserve the business’s listings privately (phase 2) * Up to 20 individual users can have shared access to manage (phase 2)   + Expandable to 100 for additional cost * Advanced business reports * Sharer subscriptions with up to 5 tiers (public or invite-only) |
| Enterprise | Enterprise | Enterprise accounts can be created with custom restrictions and custom identity integrations. Must call for pricing |
| Admin Operations | Admin | **Account Details**   * Review users * Review listings * Manage moderation   + Block users   + Block listings * Remove listings * Other general site maintenance features |

#### Profile Management (Supporting)

|  |  |  |  |
| --- | --- | --- | --- |
| **Capability** | **Description** | **Priority** | **Constraints/ Notes** |
| View Profile | Users can view the profiles of themselves or others to see associated profile details | High | **Public viewers can see:**   * Username * First Name * Last Initial * User Type Label (e.g., Personal, Business) * “Verified User” Badge (Phase 2) * Profile Photo * Bio * Location (City, State) * Posted Listings * Account Creation Date * Ratings/Reviews * Flag/Report Profile Action   **Profile owner can see:**   * All public information * Friends * Edit Profile Actions * Saved Listings / Wishlist * Billing Info / Subscription Plan |
| Edit Profile | Users can edit their own profile details to keep their account, contact information, and details up to date | High | Only accessible to profile owner. Cannot change username |
| Flag/Report Profile | Users can report a profile as a scammer or for hosting listings not allowed on the platform | Medium | Reports are reviewed by admin and moderators to ensure compliance with ShareThrift platform policies |
| Verified User Badge | Display “Verified User” badge for users who pass ID verification, shown as first name and last initial with a checkmark | Medium | Badge only appears after successful verification; must maintain privacy |
| User Standing System | Penalize users for offenses (e.g., late returns) with time-based reserving bans profiles | Low | Ban duration and offense criteria to be detailed in policy document |
| Appeal Block | Users that are currently “blocked” have the option to appeal | Low | The appeal is a text appeal that is attached to the block itself, which an admin will be able to see and review. |

#### Bookmarked Listings (Supporting)

|  |  |  |  |
| --- | --- | --- | --- |
| **Capability** | **Description** | **Priority** | **Constraints/Notes** |
| Bookmark Listing | Users can bookmark a listing, so they can view it or reserve it later | Medium | Limits number of listings allowed to be bookmarked based on account type |
| View Bookmarked Listings | Users can view bookmarked listings | Medium | Max number of bookmarked listings is variable depending on account type |

#### Friends (Supporting, Phase 2)

|  |  |  |  |
| --- | --- | --- | --- |
| **Capability** | **Description** | **Priority** | **Constraints/ Notes** |
| Add Friend | Users with personal accounts can add other users who have personal accounts on the ShareThrift platform as friends | Medium | Different user types have limits to the number of friends allowed  **Non-Verified Personal:** Limit 5 Friends  **Verified Personal:** Limit 10 Friends  **Verified Personal Plus:** Limit 30 friends, Expandable up to 100 for additional cost |
| View Friends | Users can view a list of all users they are friends with | Medium | Users have actions to remove friends from this view |
| Remove Friend | Users can remove other users from their friends | Medium | Since number of friends is restricted, users must be able to remove friends so they can make room for new ones |
| Invite Friend | Users can invite others to join the ShareThrift platform | Low |  |

### Listing Processing

#### Purpose

Allows users to browse, search, bookmark, and view listings, and also the ability to create, edit, and manage their own listings. For the creation of listings, they can either go through the process itself or rely on the AI Chatbot to assist them in the process.

#### Listing (Core)

|  |  |  |  |
| --- | --- | --- | --- |
| **Capability** | **Description** | **Priority** | **Constraints/Notes** |
| Search & Filter Listings | Reservers can search for listings filtered by geographical region and date of item availability | High | Can filter by geographical location, availability, and category  When a reserver filters listings by a future date, items that are currently lent out should still appear in search if they are available during the filtered date range.  If a reserver is blocked by a sharer, they will not be able to view or discover their listing. |
| Create Listing | Sharer can create a listing with all required fields and can choose to save it as a draft or publish it. | High | When creating a listing, if user is not already logged in, user will be prompted to, to get the ability to save the draft  Inactive draft listings expire after 1 month  Can create a Item, Service, or Class type listing  **Listing Availability:**   * Min-Max Sharing Duration * Min-Max Lead time for Sharing * Hours available for Sharing (*Allow hour availability to differ by day of week)* * Dates available for Sharing *(Calendar view, can mark of dates when available)*   **Listing Availability Phase 2 Additions:**   * Restrict to only verified identities * Restrict to only specific groups or users * Restrict to only specific region   Listings support geographical constraints, min/max Sharing duration, min/max lead time, and calendar-based availability  Content Moderator for text/image moderation. |
| Delete Draft Listing | Before requesting for the listing to be posted, the Sharer can delete their draft | High | Listing cannot be posted for deletion to be available |
| Publish Listing | Sharer, once their listing is automatically reviewed, will be able to publish their listing for a time frame specified, then become expired | High | Will be active for time frame specified in creation  Limit is 6 months |
| Appeal Block | A Sharer can make changes, then request that a listing that is currently blocked be reviewed by an admin to be reinstated | Medium | Listing has to be in the blocked state, and a change has to be made. |
| Pause Listing | Sharer can pause an active listing for a given timeframe | Medium | Can be paused even after acceptance, requires the sharer to manually select it to be paused, will last for remainder of listing duration  Makes listing inactive |
| Cancel Listing | Sharer can cancel an active listing | High | Can be cancelled even after acceptance, if the listing is not reinstated within 6 months it will be permanently deleted  Makes listing inactive |
| Edit Listing | Sharer can edit information on a listing, active or not | High | Listing can be edited to change information at any point |
| Reinstate Listing | Sharer can reinstate a cancelled or expired listing to be published and active again | High | Listing can only be reinstated if cancelled or expired, and before 6 months have passed |
| View Listings | Reserver should be able to view an assortment of listings within their geographical range | High | The default geo radius is 10 mi. If user chooses not to filter, ShareThrift will display all listings including available and inactive. |
| View Listing | Reserver should be able to navigate and view individual listing with more detailed information | High |  |
| Report Listing | Reservers can submit issues (e.g., item not working, safety concerns, description) | Medium | Reports to admin, sharers are at risk of penalties such as listing blocks or user bans |
| View Sharing History | Sharer should be able to view the past reservation requests made on a listing | Medium | Reservation requests expire from history 6 months after being completed, or when the listing expires |

#### Messaging (Supporting)

|  |  |  |  |
| --- | --- | --- | --- |
| **Capability** | **Description** | **Priority** | **Constraints/Notes** |
| Direct Messages | Users can send and receive messages. Message threads are tied to a specific listing and the two users involved (reserver and sharer). A sharer has a separate thread for each reserver per listing. A reserver sees individual threads based on each listing they’ve inquired about. | High | Reservers can initiate chat request on a Listing with the Sharer before a Reservation Request is created. Sharer can respond the chat at this time. Sharer can initiate chat request once a Reservation Request is created, and Reservers can respond. |
| Message History | All messages are stored and viewable within the platform. Messages are organized chronologically within each request. | High | Messages expire after 6 months (connected to the listing expiration) |
| Message Notifications | Users receive e-mail notifications when they receive a new message | High | Can be configured in settings |
| Read Status | Messages show read/unread indicators | Low | Can be configured in settings |

#### AI-Chatbot (Supporting)

|  |  |  |  |
| --- | --- | --- | --- |
| **Capability** | **Description** | **Priority** | **Constraints/Notes** |
| Create Draft Listing | AI Chat bot can help the sharer create a draft listing, by prompting them for information required for creation | Medium | When creating a draft listing, if user is not already logged in, user will be prompted to create an account or log in to get the ability to save the draft  Inactive draft listings expire after 1 month  Can create a Item, Service, or Class type listing  **Listing Availability:**   * Min-Max Sharing Duration * Min-Max Lead time for Sharing * Hours available for Sharing (*Allow hour availability to differ by day of week)* * Dates available for Sharing *(Calendar view, can mark of dates when available)*   **Listing Availability Phase 2 Additions:**   * Restrict to only verified identities * Restrict to only specific groups or users * Restrict to only specific region   Listings support geographical constraints, min/max Sharing duration, min/max lead time, and calendar-based availability  Content Moderator for text/image moderation |

### Reservation Lifecycle

#### Purpose

Enables users to request, arrange, and complete the temporary use of an item, service, or class. Follows the entire reservation cycle from searching through listings to confirming the return of the reserved listing.

#### Reservation Request (Core)

|  |  |  |  |
| --- | --- | --- | --- |
| **Capability** | **Description** | **Priority** | **Constraints/Notes** |
| Create Reservation Request | Users can submit a request to the sharer to reserve the item/service/class for a certain date/time selected. This is called the initial request. | High |  |
| Select Date/Time | Calendar-based booking with date/time selection | High | Supports flexible date ranges (e.g., any 1 day between Mon-Fri). Prevent double-booking by blocking out dates with an already accepted request |
| Accept Request | Sharers may accept a reservation request for a listed item. This will initiate a chat where users will coordinate item handoff/return | High | Sharers are also able to rescind an acceptance at any time up until the reservation period has started (the first date that was requested) |
| Decline Request | Sharers may decline a reservation request for a listed item | High |  |
| Cancel Request | A request can be cancelled by the reserver at any time before the decision for the request has been made. | High | If a request has been accepted, and a user decides not to go through with the reservation, they may mutually cancel the request. |
| Close Request | Both parties must mutually close the request to confirm the reservation period is complete. | High |  |
| Reservation History | Users can view the items they have previously reserved in the past | Medium |  |
| Feedback Forms | After reservation period is closed, users can publicly provide feedback on the listing through a rating/review system | Medium |  |

### Admin Operations

#### Purpose

Enables admins to manage users, listings, and platform operations. Supports listing review, user moderation, and system maintenance tasks, while providing analytics insights and enforcing role-based access control.

#### Admin Dashboard (Core)

|  |  |  |  |
| --- | --- | --- | --- |
| **Capability** | **Description** | **Priority** | **Constraints/Notes** |
| Admin Dashboard | Admins can access a dashboard page in which they can manage users, listings, and platform operations. | High | This page is only accessible to Admin accounts. |
| Admin View | Admins have additional actions (e.g., Block) directly accessible when viewing specific listings or user profiles.  This allows admins to perform moderation directly from the user-facing view of listings/profiles when logged in as an admin, enabling moderation workflows without solely relying on the dashboard. | High | These actions should NOT be visible to regular users.  Available to admin accounts. |
| Admin Account Privileges | Admins log in with privileges to access the Admin  Dashboard. | High |  |
| Feature Activation / Deactivation | Admins can enable or disable specific site features (e.g., seasonal promotions, experimental UI) on the platform without developer intervention. | Medium |  |
| Business Reports | Allows admins to view analytics in embedded business reports | Low | Basic analytics are available using embedded reporting tools |

#### Listing Moderation (Supporting)

|  |  |  |  |
| --- | --- | --- | --- |
| **Capability** | **Description** | **Priority** | **Constraints/Notes** |
| Review Listings | Admins can view all pending listing submissions and decide on the next steps. | High | Show only 50 listings at a time, with page navigation options for more.  Can filter by blocked, listings.  Individual listings can show extra information not seen to regular users (i.e. activity log). |
| Approve Listing | Admins can approve currently blocked listings, unblocking and making them visible on the platform. | High | A listing can only be approved manually if it is currently blocked.  For a listing to be approved, it must have valid content as deemed by the admin. |
| Request Updates to Listing | Admins can request additional info or edits from Sharers before approval. This action puts a temporary block on the listing until it is approved. | Medium | Admin must provide a note to Sharer regarding what is needed for approval.  Admins **cannot** edit a listing directly. |
| Block Listing | Admins can remove listings from appearing visible and able to be reserved temporarily. | Medium | Admin must provide reason based on predefined criteria (e.g. policy violations).  Must specify how the listing can be unblocked. |
| Unblock Listing | Admins can unblock listings, removing the “blocked” status on listings. | Medium |  |
| Delete Listing | Admins can permanently delete a listing from the platform, typically reserved for severe policy violations or content. | High | Requires a confirmation (ex. “Do you really want to delete...”) and a reason. |

#### User Moderation (Supporting)

|  |  |  |  |
| --- | --- | --- | --- |
| **Capability** | **Description** | **Priority** | **Constraints/Notes** |
| Review Users | Admins can view user profiles and review user reported profiles. | High | Visible information when reviewing a user:   * All public user information (i.e. name, username) * Listing history * Reservation history   Can filter by reported, blocked users.  For user-reported profiles, show only 50 users at a time, with page navigation options for more. |
| Block Users | Admins can block users, preventing them from taking any action (e.g. reserving creating a listing). | Medium | Admin must provide reason based on predefined criteria (e.g., late return, item damage, policy violation).  Must specify how long the block will last (e.g., 7-day, 30-day, indefinite).  Users would have to appeal for the ban. |
| Unblock Users | Admins can unblock users, removing the “blocked” status on their account. | Medium | Usually done after a review of an appeal from the user. |

### Communication

#### Purpose

This section includes features that let users receive updates from the platform. The system also sends notifications about things like request updates, listing updates, etc.

#### System Notifications (General)

|  |  |  |  |
| --- | --- | --- | --- |
| **Capability** | **Description** | **Priority** | **Constraints/Notes** |
| Request Updates | Users are notified when a reservation request is created, accepted, declined, closed, or cancelled | High | All notifications are by e-mail |
| Listing Updates | Users are notified when a listing is active, paused, reinstated, blocked, cancelled, or expires | High | All notifications are by e-mail |
| Feedback Updates | Users are notified when they receive reviews/ratings | High | All notifications are by e-mail |
| Reminders | Users are notified to remind when a reservation period is about to end | High | 1 hour before reservation period ends |
| Notification Settings | Users can modify what notifications they want to receive | High |  |

## Key Events

This section outlines the business events that occur within the ShareThrift platform. These events represent important moments or changes in the state of users, listings, and reservations, providing a shared understanding of what constitutes a significant business activity.

|  |  |  |  |
| --- | --- | --- | --- |
| **Category** | **Event** | **Trigger** | **Impacted Contexts** |
| **Listing** | A new listing is drafted by a sharer | Sharer completes and saves a new listing form | * Listing (status) * Sharer (listing history) |
| A listing is made publicly available | Admin approves a  submitted listing | * Listing (status) |
| A listing is unpublished or removed | Sharer or Admin takes down an active listing | * Listing (status) |
| A listing expires after its time limit | System detects a listing's active duration has ended | * Listing (status) * Sharer (notification) |
| A listing is rejected by moderators | Admin reviews and denies a submitted listing | * Listing (status) * Sharer (notification) |
| A listing is blocked | Admin applies a temporary block to a listing | * Listing (status) * Sharer (notification) |
| A listing is unblocked | Admin removes a block from a listing | * Listing (status) * Sharer (notification) |
| **Reservation** | A guest submits a request to reserve a listing | Reserver selects a time/date and sends a request | * Reservation (status) * Sharer (notification) |
| A sharer accepts or rejects the request | Sharer responds to pending reservation | * Reservation (status) * Reserver (notification) |
| A reservation is cancelled before it happens | Either party cancels prior to start date | * Reservation (status) * Reserver (notification) * Sharer (notification) |
| A reservation times out due to no response | System auto-expires unresponded request | * Reservation (status) * Reserver (notification) |
| A reservation is completed successfully | Both users confirm completion | * Reservation (status) * Reserver (history) * Sharer (history) |
| A dispute is raised | Either party reports an issue during or after reservation | * Admin (review) |
| **User** | A user account is created | Individual successfully signs up for the platform | * User (profile) * User (account type) |
| A user passes identity verification | User successfully completes the ID verification process | * User (profile) * User (account type) |
| A user updates their profile | User saves changes to their personal profile | * User (profile) |
| A user is blocked | Admin applies a block to a user's account | * User (status) |
| A user is unblocked | Admin removes a block from a user's account | * User (status) |
| **Admin** | A listing or user is flagged for review | User reports content or profile | * Admin (review) * User (standing) or Listing (status) |

## Business Model

The platform operates on a freemium model. Core sharing functionality is available to all users at no cost. Revenue is generated through optional upgrades, including Boosted Listings and Premium Accounts, which enhance listing visibility and account capabilities.

### Revenue Strategy

#### Boosted Listings

Users can pay to increase listing visibility for longer durations.

|  |  |
| --- | --- |
| **Duration** | **Cost Per Listing** |
| 1 month | $0.99 |
| 3 – 6 months | $4.99 |
| > 7 months | $9.99 |

#### Premium Accounts

Users can pay for an optional monthly subscription to access enhanced account features, such as more saved listings or increased reservation capacity.

|  |  |  |
| --- | --- | --- |
| **Plan Name** | **Monthly Fee** | **Features** |
| Verified Personal Plus | $4.99/month | **Account Details:**   * Monthly fee * Max 30 reserved items * 30 listing bookmarks * 50 items to share   + Expandable to 150 for additional cost * Restricted to 30 friends   + Expandable to 100 for additional cost |
| Business | $14.99/month | **Account Details:**   * Monthly fee * Maximum 200 items to share   + Expandable to 500 for additional cost * 200 listing saves * Up to 4 class-type Listings can be published simultaneously * 100 user group for users allowed to reserve the business’s listings privately (phase 2) * Up to 5 individual users can have shared access to manage   + Expandable to 10 for additional cost * Basic business reports * Verification via automated third-party service (e.g., Persona) with manual review |
| Business Plus | $24.99/month | **Account Details:**   * Monthly fee * Max 1000 items to share   + Expandable for additional cost * 1000 listing saves * Up to 20 class-type Listings can be published simultaneously * 1000 user group for users allowed to reserve the business’s listings privately (phase 2) * Up to 20 individual users can have shared access to manage   + Expandable to 100 for additional cost * Advanced business reports * Sharer subscriptions with up to 5 tiers (public or invite-only) |
| Enterprise | Custom Pricing | Enterprise accounts can be created with custom restrictions and custom identity integrations. |

## Logistics

### Risks

#### Manual Admin Reviews

Verifying business accounts and reviewing flagged listings by hand introduces lag and requires human resources that may not scale with user growth. This could delay publication or strain resources. This can also lead to frustrated users due to wait times, delayed listing visibility, and bottlenecked onboarding for Business and Plus users. To mitigate this risk, we should develop clear internal review workflows and rules for verifying and implement bots and checkers to auto review listings.

#### Third-Party Costs

Identity verification and SMS/email notifications depend on external providers. Free quotas may be quickly depleted, especially during early growth. This can lead to unexpected billing overages or feature suspension (e.g., verification failures or blocked messages). To mitigate this risk, we should prioritize use cases and investigate open-source or lower-cost alternatives.

#### Timeline

The target release date may not allow for full implementation of tiered user systems, listing management, messaging, moderation tools, and trust features. This could lead to delayed delivery, scope reduction, and stakeholder dissatisfaction. To mitigate this risk, we should use a tiered delivery (Bronze/Silver/Gold), and consider feature prioritization.

### Constraints

#### Budget

The project must operate within a $150/month MSDN Azure credit, which includes: Hosting and computing, database services, and third-party marketplace tools. All environments (development, staging, production) must share this budget.

#### Time to Market

The platform must reach a functional MVP release by December 25, 2025 (6 months) with Gold, Silver, and Bronze timelines as defined in the SRD. Bronze tier incorporates bare minimum features, silver incorporates all core functionality, and gold incorporates enhanced features. Any features not in scope for the Gold release must be clearly documented as future-phase items.

#### Listing Limits

Per user limits like drafts, active listings, friends and bookmarks are determined by membership tier. Higher listing limits are only granted through manual admin review or account upgrade.

#### Security and Privacy

No in-app financial transactions, users are responsible for payment arrangements off-platform. No sensitive data storage, including payment credentials, social security numbers, or government IDs, all identity verification must be handled via secure third-party platforms.

#### Moderation and Support

Requested reviews are evaluated by bots and checkers first. All higher level content moderation is manual during MVP phase. No 24/7 customer support, response time for reports, reviews, or inquiries is 2–3 business days. Users must agree to community guidelines upon account creation; violation handling is manual.

### Assumptions

* Rely on a third-party service with limited monthly verifications at no cost
* A third-party payment processor like Stripe or PayPal will handle premium accounts and subscription fees
* Manual listing review and moderation is feasible with initial staff resources
* Predefined category types with optional fields meet Phase 1 needs

### Non-Functional Requirements

#### Admin Moderation Response Times

1. Admin should review reported users and blocked listings within 2–3 business days
2. Appeals from blocked users should be resolved within 3–5 business days
3. Appeals for blocked listings should be resolved within 2–3 business days

#### Support Availability

1. Users should receive responses to general support requests within 2 business days

## Project Timeline

* **Target Launch**: December 25, 2025 (6 months from June 25, 2025).
* **Key Milestones**:
  + Business Requirements Document (BRD) Completion: July 11th
  + System Requirements Document (SRD) Completion: July 23rd
    - With Gold, Silver, Bronze estimates
  + Core features (onboarding, listing, reserving, AI-driven flow): [TBD]
  + Admin dashboard, notifications, and moderation integration: [TBD]
  + Testing and launch preparation: [TBD]

## Appendices

### Changelog

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Version** | **Change Description** | **Update Date** | **Updated By** | **Review Date** | **Reviewed By** |
| 1.0 | Initial Version | 6/10/25 | CXA Non-SMEs |  |  |
| 1.1 | Revisions based on AI Feedback | 6/11/25 | CXA Non-SMEs |  |  |

### Links and Resources

[ShareThrift Legacy Codebase](https://github.com/simnova/sharethrift)

[ShareThrift Tech Introduction & Business Case](https://ecfmg.gitbook.io/azure-serverless-quickstart)

[ShareThrift Project Charter](https://simnova.notion.site/ShareThrift-Project-Charter-d38fba50b9644c71805d000a2809de23)

[CellixJS Temporary Location](https://github.com/gidich/cellixjs)

[OpenTelemetry](https://opentelemetry.io/)
