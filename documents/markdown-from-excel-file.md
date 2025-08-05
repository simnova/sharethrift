## Sections
| Unnamed: 0 | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 | Unnamed: 6 | Unnamed: 7 | Unnamed: 8 | Unnamed: 9 | Unnamed: 10 | Unnamed: 11 | Unnamed: 12 | Unnamed: 13 | Unnamed: 14 | Unnamed: 15 | Unnamed: 16 | Unnamed: 17 | Unnamed: 18 | Unnamed: 19 | Unnamed: 20 | Unnamed: 21 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| User | NaN | NaN | NaN | Listing | NaN | NaN | NaN | ReservationRequest | NaN | NaN | NaN | Reports | NaN | NaN | NaN | Conversation | NaN | NaN | NaN | Role | NaN |
| NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| NaN | Permissions | NaN | NaN | NaN | Permissions | NaN | NaN | NaN | ReservationRequest | NaN | NaN | NaN | UserReport | NaN | NaN | NaN | Conversation | NaN | NaN | NaN | Role |
| NaN | Search Definition | NaN | NaN | NaN | Search Definition | NaN | NaN | NaN | NaN | NaN | NaN | NaN | ListingReport | NaN | NaN | NaN | NaN | NaN | NaN | NaN | Types: |
| NaN | Types | NaN | NaN | NaN | Types | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | Admin |
| NaN | Personal | NaN | NaN | NaN | Item | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| NaN | Admin | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |

## PersonalUser
| < Navigate Home | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 | Unnamed: 6 | Unnamed: 7 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| collection:User | State/Role | NaN | NaN | NaN | NaN | NaN | NaN |
| PersonalUser | Not Blocked | NaN | Blocked | NaN | NaN | NaN | NaN |
| Properties | User Account Owner | Admin User | User Account Owner | Admin User | NaN | Data Type | Rules |
| \_id | NaN | NaN | NaN | NaN | NaN | required, objectId | Object Id must be unique. |
| userType | NaN | NaN | NaN | NaN | NaN | required, string | NaN |
| isBlocked | NaN | NaN | NaN | NaN | NaN | required, boolean | NaN |
| account { | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| accountType | NaN | NaN | NaN | NaN | NaN | required, string | ENUM: ['personal', 'business', 'enterprise'] |
| email | NaN | NaN | NaN | NaN | NaN | required, string | Email must be unique |
| username | NaN | NaN | NaN | NaN | NaN | required, string | Username must be unique |
| profile { | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| firstName | NaN | NaN | NaN | NaN | NaN | required, string | NaN |
| lastName | NaN | NaN | NaN | NaN | NaN | required, string | NaN |
| location { | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| address1 | NaN | NaN | NaN | NaN | NaN | required, string | NaN |
| address2 | NaN | NaN | NaN | NaN | NaN | optional, string | NaN |
| city | NaN | NaN | NaN | NaN | NaN | required, string | NaN |
| state | NaN | NaN | NaN | NaN | NaN | required, string | NaN |
| country | NaN | NaN | NaN | NaN | NaN | required, string | NaN |
| zipCode | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| } | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| billing { | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| subscriptionId? | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| cybersourceCustomerId? | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| } | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| } | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| } | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| schemaversion | NaN | NaN | NaN | NaN | NaN | required, decimal | NaN |
| createdAt | NaN | NaN | NaN | NaN | NaN | required, date | NaN |
| updatedAt | NaN | NaN | NaN | NaN | NaN | required, date | NaN |

## AdminUser
| < Navigate Home | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 | Unnamed: 6 | Unnamed: 7 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| collection:User | State/Role | NaN | NaN | NaN | NaN | NaN | NaN |
| AdminUser | Not Blocked | NaN | Blocked | NaN | NaN | NaN | NaN |
| Properties | User Account Owner | Admin User | User Account Owner | Admin User | NaN | Data Type | Rules |
| \_id | NaN | NaN | NaN | NaN | NaN | required, objectId | Object Id must be unique. |
| userType | NaN | NaN | NaN | NaN | NaN | required, string | NaN |
| isBlocked | NaN | NaN | NaN | NaN | NaN | required, boolean | NaN |
| account { | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| accountType | NaN | NaN | NaN | NaN | NaN | required, string | ENUM: ['personal', 'business', 'enterprise'] |
| email | NaN | NaN | NaN | NaN | NaN | required, string | Email must be unique |
| username | NaN | NaN | NaN | NaN | NaN | required, string | Username must be unique |
| profile { | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| firstName | NaN | NaN | NaN | NaN | NaN | required, string | NaN |
| lastName | NaN | NaN | NaN | NaN | NaN | required, string | NaN |
| location { | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| address1 | NaN | NaN | NaN | NaN | NaN | required, string | NaN |
| address2 | NaN | NaN | NaN | NaN | NaN | optional, string |  |
| city | NaN | NaN | NaN | NaN | NaN | required, string | NaN |
| state | NaN | NaN | NaN | NaN | NaN | required, string | NaN |
| country | NaN | NaN | NaN | NaN | NaN | required, string | NaN |
| zipCode | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| } | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| billing { | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| subscriptionId? | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| cybersourceCustomerId? | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| } | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| } | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| } | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| role | NaN | NaN | NaN | NaN | NaN | optional, objectId | Role reference |
| reservationHistory | NaN | NaN | NaN | NaN | NaN | required, string, enum | NaN |
| schemaversion | NaN | NaN | NaN | NaN | NaN | required, decimal | NaN |
| createdAt | NaN | NaN | NaN | NaN | NaN | required, date | NaN |
| updatedAt | NaN | NaN | NaN | NaN | NaN | required, date | NaN |

## ItemListing
| < Navigate Home | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 | Unnamed: 6 | Unnamed: 7 | Unnamed: 8 | Unnamed: 9 | Unnamed: 10 | Unnamed: 11 | Unnamed: 12 | Unnamed: 13 | Unnamed: 14 | Unnamed: 15 | Unnamed: 16 | Unnamed: 17 | Unnamed: 18 | Unnamed: 19 | Unnamed: 20 | Unnamed: 21 | Unnamed: 22 | Unnamed: 23 | Unnamed: 24 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| collections:Listing | State / Role | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| ItemListing | Drafted | NaN | NaN | Published | NaN | NaN | Paused | NaN | NaN | Blocked | NaN | NaN | Appeal Requested | NaN | NaN | Cancelled | NaN | NaN | Expired | NaN | NaN | NaN | NaN | NaN |
| Properties | Sharer | Reserver | Admin | Sharer | Reserver | Admin | Sharer | Reserver | Admin | Sharer | Reserver | Admin | Sharer | Reserver | Admin | Sharer | Reserver | Admin | Sharer | Reserver | Admin | NaN | Data Type | Rules |
| \_id | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | required, objectid | unique |
| sharer | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | required, objectId | User reference |
| title | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | required, string | NaN |
| description | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | required, string | NaN |
| category | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | required, string | NaN |
| location | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | required, string | NaN |
| sharingPeriodStart | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | required, timestamp | NaN |
| sharingPeriodEnd | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | required, timestamp | NaN |
| state | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | optional, string | "Published", "Paused", "Cancelled", "Drafted", "Expired", "Blocked", "Appeal Requested" |
| updatedAt | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | optional, timestamp | NaN |
| createdAt | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | optional, timestamp | NaN |
| sharingHistory | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | optional, objectid[] | NaN |
| reports | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | optional, number | NaN |

## ReservationRequest
| < Navigate Home | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 | Unnamed: 6 | Unnamed: 7 | Unnamed: 8 | Unnamed: 9 | Unnamed: 10 | Unnamed: 11 | Unnamed: 12 | Unnamed: 13 | Unnamed: 14 | Unnamed: 15 | Unnamed: 16 | Unnamed: 17 | Unnamed: 18 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| collections:ReservationRequest | State/Role | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| ReservationRequest | Requested | NaN | NaN | Accepted | NaN | NaN | Rejected | NaN | NaN | Reservation Period | NaN | NaN | Cancelled | NaN | NaN | NaN | NaN | NaN |
| Properties | Sharer | Reserver | Admin | Sharer | Reserver | Admin | Sharer | Reserver | Admin | Sharer | Reserver | Admin | Sharer | Reserver | Admin | NaN | Data Type | Rules |
| \_id | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | required, objectId | NaN |
| state | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | required, string | "Requested", "Accepted", "Rejected", "Reservation Period", "Cancelled" |
| reservationPeriodStart | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | required, Date | NaN |
| reservationPeriodEnd | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | required, Date | NaN |
| createdAt | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | required, timestamp | NaN |
| schemaversion | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | required, decimal | NaN |
| listing | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | required, objectId | Listing reference |
| reserver | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | required, objectId | User reference |
| updatedAt | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | requried, timestamp | NaN |
| schemaversion | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | required, decimal | NaN |

## Conversation
| < Navigate Home | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 | Unnamed: 6 |
| --- | --- | --- | --- | --- | --- | --- |
| collections:Conversation | NaN | NaN | NaN | NaN | NaN | NaN |
| Conversation | Role | NaN | NaN | NaN | NaN | NaN |
| Properties | Sharer | Reserver | Admin | NaN | Data Type | Rules |
| \_id | NaN | NaN | NaN | NaN | required, objectId | NaN |
| sharer | NaN | NaN | NaN | NaN | required, objectId | User reference |
| reserver | NaN | NaN | NaN | NaN | required, objectId | User reference |
| createdAt | NaN | NaN | NaN | NaN | required, timestamp | NaN |
| updatedAt | NaN | NaN | NaN | NaN | required, timestamp | NaN |
| listing | NaN | NaN | NaN | NaN | required, objectId | NaN |
| schemaversion | NaN | NaN | NaN | NaN | required, decimal | NaN |
| messages [{ | NaN | NaN | NaN | NaN | NaN | NaN |
| \_id | NaN | NaN | NaN | NaN | required, objectId | NaN |
| senderId | NaN | NaN | NaN | NaN | required, objectId | NaN |
| recipientId | NaN | NaN | NaN | NaN | required, objectId | NaN |
| content | NaN | NaN | NaN | NaN | required, objectId | NaN |
| twilioMessageId | NaN | NaN | NaN | NaN | optional, string | NaN |
| createdAt | NaN | NaN | NaN | NaN | requried, timestamp | NaN |
| }] | NaN | NaN | NaN | NaN | NaN | NaN |

## ListingReport
| < Navigate Home | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 | Unnamed: 6 |
| --- | --- | --- | --- | --- | --- | --- |
| collections:Report | NaN | NaN | NaN | NaN | NaN | NaN |
| ListingReport | Role | NaN | NaN | NaN | NaN | NaN |
| Properties | Sharer | Reserver | Admin | NaN | Data Type | Rules |
| \_id | NaN | NaN | NaN | NaN | required, objectid | NaN |
| listing | NaN | NaN | NaN | NaN | optional, objectId | Listing reference |
| reason | NaN | NaN | NaN | NaN | optional, string | NaN |
| createdAt | NaN | NaN | NaN | NaN | required, date | NaN |
| type | NaN | NaN | NaN | NaN | required, string | NaN |
| schemaversion | NaN | NaN | NaN | NaN | required, decimal | NaN |

## UserReport
| < Navigate Home | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 |
| --- | --- | --- | --- | --- | --- |
| collections:Report | NaN | NaN | NaN | NaN | NaN |
| ReportUser | Role | NaN | NaN | NaN | NaN |
| Properties | User | Admin User | NaN | Data Type | Rules |
| \_id | NaN | NaN | NaN | required, objectid | NaN |
| user | NaN | NaN | NaN | optional, objectId | User reference |
| reason | NaN | NaN | NaN | optional, string | NaN |
| createdAt | NaN | NaN | NaN | required, Date | NaN |
| type | NaN | NaN | NaN | required, string | NaN |
| schemaversion | NaN | NaN | NaN | required, decimal | NaN |

## AdminRole
| < Navigate Home | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 |
| --- | --- | --- | --- | --- | --- |
| collections:Role | NaN | NaN | NaN | NaN | NaN |
| AdminRole | Role | NaN | NaN | NaN | NaN |
| Properties | User | Admin User | NaN | Data Type | Rules |
| \_id | NaN | NaN | NaN | objectId | NaN |
| roleName | NaN | NaN | NaN | string | NaN |
| roleType | NaN | NaN | NaN | string | NaN |
| permissions { | NaN | NaN | NaN | NaN | NaN |
| canBlockUsers | NaN | NaN | NaN | boolean | NaN |
| canBlockListings | NaN | NaN | NaN | boolean | NaN |
| canUnblockUsers | NaN | NaN | NaN | boolean | NaN |
| canUnblockListings | NaN | NaN | NaN | boolean | NaN |
| canRemoveListings | NaN | NaN | NaN | boolean | NaN |
| canViewListingReports | NaN | NaN | NaN | boolean | NaN |
| canViewUserReports | NaN | NaN | NaN | boolean | NaN |
| } | NaN | NaN | NaN | NaN | NaN |

## AITesting
| < Navigate Home | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 |
| --- | --- | --- | --- | --- | --- |
| collections:AITesting | NaN | NaN | NaN | NaN | NaN |
| AITesting | Role | NaN | NaN | NaN | NaN |
| Properties | User | Admin User | NaN | Data Type | Rules |
| \_id | NaN | NaN | NaN | objectId | NaN |
| priField | NaN | NaN | NaN | string | NaN |
| populatedDocField | NaN | NaN | NaN | string, objectid | TestingPopulatedDoc reference |
| nestedPathField { | NaN | NaN | NaN | NaN | NaN |
| field1 | NaN | NaN | NaN | boolean | NaN |
| field2 | NaN | NaN | NaN | boolean | NaN |
| } | NaN | NaN | NaN | NaN | NaN |
| subdocumentBaseField { | NaN | NaN | NaN | NaN | NaN |
| \_id | NaN | NaN | NaN | objectId | NaN |
| field1 | NaN | NaN | NaN | date | NaN |
| field3 | NaN | NaN | NaN | string | NaN |
| field2 | NaN | NaN | NaN | string | NaN |
| } | NaN | NaN | NaN | NaN | NaN |
