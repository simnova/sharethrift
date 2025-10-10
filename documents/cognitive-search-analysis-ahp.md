# Azure Cognitive Search Implementation Analysis - Alternative Health Professions

This document provides a comprehensive analysis of how Azure Cognitive Search is implemented in the Alternative Health Professions (AHP) codebase to help create a mock version for local development in the ShareThrift project.

## Table of Contents

1. [Package Dependencies](#1-package-dependencies)
2. [Search Client Implementation](#2-search-client-implementation)
3. [Index Definitions](#3-index-definitions)
4. [Search Operations](#4-search-operations)
5. [Data Indexing](#5-data-indexing)
6. [Mock/Test Implementations](#6-mocktest-implementations)
7. [Service Layer Integration](#7-service-layer-integration)
8. [Code Examples](#8-code-examples)
9. [Search Queries Used](#9-search-queries-used)
10. [Architecture Patterns](#10-architecture-patterns)

## 1. Package Dependencies

### Azure Search Dependencies
- **Package**: `@azure/search-documents` version `11.3.2`
- **Package**: `@azure/identity` version `4.2.0`
- **Location**: `data-access/package.json`

```json
{
  "dependencies": {
    "@azure/search-documents": "11.3.2",
    "@azure/identity": "^4.2.0"
  }
}
```

### Related Dependencies
- `async-retry`: For retry logic in search operations
- `dayjs`: For date/time handling in search queries
- `lodash`: For data manipulation in search results

## 2. Search Client Implementation

### Core Implementation Files
- **Base Implementation**: `data-access/seedwork/services-seedwork-cognitive-search-az/index.ts`
- **Infrastructure Service**: `data-access/src/infrastructure-services-impl/cognitive-search/az/impl.ts`
- **Interfaces**: `data-access/seedwork/services-seedwork-cognitive-search-interfaces/index.ts`

### Client Initialization
```typescript
// File: data-access/seedwork/services-seedwork-cognitive-search-az/index.ts
export class AzCognitiveSearch implements CognitiveSearchBase {
  private client: SearchIndexClient;
  private searchClients: Map<string, SearchClient<unknown>> = new Map<string, SearchClient<unknown>>();

  constructor(searchKey: string, endpoint: string) {
    let credentials: TokenCredential;
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      credentials = new DefaultAzureCredential();
    } else if (process.env.MANAGED_IDENTITY_CLIENT_ID !== undefined) {
      credentials = new DefaultAzureCredential({ 
        managedIdentityClientId: process.env.MANAGED_IDENTITY_CLIENT_ID 
      } as DefaultAzureCredentialOptions);
    } else {
      credentials = new DefaultAzureCredential();
    }
    this.client = new SearchIndexClient(endpoint, credentials);
  }
}
```

### Environment Variables Required
- `SEARCH_API_ENDPOINT`: Azure Search service endpoint URL
- `SEARCH_USER_INDEX_NAME`: Name of the user search index
- `SEARCH_ENTITY_INDEX_NAME`: Name of the entity search index  
- `SEARCH_CASE_INDEX_NAME`: Name of the case search index
- `MANAGED_IDENTITY_CLIENT_ID`: For production authentication (optional)
- `NODE_ENV`: Environment mode (development/test/production)

### Authentication Methods
1. **Development/Test**: Uses `DefaultAzureCredential` for local development
2. **Production**: Uses managed identity with optional client ID
3. **Fallback**: Default Azure credential chain

## 3. Index Definitions

### Three Main Search Indexes

#### 1. User Search Index
**File**: `data-access/src/app/domain/infrastructure/cognitive-search/user-search-index-definition.ts`

```typescript
export const UserSearchIndexSpec = {
  name: process.env.SEARCH_USER_INDEX_NAME,
  fields: [
    {
      name: "id",
      key: true,
      type: "Edm.String",
      searchable: true,
      filterable: true,
      sortable: true,
      facetable: true,
    },
    {
      name: "emailAddress",
      type: "Edm.String",
      searchable: true,
      filterable: false,
      sortable: true,
      facetable: false,
      retrievable: true,
    },
    {
      name: "identityDetails",
      type: "Edm.ComplexType",
      fields: [
        {
          name: "lastName",
          type: "Edm.String",
          searchable: true,
          filterable: false,
          sortable: true,
          facetable: false,
          retrievable: true,
        },
        {
          name: "restOfName",
          type: "Edm.String",
          searchable: true,
          filterable: false,
          sortable: true,
          facetable: false,
          retrievable: true,
        },
        {
          name: "gender",
          type: "Edm.String",
          searchable: false,
          filterable: true,
          sortable: true,
          facetable: true,
          retrievable: true,
        },
        {
          name: "dateOfBirth",
          type: "Edm.DateTimeOffset",
          searchable: false,
          filterable: true,
          sortable: true,
          facetable: true,
          retrievable: true,
        }
      ]
    },
    {
      name: "role",
      type: "Edm.String",
      searchable: false,
      filterable: true,
      sortable: true,
      facetable: true,
      retrievable: true,
    },
    {
      name: "accessBlocked",
      type: "Edm.Boolean",
      searchable: false,
      filterable: true,
      sortable: true,
      facetable: true,
      retrievable: true,
    },
    {
      name: "tags",
      type: "Collection(Edm.String)",
      searchable: false,
      filterable: true,
      sortable: false,
      facetable: true,
      retrievable: true,
    },
    {
      name: "userType",
      type: "Edm.String",
      searchable: false,
      filterable: true,
      sortable: true,
      facetable: true,
      retrievable: true,
    },
    {
      name: "displayName",
      type: "Edm.String",
      searchable: true,
      filterable: false,
      sortable: true,
      facetable: false,
      retrievable: true,
    },
    {
      name: "createdAt",
      type: "Edm.DateTimeOffset",
      searchable: false,
      filterable: true,
      sortable: true,
      facetable: true,
      retrievable: true,
    },
    {
      name: "updatedAt",
      type: "Edm.DateTimeOffset",
      searchable: false,
      filterable: true,
      sortable: true,
      facetable: true,
      retrievable: true,
    }
  ]
} as SearchIndex;
```

#### 2. Entity Search Index
**File**: `data-access/src/app/domain/infrastructure/cognitive-search/entity-search-index-definition.ts`

```typescript
export const EntitySearchIndexSpec = {
  name: process.env.SEARCH_ENTITY_INDEX_NAME,
  fields: [
    {
      name: "id",
      key: true,
      type: "Edm.String",
      searchable: true,
      filterable: true,
      sortable: true,
      facetable: true,
    },
    {
      name: "entityName",
      type: "Edm.String",
      searchable: true,
      filterable: false,
      sortable: true,
      facetable: false,
      retrievable: true,
    },
    {
      name: "isIssuingInstitution",
      type: "Edm.Boolean",
      searchable: false,
      filterable: true,
      sortable: true,
      facetable: true,
      retrievable: true,
    },
    {
      name: "isClient",
      type: "Edm.Boolean",
      searchable: false,
      filterable: true,
      sortable: true,
      facetable: true,
      retrievable: true,
    },
    {
      name: "city",
      type: "Edm.String",
      searchable: true,
      filterable: false,
      sortable: true,
      facetable: false,
      retrievable: true,
    },
    {
      name: "country",
      type: "Edm.String",
      searchable: false,
      filterable: true,
      sortable: true,
      facetable: true,
      retrievable: true,
    }
  ]
} as SearchIndex;
```

#### 3. Case Search Index
**File**: `data-access/src/app/domain/infrastructure/cognitive-search/case-search-index-definition.ts`

```typescript
export const CaseSearchIndexSpec = {
  name: process.env.SEARCH_CASE_INDEX_NAME,
  fields: [
    {
      name: "id",
      key: true,
      type: "Edm.String",
      searchable: true,
      filterable: false,
      sortable: false,
      facetable: false,
    },
    {
      name: "caseName",
      type: "Edm.String",
      searchable: true,
      filterable: false,
      sortable: true,
      facetable: false,
      retrievable: true,
    },
    {
      name: "applicantName",
      type: "Edm.String",
      searchable: true,
      filterable: false,
      sortable: true,
      facetable: false,
      retrievable: true,
    },
    {
      name: "caseType",
      type: "Edm.String",
      searchable: false,
      filterable: true,
      sortable: true,
      facetable: true,
      retrievable: true,
    },
    {
      name: "state",
      type: "Edm.String",
      searchable: false,
      filterable: true,
      sortable: true,
      facetable: true,
      retrievable: true,
    },
    {
      name: "credentialType",
      type: "Edm.String",
      searchable: false,
      filterable: true,
      sortable: false,
      facetable: true,
      retrievable: true,
    },
    {
      name: "decision",
      type: "Edm.ComplexType",
      fields: [
        {
          name: "completedAt",
          type: "Edm.DateTimeOffset",
          searchable: false,
          filterable: true,
          sortable: true,
          facetable: true,
          retrievable: true,
        },
        {
          name: "completedBy",
          type: "Edm.String",
          searchable: false,
          filterable: true,
          sortable: false,
          facetable: true,
          retrievable: true,
        },
        {
          name: "result",
          type: "Edm.String",
          searchable: false,
          filterable: true,
          sortable: true,
          facetable: true,
          retrievable: true,
        }
      ]
    },
    {
      name: "tags",
      type: "Collection(Edm.String)",
      searchable: false,
      filterable: true,
      sortable: false,
      facetable: true,
      retrievable: true,
    },
    {
      name: "systemTags",
      type: "Collection(Edm.String)",
      searchable: false,
      filterable: true,
      sortable: false,
      facetable: true,
      retrievable: true,
    }
  ]
} as SearchIndex;
```

## 4. Search Operations

### Core Search Methods

#### Search Interface
```typescript
// File: data-access/seedwork/services-seedwork-cognitive-search-interfaces/index.ts
export interface CognitiveSearchBase {
  createIndexIfNotExists(indexDefinition: SearchIndex): Promise<void>;
  createOrUpdateIndexDefinition(indexName: string, indexDefinition: SearchIndex): Promise<void>;
  deleteDocument(indexName: string, document: any): Promise<void>;
  deleteDocuments(indexName: string, documents: any): Promise<void>;
  indexDocument(indexName: string, document: any): Promise<void>;
  deleteIndex(indexName: string): Promise<void>;
  indexDocuments(indexName: string, documents: any[]): Promise<void>;
  indexExists(indexName: string): boolean;
  initializeSearchClients(): Promise<void>;
}
```

#### Search Implementation
```typescript
// File: data-access/seedwork/services-seedwork-cognitive-search-az/index.ts
async search(indexName: string, searchText: string, options?: any): Promise<SearchDocumentsResult<Pick<unknown, never>>> {
  return this.searchClients.get(indexName).search(searchText, options);
}

async indexDocument(indexName: string, document: any): Promise<void> {
  try {
    await this.searchClients.get(indexName).mergeOrUploadDocuments([document]);
  } catch (error) {
    throw new Error(`Failed to index document in index ${indexName}: ${error.message}`);
  }
}

async deleteDocument(indexName: string, document: any): Promise<void> {
  try {
    await this.searchClients.get(indexName).deleteDocuments([document]);
  } catch (error) {
    throw new Error(`Failed to delete document from index ${indexName}: ${error.message}`);
  }
}
```

### Search Query Builder Pattern

#### Search Query Details Interface
```typescript
// File: data-access/src/app/application-services/search-helpers.ts
export interface SearchQueryDetails {
  options?: {
    queryType?: string;
    searchMode?: string;
    includeTotalCount?: boolean;
    filter?: string;
    facets?: string[];
    top?: number;
    skip?: number;
    orderBy?: string[];
    select?: string[];
  };
  searchString?: string;
}
```

#### Example Search Query Building
```typescript
// File: data-access/src/app/application-services/users/staff-user/staff-user.search.ts
private buildSearchQueryDetailsForStaffUser(input: StaffUserSearchInput, currentDateTime: Date): SearchQueryDetails {
  const searchString = input?.searchString?.trim();
  const filterString = this.getFilterStringForStaffUser(input?.options?.filter, currentDateTime);
  const { dateTimeFacets } = SearchHelpers.handleDateFields(currentDateTime, DateFields);

  return {
    options: {
      queryType: 'full',
      searchMode: 'all',
      includeTotalCount: true,
      filter: filterString,
      facets: [
        `${StaffUserFilterName.Role},count:0`,
        `${StaffUserFilterName.AccessBlocked},count:2`,
        `${StaffUserFilterName.Tags},count:0,sort:count`,
        `${StaffUserFilterName.SchemaVersion},count:0`,
        ...dateTimeFacets,
      ],
      top: input?.options?.top,
      skip: input?.options?.skip,
      orderBy: input?.options?.orderBy ?? ['updatedAt desc'],
    },
    searchString: `${searchString ?? '*'}`,
  };
}
```

## 5. Data Indexing

### Index Creation and Management
```typescript
// File: data-access/seedwork/services-seedwork-cognitive-search-az/index.ts
async initializeSearchClients(): Promise<void> {
  const indexNames = this.client.listIndexesNames();
  for await (const indexName of indexNames) {
    this.searchClients.set(indexName, this.client.getSearchClient(indexName));
  }
}

async createIndexIfNotExists(indexDefinition: SearchIndex): Promise<void> {
  const indexExists = this.indexExists(indexDefinition.name);
  if (!indexExists) {
    await this.client.createIndex(indexDefinition);
    this.searchClients.set(indexDefinition.name, this.client.getSearchClient(indexDefinition.name));
    console.log(`Index ${indexDefinition.name} created`);
  }
}
```

### Document Indexing with Retry Logic
```typescript
// File: data-access/src/app/domain/events/handlers/event-handler-helpers.ts
export const updateSearchIndexWithRetry = async (
  cognitiveSearch, 
  indexDefinition: SearchIndex, 
  indexDoc: Partial<any>, 
  maxAttempts: number
): Promise<Date> => {
  return retry(
    async (_, currentAttempt) => {
      if (currentAttempt > maxAttempts) {
        throw new Error("Max attempts reached");
      }
      await updateSearchIndex(cognitiveSearch, indexDefinition, indexDoc);
      return new Date();
    },
    { retries: maxAttempts }
  );
};

const updateSearchIndex = async (
  cognitiveSearch: CognitiveSearchDomain, 
  indexDefinition: SearchIndex, 
  indexDoc: Partial<any>
) => {
  await cognitiveSearch.createIndexIfNotExists(indexDefinition);
  await cognitiveSearch.indexDocument(indexDefinition.name, indexDoc);
  console.log(`ID Case Updated - Index Updated: ${JSON.stringify(indexDoc)}`);
};
```

### Event-Driven Indexing
The system uses domain events to automatically update search indexes when data changes:

- **Staff User Updates**: `staff-user-updated-update-search-index.ts`
- **Applicant User Updates**: `applicant-user-updated-update-search-index.ts`
- **Entity Updates**: `entity-updated-update-search-index.ts`
- **Case Updates**: Various case update handlers for different case types

## 6. Mock/Test Implementations

### Test File Structure
**File**: `data-access/seedwork/services-seedwork-cognitive-search-az/index.test.ts`

```typescript
import { AzCognitiveSearch } from './index';

// Check if required environment variables are defined
() => {
  if (!process.env.SEARCH_API_KEY || !process.env.SEARCH_API_ENDPOINT) {
    new Error('SEARCH_API_KEY and SEARCH_API_ENDPOINT must be defined.');
  }
});

// Common setup for all tests
let cognitiveSearch;

beforeEach(() => {
  const searchKey = process.env.SEARCH_API_KEY;
  const endpoint = process.env.SEARCH_API_ENDPOINT;
  cognitiveSearch = new AzCognitiveSearch(searchKey, endpoint);
});

test.skip('Initialize cognitive search object',
  expect(cognitiveSearch).toBeDefined();
});

test.skip('cognitive search undefined',
```

**Note**: The test file exists but tests are skipped, indicating no active mock implementation is currently used.

### Mock Implementation Opportunities
For local development, you could create a mock implementation that:
1. Implements the same interfaces as `CognitiveSearchBase`
2. Uses in-memory storage or local JSON files
3. Provides the same search functionality without Azure dependencies
4. Supports all the same query patterns and filters

## 7. Service Layer Integration

### Infrastructure Service Architecture
```typescript
// File: data-access/src/app/infrastructure-services/cognitive-search/index.ts
export interface CognitiveSearchInfrastructureService extends CognitiveSearchDomain, CognitiveSearchDomainInitializeable {
  search(indexName: string, searchText: string, options?: any): Promise<any>;
}
```

### Dependency Injection Pattern
```typescript
// File: data-access/src/infrastructure-services-impl/infrastructure-services-builder.ts
export class InfrastructureServicesBuilder implements InfrastructureServices {
  private _cognitiveSearch: CognitiveSearchInfrastructureService;

  constructor() {
    this._cognitiveSearch = this.InitCognitiveSearch();
  }

  public get cognitiveSearch(): CognitiveSearchInfrastructureService {
    return this._cognitiveSearch;
  }

  private InitCognitiveSearch(): CognitiveSearchInfrastructureService {
    const endpoint = tryGetEnvVar('SEARCH_API_ENDPOINT');
    return new AzCognitiveSearchImpl("", endpoint);
  }

  static async initialize(): Promise<void> {
    await InfrastructureServicesBuilder._instance._cognitiveSearch.initializeSearchClients();
  }
}
```

### Data Source Pattern
```typescript
// File: data-access/src/app/data-sources/cognitive-search-data-source.ts
export class CognitiveSearchDataSource<Context extends AppContext> extends DataSource<Context> {
  public async withSearch(func: (passport: Passport, search: CognitiveSearchInfrastructureService) => Promise<void>): Promise<void> {
    let passport = this._context.passport; 
    let cognitiveSearch = this._context.infrastructureServices.cognitiveSearch;
    await func(passport, cognitiveSearch);
  }
}
```

### Application Service Implementation
```typescript
// File: data-access/src/app/application-services/users/staff-user/staff-user.search.ts
export class StaffUserSearchApiImpl extends CognitiveSearchDataSource<AppContext> implements StaffUserSearchApi {
  async staffUserSearch(input: StaffUserSearchInput): Promise<StaffUserSearchResult> {
    this.ensurePermission();
    let searchResults: SearchDocumentsResult<Pick<unknown, never>>;
    const currentDateTime = SearchHelpers.getCurrentDateTime();
    
    this.createConsecutiveTimeFramesForDateFields(input, DateFields);
    const searchOptions = this.buildSearchQueryDetailsForStaffUser(input, currentDateTime);
    searchResults = await this.doSearch(searchOptions);

    return await this.convertToGraphqlResponse(searchResults, input, currentDateTime);
  }

  private async doSearch(searchQueryDetails: SearchQueryDetails): Promise<SearchDocumentsResult<Pick<unknown, never>>> {
    let searchResults: SearchDocumentsResult<Pick<unknown, never>>;
    await this.withSearch(async (_, searchService) => {
      await searchService.createIndexIfNotExists(UserSearchIndexSpec);
      searchResults = await searchService.search(UserSearchIndexSpec.name, searchQueryDetails.searchString, searchQueryDetails.options);
    });
    return searchResults;
  }
}
```

## 8. Code Examples

### Complete Search Service Implementation
```typescript
// File: data-access/src/infrastructure-services-impl/cognitive-search/az/impl.ts
import { AzCognitiveSearch } from "../../../../seedwork/services-seedwork-cognitive-search-az";
import { CognitiveSearchInfrastructureService } from "../../../app/infrastructure-services/cognitive-search";

export class AzCognitiveSearchImpl extends AzCognitiveSearch implements CognitiveSearchInfrastructureService {
  /**
   * needs following environment variables:
   ** NODE_ENV =  "development" | "test" | "production"
   ** MANAGED_IDENTITY_CLIENT_ID: DefaultAzureCredentialOptions
   */  
  constructor(searchKey: string, endpoint: string) {
      super(searchKey,  endpoint);
  }

  startup = async (): Promise<void> => {
    console.log('AzCognitiveSearchImpl startup');
  }

  shutdown = async (): Promise<void> => {
    console.log('AzCognitiveSearchImpl shutdown');
  }
}
```

### Search Helpers with Date Filtering
```typescript
// File: data-access/src/app/application-services/search-helpers.ts
export class SearchHelpers {
  static buildFilterStringForDateFields<T extends Record<string, any>>(
    filterDetail: T,
    dateFields: string[],
    currentDateTime: Date,
    outputStrings: string[],
    flatToNestedPathFieldNames?: Record<string, string>
  ) {
    const currentDateOnly = dayjs(currentDateTime).format('YYYY-MM-DD');
    const UTCDateTime = dayjs(currentDateOnly).utc().format(ISO_DATE_FORMAT);
    const yesterday = this.getDateInThePast(currentDateOnly, 1);
    const last7Days = this.getDateInThePast(currentDateOnly, 7);
    const last30Days = this.getDateInThePast(currentDateOnly, 30);
    const last365Days = this.getDateInThePast(currentDateOnly, 365);
    const results: string[] = [];
    
    dateFields.forEach((field) => {
      let fieldName = field;
      let filterStringForCurrentField: string[] = [];
      if (flatToNestedPathFieldNames) {
        fieldName = flatToNestedPathFieldNames[field];
      }

      if (filterDetail?.[field]?.includes('today')) {
        filterStringForCurrentField.push(`(${fieldName} ge ${UTCDateTime})`);
      }
      if (filterDetail?.[field]?.includes('yesterday')) {
        filterStringForCurrentField.push(`(${fieldName} ge ${yesterday}) and (${fieldName} lt ${UTCDateTime})`);
      }
      if (filterDetail?.[field]?.includes('lastWeek')) {
        filterStringForCurrentField.push(`(${fieldName} ge ${last7Days}) and (${fieldName} le ${UTCDateTime})`);
      }
      if (filterDetail?.[field]?.includes('lastMonth')) {
        filterStringForCurrentField.push(`(${fieldName} ge ${last30Days}) and (${fieldName} le ${UTCDateTime})`);
      }
      if (filterDetail?.[field]?.includes('lastYear')) {
        filterStringForCurrentField.push(`(${fieldName} ge ${last365Days}) and (${fieldName} le ${UTCDateTime})`);
      }
      if (filterStringForCurrentField.length > 0) {
        results.push(`(${filterStringForCurrentField.join(' or ')})`);
      }
    });
    
    if (results.length > 0) {
      outputStrings.push(`(${results.join(' and ')})`);
    }
  }
}
```

## 9. Search Queries Used

### Common Query Patterns

#### 1. Full Text Search with Filters
```typescript
// Example from staff user search
const searchOptions = {
  queryType: 'full',
  searchMode: 'all',
  includeTotalCount: true,
  filter: "userType eq 'staff' and (role eq 'admin' or role eq 'user')",
  facets: ['role,count:0', 'accessBlocked,count:2', 'tags,count:0,sort:count'],
  top: 50,
  skip: 0,
  orderBy: ['updatedAt desc']
};
```

#### 2. Date Range Filtering
```typescript
// Example date filter strings
const dateFilters = [
  "(createdAt ge 2024-01-01T00:00:00Z)",  // From date
  "(updatedAt lt 2024-12-31T23:59:59Z)",  // To date
  "(lastActivity/createdAt ge 2024-01-01T00:00:00Z)"  // Nested field
];
```

#### 3. Boolean Field Filtering
```typescript
// Example boolean filters
const booleanFilters = [
  "(accessBlocked eq false)",
  "(isIssuingInstitution eq true)",
  "(isClient eq false)"
];
```

#### 4. String Array Filtering
```typescript
// Example array filters
const arrayFilters = [
  "(tags/any(a: a eq 'urgent') or tags/any(a: a eq 'review'))",
  "search.in(country, 'US,CA,MX', ',')"
];
```

#### 5. Complex Type Filtering
```typescript
// Example nested object filters
const complexFilters = [
  "(decision/result eq 'approved')",
  "(decision/completedAt ge 2024-01-01T00:00:00Z)",
  "(revisionRequest/requestedBy eq 'user123')"
];
```

### Faceted Search Queries
```typescript
// Example faceted search configuration
const facets = [
  'role,count:0',                    // All roles
  'accessBlocked,count:2',           // Boolean facets
  'tags,count:0,sort:count',         // Sorted by count
  'country,count:0',                 // All countries
  'createdAt,values:2024-01-01T00:00:00Z|2024-06-01T00:00:00Z|2024-12-01T00:00:00Z'  // Date intervals
];
```

### Search Query Examples from Codebase

#### Staff User Search Query
```typescript
// From: data-access/src/app/application-services/users/staff-user/staff-user.search.ts
const searchQuery = {
  searchString: "john smith",  // or "*" for all
  options: {
    queryType: 'full',
    searchMode: 'all',
    includeTotalCount: true,
    filter: "userType eq 'staff' and (accessBlocked eq false)",
    facets: [
      'role,count:0',
      'accessBlocked,count:2',
      'tags,count:0,sort:count',
      'schemaVersion,count:0',
      'createdAt,values:2023-01-01T00:00:00Z|2023-06-01T00:00:00Z|2024-01-01T00:00:00Z'
    ],
    top: 25,
    skip: 0,
    orderBy: ['updatedAt desc']
  }
};
```

#### Case Search Query
```typescript
// From: data-access/src/app/application-services/cases/case/case.search.ts
const caseSearchQuery = {
  searchString: "credential verification",
  options: {
    queryType: 'full',
    searchMode: 'all',
    includeTotalCount: true,
    filter: "caseType eq 'credential-verification' and (state eq 'pending' or state eq 'in-review')",
    facets: [
      'caseType,count:0',
      'state,count:0',
      'credentialType,count:0',
      'tags,count:0,sort:count',
      'submittedAt,values:2024-01-01T00:00:00Z|2024-06-01T00:00:00Z|2024-12-01T00:00:00Z'
    ],
    top: 50,
    skip: 0,
    orderBy: ['submittedAt desc']
  }
};
```

## 10. Architecture Patterns

### Domain-Driven Design (DDD) Integration
The search functionality is deeply integrated with the domain model:

1. **Domain Events**: Search indexes are updated through domain events when entities change
2. **Repository Pattern**: Search operations are abstracted through repository interfaces
3. **Unit of Work**: Changes are coordinated through unit of work patterns
4. **Aggregate Roots**: Search documents mirror the aggregate structure

### Layered Architecture
```
┌─────────────────────────────────────┐
│           Presentation Layer        │
│         (GraphQL Resolvers)         │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│         Application Layer           │
│       (Search API Services)         │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│          Domain Layer               │
│    (Search Index Definitions)       │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│       Infrastructure Layer          │
│    (Azure Search Implementation)    │
└─────────────────────────────────────┘
```

### Dependency Injection Container
```typescript
// Infrastructure Services Builder Pattern
export class InfrastructureServicesBuilder implements InfrastructureServices {
  private static _instance: InfrastructureServicesBuilder;
  private _cognitiveSearch: CognitiveSearchInfrastructureService;

  static getInstance(): InfrastructureServicesBuilder {
    if (!InfrastructureServicesBuilder._instance) {
      InfrastructureServicesBuilder._instance = new InfrastructureServicesBuilder();
    }
    return InfrastructureServicesBuilder._instance;
  }

  static async initialize(): Promise<void> {
    await InfrastructureServicesBuilder.getInstance();
    await InfrastructureServicesBuilder._instance._cognitiveSearch.initializeSearchClients();
  }
}
```

### Event-Driven Index Updates
```typescript
// Domain event handlers automatically update search indexes
export default (cognitiveSearch: CognitiveSearchDomain, staffUnitOfWork: StaffUserUnitOfWork) => {
  return async (event: StaffUserUpdatedEvent) => {
    try {
      const staffUser = await staffUnitOfWork.withTransaction(async (repo) => {
        return await repo.getById(event.id);
      });

      if (staffUser) {
        const indexDoc: UserSearchIndexDocument = {
          // Map domain object to search document
          id: staffUser.id,
          emailAddress: staffUser.emailAddress,
          identityDetails: {
            lastName: staffUser.identityDetails.lastName,
            restOfName: staffUser.identityDetails.restOfName,
            // ... other fields
          },
          // ... other mappings
        };

        const indexedAt = await updateSearchIndexWithRetry(cognitiveSearch, UserSearchIndexSpec, indexDoc, 3);
        console.log(`Search index updated for staff user ${event.id} at ${indexedAt}`);
      }
    } catch (error) {
      console.error(`Failed to update search index for staff user ${event.id}:`, error);
    }
  };
};
```

### Azure Infrastructure as Code
```bicep
// File: az-bicep/modules/cognitive-search/search-service.bicep
resource cognitiveSearch 'Microsoft.Search/searchServices@2021-04-01-preview' = {
  name: searchServiceName
  location: location
  tags: tags
  sku: {
    name: sku
  }
  properties: {
    authOptions: {
      aadOrApiKey: {
        aadAuthFailureMode: 'http401WithBearerChallenge'
      }
    }
    replicaCount: replicaCount
    partitionCount: partitionCount
  }
}
```

## Summary for Mock Implementation

Based on this analysis, to create a mock version for local development in ShareThrift, you would need to:

1. **Implement the Core Interfaces**:
   - `CognitiveSearchBase` interface
   - `CognitiveSearchInfrastructureService` interface
   - `CognitiveSearchDomain` interface

2. **Create Mock Index Definitions**:
   - User search index with complex types
   - Entity search index with boolean fields
   - Case search index with nested objects

3. **Implement Search Operations**:
   - Full-text search with filters
   - Faceted search with counts
   - Date range filtering
   - Boolean and array filtering
   - Complex type filtering

4. **Support Query Patterns**:
   - OData filter syntax
   - Facet queries with intervals
   - Pagination (top/skip)
   - Sorting (orderBy)
   - Search modes (all/any)

5. **Provide Data Storage**:
   - In-memory storage or local JSON files
   - Index management (create/update/delete)
   - Document CRUD operations

6. **Environment Configuration**:
   - Mock environment variables
   - Local development settings
   - Test data seeding

This comprehensive analysis provides all the necessary information to create a fully functional mock implementation that matches the Azure Cognitive Search behavior used in the AHP codebase.
