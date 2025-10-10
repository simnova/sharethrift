# Azure Cognitive Search Implementation Analysis
## Owner Community Codebase

**Generated:** October 9, 2025  
**Purpose:** Complete implementation guide for creating a mock Azure Cognitive Search service for ShareThrift project

---

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

---

## 1. Package Dependencies

### Primary Azure Search Package
**File:** `data-access/package.json`

```json
{
  "dependencies": {
    "@azure/search-documents": "^11.2.1",
    "@azure/identity": "^2.1.0"
  }
}
```

**Installed Version:** `@azure/search-documents@11.3.3` (from package-lock.json)

### Related Azure Dependencies
- `@azure/identity@^2.1.0` - For authentication (DefaultAzureCredential, ManagedIdentityCredential)
- `@azure/storage-blob@^12.8.0` - Used alongside search for blob operations
- `@azure/monitor-opentelemetry@^1.3.0` - For telemetry and monitoring

### Supporting Libraries
```json
{
  "async-retry": "^1.3.3",      // For retry logic on index operations
  "dayjs": "^1.11.3",            // For date manipulation in indexes
  "crypto": "built-in"           // For hash generation (change detection)
}
```

### Modules Using These Dependencies

**Core Search Modules:**
1. `data-access/seedwork/services-seedwork-cognitive-search-az/` - Azure implementation
2. `data-access/seedwork/services-seedwork-cognitive-search-interfaces/` - Interface definitions
3. `data-access/seedwork/services-seedwork-cognitive-search-in-memory/` - Mock implementation
4. `data-access/src/infrastructure-services-impl/cognitive-search/` - Infrastructure implementation
5. `data-access/src/app/domain/infrastructure/cognitive-search/` - Domain models and index schemas
6. `data-access/src/app/application-services/property/` - Property search API
7. `data-access/src/app/application-services/cases/service-ticket/v1/` - Service ticket search API

---

## 2. Search Client Implementation

### 2.1 Base Search Client (Azure Implementation)

**File:** `data-access/seedwork/services-seedwork-cognitive-search-az/index.ts`

```typescript
import { DefaultAzureCredential, DefaultAzureCredentialOptions, TokenCredential } from '@azure/identity';
import { SearchIndexClient, SearchClient, SearchIndex, SearchDocumentsResult, AzureKeyCredential } from '@azure/search-documents';
import { CognitiveSearchBase } from '../services-seedwork-cognitive-search-interfaces';

export class AzCognitiveSearch implements CognitiveSearchBase {
  private client: SearchIndexClient;
  private searchClients: Map<string, SearchClient<unknown>> = new Map<string, SearchClient<unknown>>();

  tryGetEnvVar(envVar: string): string {
    const value = process.env[envVar];
    if (value === undefined) {
      throw new Error(`Environment variable ${envVar} is not set`);
    }
    return value;
  }

  constructor(endpoint: string) {
    let credentials: TokenCredential;
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      credentials = new DefaultAzureCredential();
    } else if (process.env.MANAGED_IDENTITY_CLIENT_ID !== undefined) {
      credentials = new DefaultAzureCredential({ 
        ManangedIdentityClientId: process.env.MANAGED_IDENTITY_CLIENT_ID 
      } as DefaultAzureCredentialOptions);
    } else {
      credentials = new DefaultAzureCredential();
    }
    this.client = new SearchIndexClient(endpoint, credentials);
  }

  private getSearchClient(indexName: string): SearchClient<unknown> {
    let client = this.searchClients.get(indexName);
    if (!client) {
      client = this.client.getSearchClient(indexName);
      this.searchClients.set(indexName, client);
    }
    return client;
  }

  async indexExists(indexName: string): Promise<boolean> {
    return this.searchClients.has(indexName);
  }

  async createIndexIfNotExists(indexDefinition: SearchIndex): Promise<void> {
    const indexExists = this.indexExists(indexDefinition.name);
    if (!indexExists) {
      try {
        await this.client.createIndex(indexDefinition);
        this.searchClients.set(indexDefinition.name, this.client.getSearchClient(indexDefinition.name));
        console.log(`Index ${indexDefinition.name} created`);
      } catch (error) {
        throw new Error(`Failed to create index ${indexDefinition.name}: ${error.message}`);
      }
    }
  }

  async createOrUpdateIndexDefinition(indexName: string, indexDefinition: SearchIndex): Promise<void> {
    try {
      const indexExists = this.indexExists(indexName);
      if (!indexExists) {
        await this.client.createIndex(indexDefinition);
        this.searchClients.set(indexDefinition.name, this.client.getSearchClient(indexDefinition.name));
      } else {
        await this.client.createOrUpdateIndex(indexDefinition);
        console.log(`Index ${indexName} updated`);
      }
    } catch (error) {
      throw new Error(`Failed to create or update index ${indexName}: ${error.message}`);
    }
  }

  async search(indexName: string, searchText: string, options?: any): Promise<SearchDocumentsResult<Pick<unknown, never>>> {
    const startTime = new Date();
    const result = await this.getSearchClient(indexName).search(searchText, options);
    console.log(`SearchLibrary took ${new Date().getTime() - startTime.getTime()}ms`);
    return result;
  }

  async deleteDocument(indexName: string, document: any): Promise<void> {
    try {
      await this.searchClients.get(indexName).deleteDocuments([document]);
    } catch (error) {
      throw new Error(`Failed to delete document from index ${indexName}: ${error.message}`);
    }
  }

  async indexDocument(indexName: string, document: any): Promise<void> {
    try {
      await this.searchClients.get(indexName).mergeOrUploadDocuments([document]);
    } catch (error) {
      throw new Error(`Failed to index document in index ${indexName}: ${error.message}`);
    }
  }

  async deleteIndex(indexName: string): Promise<void> {
    try {
      await this.client.deleteIndex(indexName);
      this.searchClients.delete(indexName);
      console.log(`Index ${indexName} deleted`);
    } catch (error) {
      throw new Error(`Failed to delete index ${indexName}: ${error.message}`);
    }
  }
}
```

### 2.2 Environment Variables

**Required Environment Variables:**
```bash
# Primary Configuration
SEARCH_API_ENDPOINT="https://your-search-service.search.windows.net"

# Authentication (Choose One)
# Option 1: For Development/Test
NODE_ENV="development"  # Uses DefaultAzureCredential

# Option 2: For Production with Managed Identity
MANAGED_IDENTITY_CLIENT_ID="<your-managed-identity-client-id>"

# Option 3: Using API Key (Not implemented but supported by SDK)
SEARCH_API_KEY="<your-admin-api-key>"
```

### 2.3 Infrastructure Service Initialization

**File:** `data-access/src/infrastructure-services-impl/infrastructure-services-builder.ts`

```typescript
private InitCognitiveSearch(): CognitiveSearchInfrastructureService {
  const endpoint = tryGetEnvVar('SEARCH_API_ENDPOINT');
  return new AzCognitiveSearchImpl(endpoint);
}
```

**File:** `data-access/src/infrastructure-services-impl/cognitive-search/az/impl.ts`

```typescript
export class AzCognitiveSearchImpl extends AzCognitiveSearch implements CognitiveSearchInfrastructureService {
  constructor(endpoint: string) {
    super(endpoint);
  }

  startup = async (): Promise<void> => {
    console.log('custom-log | AzCognitiveSearchImpl | startup');
  }

  shutdown = async (): Promise<void> => {
    console.log('custom-log | AzCognitiveSearchImpl | shutdown');
  }
}
```

### 2.4 Authentication Patterns

**Three authentication methods supported:**

1. **DefaultAzureCredential (Development/Test)**
   - Uses local Azure CLI credentials
   - Automatically tries multiple authentication methods
   - Recommended for local development

2. **Managed Identity (Production)**
   - Uses Azure Managed Identity for service-to-service authentication
   - No credentials stored in code
   - Environment variable: `MANAGED_IDENTITY_CLIENT_ID`

3. **API Key (Legacy - not actively used)**
   - Uses `AzureKeyCredential` from `@azure/search-documents`
   - Requires `SEARCH_API_KEY` environment variable
   - Less secure than managed identity

---

## 3. Index Definitions

### 3.1 Property Listings Index

**File:** `data-access/src/app/domain/infrastructure/cognitive-search/property-search-index-format.ts`

**Index Name:** `property-listings`

**Full Schema:**
```typescript
import { GeographyPoint, SearchIndex } from "../../../../../seedwork/services-seedwork-cognitive-search-interfaces";

export const PropertyListingIndexSpec = {
  name: 'property-listings',
  fields: [
    // PRIMARY KEY
    { name: 'id', type: 'Edm.String', searchable: false, key: true },
    
    // FILTERABLE FIELDS
    {
      name: 'communityId',
      type: 'Edm.String',
      searchable: false,
      filterable: true,
    },
    
    // SEARCHABLE AND SORTABLE
    {
      name: 'name',
      type: 'Edm.String',
      searchable: true,
      filterable: false,
      sortable: true,
      facetable: false,
    },
    
    // FACETABLE FIELDS
    {
      name: 'type',
      type: 'Edm.String',
      searchable: false,
      filterable: true,
      sortable: false,
      facetable: true,
    },
    {
      name: 'bedrooms',
      type: 'Edm.Int32',
      searchable: false,
      filterable: true,
      sortable: true,
      facetable: true,
    },
    
    // COLLECTIONS
    {
      name: 'amenities',
      type: 'Collection(Edm.String)',
      searchable: false,
      filterable: true,
      sortable: false,
      facetable: true,
    },
    
    // COMPLEX TYPES (NESTED OBJECTS)
    {
      name: 'additionalAmenities',
      type: 'Collection(Edm.ComplexType)',
      fields: [
        {
          name: 'category',
          type: 'Edm.String',
          facetable: true,
          filterable: true,
          retrievable: true,
          searchable: false,
          sortable: false,
        },
        {
          name: 'amenities',
          type: 'Collection(Edm.String)',
          facetable: true,
          filterable: true,
          retrievable: true,
          searchable: false,
          sortable: false,
        },
      ],
    },
    
    // NUMERIC FIELDS
    {
      name: 'price',
      type: 'Edm.Double',
      searchable: false,
      filterable: true,
      sortable: true,
      facetable: false,
    },
    {
      name: 'squareFeet',
      type: 'Edm.Double',
      searchable: false,
      filterable: true,
      sortable: true,
      facetable: false,
    },
    {
      name: 'bathrooms',
      type: 'Edm.Double',
      searchable: false,
      filterable: true,
      sortable: true,
      facetable: true,
    },
    
    // GEOSPATIAL FIELD
    {
      name: 'position',
      type: 'Edm.GeographyPoint',
      filterable: true,
      sortable: true,
    },
    
    // IMAGE ARRAYS
    {
      name: 'images',
      type: 'Collection(Edm.String)',
      searchable: false,
      filterable: false,
      sortable: false,
      facetable: false,
    },
    
    // COMPANY INFO
    {
      name: 'listingAgentCompany',
      type: 'Edm.String',
      searchable: false,
      filterable: false,
      sortable: false,
      facetable: false,
    },
    
    // COMPLEX ADDRESS OBJECT
    {
      name: 'address',
      type: 'Edm.ComplexType',
      fields: [
        { name: 'streetNumber', type: 'Edm.String', filterable: false, sortable: false, facetable: false, searchable: true },
        { name: 'streetName', type: 'Edm.String', filterable: false, sortable: false, facetable: false, searchable: true },
        { name: 'municipality', type: 'Edm.String', facetable: true, filterable: true, retrievable: true, searchable: true, sortable: true },
        { name: 'municipalitySubdivision', type: 'Edm.String', facetable: false, filterable: true, retrievable: true, searchable: true, sortable: false },
        { name: 'localName', type: 'Edm.String', facetable: false, filterable: true, retrievable: true, searchable: true, sortable: false },
        { name: 'countrySecondarySubdivision', type: 'Edm.String', facetable: false, filterable: true, retrievable: true, searchable: true, sortable: false },
        { name: 'countryTertiarySubdivision', type: 'Edm.String', facetable: false, filterable: true, retrievable: true, searchable: true, sortable: false },
        { name: 'countrySubdivision', type: 'Edm.String', facetable: false, filterable: true, retrievable: true, searchable: true, sortable: false },
        { name: 'countrySubdivisionName', type: 'Edm.String', facetable: false, filterable: true, retrievable: true, searchable: true, sortable: false },
        { name: 'postalCode', type: 'Edm.String', searchable: true, filterable: true, sortable: true, facetable: true },
        { name: 'extendedPostalCode', type: 'Edm.String', facetable: false, filterable: true, retrievable: true, searchable: true, sortable: false },
        { name: 'countryCode', type: 'Edm.String', facetable: false, filterable: true, retrievable: true, searchable: true, sortable: false },
        { name: 'country', type: 'Edm.String', searchable: true, filterable: true, sortable: true, facetable: true },
        { name: 'countryCodeISO3', type: 'Edm.String', facetable: false, filterable: true, retrievable: true, searchable: true, sortable: false },
        { name: 'freeformAddress', type: 'Edm.String', facetable: false, filterable: true, retrievable: true, searchable: true, sortable: false },
        { name: 'streetNameAndNumber', type: 'Edm.String', facetable: false, filterable: true, retrievable: true, searchable: true, sortable: false },
        { name: 'routeNumbers', type: 'Edm.String', facetable: false, filterable: true, retrievable: true, searchable: true, sortable: false },
        { name: 'crossStreet', type: 'Edm.String', facetable: false, filterable: true, retrievable: true, searchable: true, sortable: false },
      ],
    },
    
    // BOOLEAN FLAGS
    { name: 'listedForSale', type: 'Edm.Boolean', searchable: false, filterable: true, sortable: true, facetable: true },
    { name: 'listedForRent', type: 'Edm.Boolean', searchable: false, filterable: true, sortable: true, facetable: true },
    { name: 'listedForLease', type: 'Edm.Boolean', searchable: false, filterable: true, sortable: true, facetable: true },
    
    // TIMESTAMPS
    { name: 'updatedAt', type: 'Edm.DateTimeOffset', facetable: true, filterable: true, retrievable: true, sortable: true },
    { name: 'createdAt', type: 'Edm.DateTimeOffset', facetable: true, filterable: true, retrievable: true, sortable: true },
    
    // TAGS
    { name: 'tags', type: 'Collection(Edm.String)', searchable: false, filterable: true, sortable: false, facetable: true },
  ],
} as SearchIndex;

// TypeScript Interface for Document
export interface PropertyListingIndexDocument {
  id: string;
  communityId: string;
  name: string;
  type: string;
  bedrooms: number;
  amenities: string[];
  additionalAmenities: { category: string; amenities: string[]; }[];
  price: number;
  bathrooms: number;
  squareFeet: number;
  position: GeographyPoint;
  images: string[];
  listingAgentCompany: string;
  address: {
    streetNumber: string;
    streetName: string;
    municipality: string;
    municipalitySubdivision: string;
    localName: string;
    countrySecondarySubdivision: string;
    countryTertiarySubdivision: string;
    countrySubdivision: string;
    countrySubdivisionName: string;
    postalCode: string;
    extendedPostalCode: string;
    countryCode: string;
    country: string;
    countryCodeISO3: string;
    freeformAddress: string;
    streetNameAndNumber: string;
    routeNumbers: string;
    crossStreet: string;
  };
  listedForSale: boolean;
  listedForRent: boolean;
  listedForLease: boolean;
  updatedAt: string;
  createdAt: string;
  tags: string[];
}
```

### 3.2 Service Ticket Index

**File:** `data-access/src/app/domain/infrastructure/cognitive-search/service-ticket-search-index-format.ts`

**Index Name:** `service-ticket-index`

```typescript
export const ServiceTicketIndexSpec = {
  name: 'service-ticket-index',
  fields: [
    { name: 'id', type: 'Edm.String', searchable: false, key: true },
    { name: 'communityId', type: 'Edm.String', searchable: false, filterable: true },
    { name: 'propertyId', type: 'Edm.String', searchable: false, filterable: true },
    { name: 'title', type: 'Edm.String', searchable: true, filterable: false, sortable: true, facetable: false },
    { name: 'requestor', type: 'Edm.String', searchable: false, filterable: true, sortable: true, facetable: true },
    { name: 'requestorId', type: 'Edm.String', searchable: false, filterable: true, sortable: true, facetable: true },
    { name: 'assignedTo', type: 'Edm.String', searchable: false, filterable: true, sortable: true, facetable: true },
    { name: 'assignedToId', type: 'Edm.String', searchable: false, filterable: true, sortable: true, facetable: true },
    { name: 'description', type: 'Edm.String', searchable: true, filterable: false, sortable: false, facetable: false },
    { name: 'ticketType', type: 'Edm.String', facetable: true, searchable: true, filterable: true },
    { name: 'status', type: 'Edm.String', searchable: false, filterable: true, sortable: true, facetable: true },
    { name: 'priority', type: 'Edm.Int32', searchable: false, filterable: true, sortable: true, facetable: true },
    { name: 'updatedAt', type: 'Edm.DateTimeOffset', facetable: true, filterable: true, retrievable: true, sortable: true },
    { name: 'createdAt', type: 'Edm.DateTimeOffset', facetable: true, filterable: true, retrievable: true, sortable: true },
  ],
} as SearchIndex;

export interface ServiceTicketIndexDocument {
  id: string;
  communityId: string;
  propertyId: string;
  title: string;
  requestor: string;
  requestorId: string;
  assignedTo: string;
  assignedToId: string;
  description: string;
  ticketType: string;
  status: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
}
```

### 3.3 Field Type Summary

**Supported Edm Types Used:**
- `Edm.String` - Text fields
- `Edm.Int32` - Integer numbers (bedrooms, priority)
- `Edm.Double` - Decimal numbers (price, bathrooms, squareFeet)
- `Edm.Boolean` - True/false flags
- `Edm.DateTimeOffset` - Timestamps
- `Edm.GeographyPoint` - Geographic coordinates (lat/long)
- `Collection(Edm.String)` - Arrays of strings
- `Collection(Edm.ComplexType)` - Arrays of nested objects
- `Edm.ComplexType` - Nested objects

**Field Capabilities:**
- `searchable` - Can be searched with full-text search
- `filterable` - Can be used in filter expressions
- `sortable` - Can be used for sorting results
- `facetable` - Can be used for faceted navigation
- `retrievable` - Returned in search results (default true)
- `key` - Unique identifier field

---

## 4. Search Operations

### 4.1 Property Search Implementation

**File:** `data-access/src/app/application-services/property/property.search.ts`

```typescript
export interface PropertySearchApi {
  propertiesSearch(input: PropertiesSearchInput): Promise<PropertySearchResult>;
}

export class PropertySearchApiImpl extends CognitiveSearchDataSource<AppContext> implements PropertySearchApi {
  
  async propertiesSearch(input: PropertiesSearchInput): Promise<PropertySearchResult> {
    let searchResults: SearchDocumentsResult<Pick<unknown, never>>;
    
    await this.withSearch(async (_passport, searchService) => {
      // Create index if it doesn't exist
      await searchService.createIndexIfNotExists(PropertyListingIndexSpec);

      // Prepare search string
      let searchString = '';
      if (!input.options.filter?.position) {
        searchString = input.searchString.trim();
      }

      // Build filter string
      let filterString = this.getFilterString(input.options.filter);

      // Execute search
      searchResults = await searchService.search('property-listings', searchString, {
        queryType: 'full',
        searchMode: 'all',
        includeTotalCount: true,
        filter: filterString,
        facets: input.options.facets,
        top: input.options.top,
        skip: input.options.skip,
        orderBy: input.options.orderBy,
      });
    });

    const results = this.convertToGraphqlResponse(searchResults, input);
    return results;
  }
  
  private getFilterString(filter: FilterDetail): string {
    let filterStrings = [];

    // Community filter (always applied)
    filterStrings.push(`communityId eq '${filter.communityId}'`);

    // Property type filter
    if (filter.propertyType && filter.propertyType.length > 0) {
      filterStrings.push(`search.in(type, '${filter.propertyType.join(',')}',',')`);
    }

    // Bedrooms filter (greater than or equal)
    if (filter.listingDetail?.bedrooms) {
      filterStrings.push(`bedrooms ge ${filter.listingDetail.bedrooms}`);
    }

    // Bathrooms filter
    if (filter.listingDetail?.bathrooms) {
      filterStrings.push(`bathrooms ge ${filter.listingDetail.bathrooms}`);
    }

    // Amenities filter (AND logic - all must match)
    if (filter.listingDetail?.amenities && filter.listingDetail.amenities.length > 0) {
      filterStrings.push(
        "amenities/any(a: a eq '" + 
        filter.listingDetail.amenities.join("') and amenities/any(a: a eq '") + 
        "')"
      );
    }

    // Additional amenities filter (nested object arrays)
    if (filter.listingDetail?.additionalAmenities && filter.listingDetail.additionalAmenities.length > 0) {
      const additionalAmenitiesFilterStrings = filter.listingDetail.additionalAmenities.map((additionalAmenity) => {
        return `additionalAmenities/any(ad: ad/category eq '${additionalAmenity.category}' and ad/amenities/any(am: am eq '${additionalAmenity.amenities.join(
          "') and ad/amenities/any(am: am eq '"
        )}'))`;
      });
      filterStrings.push(additionalAmenitiesFilterStrings.join(' and '));
    }

    // Price range filter
    if (filter.listingDetail?.prices && filter.listingDetail.prices.length > 0) {
      filterStrings.push(`price ge ${filter.listingDetail.prices[0]} and price le ${filter.listingDetail.prices[1]}`);
    }

    // Square feet range filter
    if (filter.listingDetail?.squareFeets && filter.listingDetail.squareFeets.length > 0) {
      filterStrings.push(`squareFeet ge ${filter.listingDetail.squareFeets[0]} and squareFeet le ${filter.listingDetail.squareFeets[1]}`);
    }

    // Listed info filter (OR logic)
    if (filter.listedInfo && filter.listedInfo.length > 0) {
      let listedInfoFilterStrings = [];
      if (filter.listedInfo.includes('listedForSale')) {
        listedInfoFilterStrings.push('listedForSale eq true');
      }
      if (filter.listedInfo.includes('listedForRent')) {
        listedInfoFilterStrings.push('listedForRent eq true');
      }
      if (filter.listedInfo.includes('listedForLease')) {
        listedInfoFilterStrings.push('listedForLease eq true');
      }
      filterStrings.push('(' + listedInfoFilterStrings.join(' or ') + ')');
    }

    // Geospatial filter (distance from point)
    if (filter.position && filter.distance !== undefined) {
      filterStrings.push(
        `geo.distance(position, geography'POINT(${filter.position.longitude} ${filter.position.latitude})') le ${filter.distance}`
      );
    }

    // Updated date filter (days ago)
    if (filter.updatedAt) {
      const day0 = dayjs().subtract(parseInt(filter.updatedAt), 'day').toISOString();
      filterStrings.push(`updatedAt ge ${day0}`);
    }

    // Created date filter
    if (filter.createdAt) {
      const day0 = dayjs().subtract(parseInt(filter.createdAt), 'day').toISOString();
      filterStrings.push(`createdAt ge ${day0}`);
    }

    // Tags filter (OR logic)
    if (filter.tags && filter.tags.length > 0) {
      filterStrings.push("(tags/any(a: a eq '" + filter.tags.join("') or tags/any(a: a eq '") + "'))");
    }

    return filterStrings.join(' and ');
  }
}
```

### 4.2 Service Ticket Search Implementation

**File:** `data-access/src/app/application-services/cases/service-ticket/v1/service-ticket.search.ts`

```typescript
export interface ServiceTicketV1SearchApi {
  serviceTicketsSearch(input: ServiceTicketsSearchInput, requestorId: string): Promise<SearchDocumentsResult<Pick<unknown, never>>>;
  serviceTicketsSearchAdmin(input: ServiceTicketsSearchInput, communityId: string): Promise<SearchDocumentsResult<Pick<unknown, never>>>;
  getServiceTicketsSearchResults(searchResults: SearchDocumentsResult<Pick<unknown, never>>): Promise<ServiceTicketsSearchResult>;
  reIndexServiceTickets(): Promise<SearchDocumentsResult<Pick<unknown, never>>>;
}

export class ServiceTicketV1SearchApiImpl extends CognitiveSearchDataSource<AppContext> implements ServiceTicketV1SearchApi {
  
  async serviceTicketsSearch(input: ServiceTicketsSearchInput, memberId: string): Promise<SearchDocumentsResult<Pick<unknown, never>>> {
    let searchString = input.searchString.trim();
    let filterString = this.getFilterString(input.options.filter, memberId);

    let searchResults: SearchDocumentsResult<Pick<unknown, never>>;
    await this.withSearch(async (_passport, search) => {
      searchResults = await search.search('service-ticket-index', searchString, {
        queryType: 'full',
        searchMode: 'all',
        includeTotalCount: true,
        filter: filterString,
        facets: input.options.facets,
        top: input.options.top,
        skip: input.options.skip,
        orderBy: input.options.orderBy,
      });
    });

    return searchResults;
  }

  async serviceTicketsSearchAdmin(input: ServiceTicketsSearchInput, communityId: string): Promise<SearchDocumentsResult<Pick<unknown, never>>> {
    let searchString = input?.searchString?.trim() ?? '';
    let filterString = this.getFilterStringAdmin(input?.options?.filter, communityId);

    let searchResults: SearchDocumentsResult<Pick<unknown, never>>;
    await this.withSearch(async (_passport, search) => {
      searchResults = await search.search('service-ticket-index', searchString, {
        queryType: 'full',
        searchMode: 'all',
        includeTotalCount: true,
        filter: filterString,
        top: input.options.top,
        skip: input.options.skip,
      });
    });

    return searchResults;
  }

  private getFilterString(filter: ServiceTicketsSearchFilterDetail, memberId: string): string {
    let filterStrings = [];
    
    // Security filter - only show tickets where user is requestor or assignee
    filterStrings.push(`(requestorId eq '${memberId}') or (assignedToId eq '${memberId}')`);

    if (filter) {
      if (filter.requestorId && filter.requestorId.length > 0) {
        filterStrings.push(`search.in(requestorId, '${filter.requestorId.join(',')}',',')`);
      }
      if (filter.assignedToId && filter.assignedToId.length > 0) {
        filterStrings.push(`search.in(assignedToId, '${filter.assignedToId.join(',')}',',')`);
      }
      if (filter.status && filter.status.length > 0) {
        filterStrings.push(`search.in(status, '${filter.status.join(',')}',',')`);
      }
      if (filter.priority && filter.priority.length > 0) {
        let priorityFilter = [];
        filter.priority.forEach((priority) => {
          priorityFilter.push(`priority eq ${priority}`);
        });
        filterStrings.push(`(${priorityFilter.join(' or ')})`);
      }
    }

    return filterStrings.join(' and ');
  }

  private getFilterStringAdmin(filter: ServiceTicketsSearchFilterDetail, communityId: string): string {
    let filterStrings = [];
    filterStrings.push(`(communityId eq '${communityId}')`);
    
    // Similar filters as above but without security restriction
    // ... (similar filter logic)
    
    return filterStrings.join(' and ');
  }

  async getServiceTicketsSearchResults(searchResults: SearchDocumentsResult<Pick<unknown, never>>): Promise<ServiceTicketsSearchResult> {
    let results = [];
    for await (const result of searchResults?.results ?? []) {
      results.push(result.document);
    }
    return {
      serviceTicketsResults: results,
      count: searchResults?.count,
      facets: {
        requestor: searchResults?.facets?.requestor,
        assignedTo: searchResults?.facets?.assignedTo,
        priority: searchResults?.facets?.priority,
        status: searchResults?.facets?.status,
        requestorId: searchResults?.facets?.requestorId,
        assignedToId: searchResults?.facets?.assignedToId,
      },
    };
  }
}
```

### 4.3 Search Query Options

**Common Search Options Used:**

```typescript
interface SearchOptions {
  queryType: 'simple' | 'full';        // Query parser type
  searchMode: 'any' | 'all';           // Match any or all search terms
  includeTotalCount: boolean;           // Include total result count
  filter: string;                       // OData filter expression
  facets: string[];                     // Fields to facet on
  top: number;                          // Results per page (pagination)
  skip: number;                         // Results to skip (pagination)
  orderBy: string[];                    // Sort expressions
}
```

**Typical Search Call:**
```typescript
const results = await searchService.search('index-name', 'search text', {
  queryType: 'full',
  searchMode: 'all',
  includeTotalCount: true,
  filter: "communityId eq '123' and price ge 100000",
  facets: ['type', 'bedrooms', 'tags'],
  top: 10,
  skip: 0,
  orderBy: ['price desc', 'updatedAt desc']
});
```

### 4.4 Facet Processing

**Dynamic Facet Calculation for Bedrooms:**
```typescript
const bedroomsOptions = [1, 2, 3, 4, 5];
let bedroomsFacet = bedroomsOptions.map((option) => {
  const found = searchResults?.facets?.bedrooms?.filter((facet) => facet.value >= option);
  let count = 0;
  found.forEach((f) => {
    count += f.count;
  });
  return {
    value: option + '+',
    count: count,
  };
});
```

**Time-based Facets:**
```typescript
const periods = [7, 14, 30, 90];
const periodTextMaps = {
  7: '1 week ago',
  14: '2 weeks ago',
  30: '1 month ago',
  90: '3 months ago',
};

let updatedAtFacet = periods.map((option) => {
  const day0 = dayjs().subtract(option, 'day');
  const found = searchResults?.facets?.updatedAt?.filter((facet) => {
    let temp = dayjs(facet.value).diff(day0, 'day', true);
    return temp >= 0;
  });
  let count = 0;
  found.forEach((f) => { count += f.count; });
  return {
    value: periodTextMaps[option],
    count: count,
  };
});
```

### 4.5 Pagination Pattern

```typescript
// URL parameters
const page = parseInt(searchParams.get('page') ?? '1') - 1;  // 0-indexed
const top = parseInt(searchParams.get('top') ?? '10');
const skip = page * top;

// Search options
{
  top: top,    // Results per page: 10, 15, 20
  skip: skip   // Offset: 0, 10, 20, 30...
}
```

### 4.6 Sorting Pattern

```typescript
// Single field sort
orderBy: ['price desc']

// Multiple field sort
orderBy: ['price desc', 'updatedAt desc', 'bedrooms asc']

// From UI
const orderBy = searchParams.get('sort') ?? '';  // e.g., "price desc"
```

---

## 5. Data Indexing

### 5.1 Event-Driven Index Updates

**Domain Events Registered:**

**File:** `data-access/src/app/domain/domain-impl.ts`

```typescript
const RegisterEventHandlers = (
  datastore: DatastoreDomain,
  cognitiveSearch: CognitiveSearchDomain,
  blobStorage: BlobStorageDomain,
  payment: PaymentDomain,
  vercel: VercelDomain
) => {
  // Property events
  RegisterPropertyDeletedUpdateSearchIndexHandler(cognitiveSearch);
  RegisterPropertyUpdatedUpdateSearchIndexHandler(cognitiveSearch, datastore.propertyUnitOfWork);
  
  // Service Ticket events
  RegisterServiceTicketV1UpdatedUpdateSearchIndexHandler(cognitiveSearch, datastore.serviceTicketV1UnitOfWork);
  RegisterServiceTicketV1DeletedUpdateSearchIndexHandler(cognitiveSearch);
  
  // Violation Ticket events
  RegisterViolationTicketV1UpdatedUpdateSearchIndexHandler(cognitiveSearch, datastore.violationTicketV1UnitOfWork);
  RegisterViolationTicketV1DeletedUpdateSearchIndexHandler(cognitiveSearch);
};
```

### 5.2 Property Index Update Handler

**File:** `data-access/src/app/domain/events/handlers/property-updated-update-search-index.ts`

```typescript
export default (cognitiveSearch: CognitiveSearchDomain, propertyUnitOfWork: PropertyUnitOfWork) => {
  EventBusInstance.register(PropertyUpdatedEvent, async (payload) => {
    const tracer = trace.getTracer('PG:data-access');
    tracer.startActiveSpan('updateSearchIndex', async (span) => {
      try {
        const logger = logs.getLogger('default');
        logger.emit({
          body: `Property Updated - Search Index Integration: ${JSON.stringify(payload)} and PropertyId: ${payload.id}`,
          severityNumber: SeverityNumber.INFO,
          severityText: 'INFO',
        });

        const context = SystemDomainExecutionContext();
        await propertyUnitOfWork.withTransaction(context, SystemInfrastructureContext(), async (repo) => {
          let updatedProperty = await repo.getById(payload.id);
          let indexDoc = convertToIndexDocument(updatedProperty);
          const newHash = generateHash(indexDoc);

          // Hash-based change detection
          if (updatedProperty.hash === newHash) {
            console.log(`Updated Property hash [${newHash}] is same as previous hash`);
            span.setStatus({ code: SpanStatusCode.OK, message: 'Index update skipped' });
          } else {
            console.log(`Updated Property hash [${newHash}] is different from previous hash`);
            span.addEvent('Property hash is different from previous hash');
            
            try {
              const indexedAt = await updateSearchIndexWithRetry(cognitiveSearch, PropertyListingIndexSpec, indexDoc, 3);
              updatedProperty.LastIndexed = indexedAt;
              updatedProperty.Hash = newHash;
            } catch (error) {
              span.setStatus({ code: SpanStatusCode.ERROR, message: 'Index update failed' });
              updatedProperty.UpdateIndexFailedDate = new Date();
              console.log('Index update failed: ', updatedProperty.UpdateIndexFailedDate);
            }
            await repo.save(updatedProperty);
            span.setStatus({ code: SpanStatusCode.OK, message: 'Index update successful' });
          }
        });
        span.end();
      } catch (ex) {
        span.recordException(ex);
        span.setStatus({ code: SpanStatusCode.ERROR, message: ex.message });
        span.end();
        throw ex;
      }
    });
  });
};

function convertToIndexDocument(property: Property<PropertyProps>) {
  const updatedAdditionalAmenities = property.listingDetail?.additionalAmenities?.map((additionalAmenity) => {
    return { category: additionalAmenity.category, amenities: additionalAmenity.amenities };
  });

  const coordinates = property.location?.position?.coordinates;
  let geoGraphyPoint: GeographyPoint = null;
  if (coordinates && coordinates.length === 2) {
    geoGraphyPoint = new GeographyPoint({ longitude: coordinates[1], latitude: coordinates[0] });
  }

  const updatedDate = dayjs(property.updatedAt.toISOString().split('T')[0]).toISOString();
  const createdDate = dayjs(property.createdAt.toISOString().split('T')[0]).toISOString();

  let listingDoc: Partial<PropertyListingIndexDocument> = {
    id: property.id,
    communityId: property.community.id,
    name: property.propertyName,
    type: property.propertyType?.toLowerCase(),
    bedrooms: property.listingDetail?.bedrooms,
    amenities: property.listingDetail?.amenities,
    additionalAmenities: updatedAdditionalAmenities,
    price: property.listingDetail?.price,
    bathrooms: property.listingDetail?.bathrooms,
    squareFeet: property.listingDetail?.squareFeet,
    position: geoGraphyPoint,
    images: property.listingDetail?.images,
    listingAgentCompany: property.listingDetail?.listingAgentCompany,
    address: {
      streetNumber: property.location?.address?.streetNumber,
      streetName: property.location?.address?.streetName,
      municipality: property.location?.address?.municipality,
      // ... all address fields
    },
    listedForSale: property.listedForSale,
    listedForRent: property.listedForRent,
    listedForLease: property.listedForLease,
    updatedAt: updatedDate,
    createdAt: createdDate,
    tags: property.tags,
  };
  return listingDoc;
}
```

### 5.3 Retry Logic with Exponential Backoff

**File:** `data-access/src/app/domain/events/handlers/update-search-index-helpers.ts`

```typescript
import crypto from "crypto";
import { CognitiveSearchDomain } from "../../infrastructure/cognitive-search/interfaces";
import retry from "async-retry";
import { SearchIndex } from "@azure/search-documents";

export const generateHash = (indexDoc: Partial<any>) => {
  const docCopy = JSON.parse(JSON.stringify(indexDoc));
  delete docCopy.updatedAt;
  return crypto.createHash("sha256").update(JSON.stringify(docCopy)).digest("base64");
};

const updateSearchIndex = async (cognitiveSearch: CognitiveSearchDomain, indexDefinition: SearchIndex, indexDoc: Partial<any>) => {
  // Create index if it doesn't exist
  await cognitiveSearch.createIndexIfNotExists(indexDefinition);
  await cognitiveSearch.indexDocument(indexDefinition.name, indexDoc);
  console.log(`ID Case Updated - Index Updated: ${JSON.stringify(indexDoc)}`);
};

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
```

### 5.4 Service Ticket Index Update

**File:** `data-access/src/app/domain/events/handlers/service-ticket-v1-updated-update-search-index.ts`

```typescript
export default (
  cognitiveSearch: CognitiveSearchDomain,
  serviceTicketV1UnitOfWork: ServiceTicketV1UnitOfWork
) => { 
  EventBusInstance.register(ServiceTicketV1UpdatedEvent, async (payload) => {
    console.log(`Service Ticket Updated - Search Index Integration: ${JSON.stringify(payload)}`);

    const context = SystemDomainExecutionContext();
    await serviceTicketV1UnitOfWork.withTransaction(context, SystemInfrastructureContext(), async (repo) => {
      let serviceTicket = await repo.getById(payload.id);

      const updatedDate = dayjs(serviceTicket.updatedAt.toISOString().split('T')[0]).toISOString();
      const createdDate = dayjs(serviceTicket.createdAt.toISOString().split('T')[0]).toISOString();

      let serviceTicketDoc: Partial<ServiceTicketIndexDocument> = {
        id: serviceTicket.id,
        communityId: serviceTicket.community.id,
        propertyId: serviceTicket.property.id,
        title: serviceTicket.title,
        requestor: serviceTicket.requestor.memberName,
        requestorId: serviceTicket.requestor.id,
        assignedTo: serviceTicket.assignedTo?.memberName ?? '',
        assignedToId: serviceTicket.assignedTo?.id ?? '',
        description: serviceTicket.description,
        ticketType: serviceTicket.ticketType,
        status: serviceTicket.status,
        priority: serviceTicket.priority,
        createdAt: createdDate,
        updatedAt: updatedDate,
      };

      let serviceTicketDocCopy = JSON.parse(JSON.stringify(serviceTicketDoc));
      delete serviceTicketDocCopy.updatedAt;
      const hash = crypto.createHash('sha256').update(JSON.stringify(serviceTicketDocCopy)).digest('base64');

      const maxAttempt = 3;
      if (serviceTicket.hash !== hash) {
        await retry(
          async (failedCB, currentAttempt) => {
            if (currentAttempt > maxAttempt) {
              serviceTicket.UpdateIndexFailedDate = new Date();
              serviceTicket.Hash = hash;
              await repo.save(serviceTicket);
              console.log('Index update failed: ', serviceTicket.updateIndexFailedDate);
              return;
            }
            await updateSearchIndex(serviceTicketDoc, serviceTicket, hash, repo);
          },
          { retries: maxAttempt }
        );
      }
    });
  });

  async function updateSearchIndex(
    serviceTicketDoc: Partial<ServiceTicketIndexDocument>,
    serviceTicket: ServiceTicketV1<ServiceTicketV1Props>,
    hash: any,
    repo: ServiceTicketV1Repository<ServiceTicketV1Props>,
  ) {
    await cognitiveSearch.createOrUpdateIndexDefinition(ServiceTicketIndexSpec.name, ServiceTicketIndexSpec);
    await cognitiveSearch.indexDocument(ServiceTicketIndexSpec.name, serviceTicketDoc);
    console.log(`Service Ticket Updated - Index Updated: ${JSON.stringify(serviceTicketDoc)}`);

    serviceTicket.LastIndexed = new Date();
    serviceTicket.Hash = hash;
    await repo.save(serviceTicket);
    console.log('Index update successful: ', serviceTicket.lastIndexed);
  }
};
```

### 5.5 Delete from Index

**File:** `data-access/src/app/domain/events/handlers/service-ticket-v1-deleted-update-search-index.ts`

```typescript
export default (cognitiveSearch: CognitiveSearchDomain) => { 
  EventBusInstance.register(ServiceTicketV1DeletedEvent, async (payload) => {
    console.log(`Service Ticket Deleted - Search Index Integration: ${JSON.stringify(payload)}`);

    let serviceTicketDoc: Partial<ServiceTicketIndexDocument> = {
      id: payload.id,
    };
    await cognitiveSearch.deleteDocument(ServiceTicketIndexSpec.name, serviceTicketDoc);
  });
};
```

### 5.6 Bulk Re-indexing

**File:** `data-access/src/app/application-services/cases/service-ticket/v1/service-ticket.search.ts`

```typescript
async reIndexServiceTickets(): Promise<SearchDocumentsResult<Pick<unknown, never>>> {
  // Drop and recreate index
  await this.withSearch(async (_passport, searchService) => {
    await searchService.deleteIndex(ServiceTicketIndexSpec.name);
    await searchService.createIndexIfNotExists(ServiceTicketIndexSpec);
  });

  const context = await ReadOnlyDomainExecutionContext();
  const ids = await this.context.applicationServices.service.dataApi.getAllIds();

  await ServiceTicketV1UnitOfWork.withTransaction(context, ReadOnlyInfrastructureContext(), async (repo) => {
    const searchDocs: Partial<ServiceTicketIndexDocument>[] = [];

    // Loop through all documents
    for await (const id of ids) {
      const doc = await repo.getById(id.id.toString());

      const updatedDate = dayjs(doc.updatedAt.toISOString().split('T')[0]).toISOString();
      const createdDate = dayjs(doc.createdAt.toISOString().split('T')[0]).toISOString();

      let serviceTicketIndexDoc: Partial<ServiceTicketIndexDocument> = {
        id: doc.id,
        communityId: doc.community.id,
        propertyId: doc.property.id,
        title: doc.title,
        requestor: doc.requestor.memberName,
        requestorId: doc.requestor.id,
        assignedTo: doc.assignedTo?.memberName ?? '',
        assignedToId: doc.assignedTo?.id ?? '',
        description: doc.description,
        ticketType: doc.ticketType,
        status: doc.status,
        priority: doc.priority,
        createdAt: createdDate,
        updatedAt: updatedDate,
      };

      searchDocs.push(serviceTicketIndexDoc);
      
      // Index document
      await this.withSearch(async (_passport, searchService) => {
        await searchService.indexDocument(ServiceTicketIndexSpec.name, serviceTicketIndexDoc);
      });
    }
  });

  return this.serviceTicketsSearch(/* default search */, '');
}
```

### 5.7 Hash-Based Change Detection

**Purpose:** Avoid unnecessary index updates when data hasn't actually changed

```typescript
// Generate hash (excludes updatedAt field)
export const generateHash = (indexDoc: Partial<any>) => {
  const docCopy = JSON.parse(JSON.stringify(indexDoc));
  delete docCopy.updatedAt;
  return crypto.createHash("sha256").update(JSON.stringify(docCopy)).digest("base64");
};

// Compare hashes
if (updatedProperty.hash === newHash) {
  console.log('No changes detected, skipping index update');
  return;
}

// Store hash on entity
updatedProperty.Hash = newHash;
updatedProperty.LastIndexed = new Date();
await repo.save(updatedProperty);
```

---

## 6. Mock/Test Implementations

### 6.1 In-Memory Cognitive Search Implementation

**File:** `data-access/seedwork/services-seedwork-cognitive-search-in-memory/index.ts`

```typescript
import { BaseDocumentType, SearchIndex } from "./interfaces";

export interface IMemoryCognitiveSearch {
  createIndexIfNotExists(indexDefinition: SearchIndex): Promise<void>;
  createOrUpdateIndexDefinition(indexName: string, indexDefinition: SearchIndex): Promise<void>;
  deleteDocument(indexName: string, document: any): Promise<void>;
  indexDocument(indexName: string, document: any): Promise<void>;
  search(indexName: string, searchText: string, options?: any): Promise<any>;
  indexExists(indexName: string): Promise<boolean>;
  logSearchCollectionIndexMap(): void;
}

export class MemoryCognitiveSearchCollection<DocumentType extends BaseDocumentType> {
  private searchCollection: DocumentType[] = [];

  constructor () {}
  
  async indexDocument(document: DocumentType): Promise<void> {
    const existingDocument = this.searchCollection.find((i) => i.id === document.id);
    if (existingDocument) {
      const index = this.searchCollection.indexOf(existingDocument);
      this.searchCollection[index] = document;
    } else {
      this.searchCollection.push(document);
    }
  }
  
  async deleteDocument(document: DocumentType): Promise<void> {
    this.searchCollection = this.searchCollection.filter((i) => i.id !== document.id);
  }
}

export class MemoryCognitiveSearch implements IMemoryCognitiveSearch, CognitiveSearchDomain {
  private searchCollectionIndexMap: Map<string, MemoryCognitiveSearchCollection<any>>;
  private searchCollectionIndexDefinitionMap: Map<string, SearchIndex>;

  constructor() {
    this.searchCollectionIndexMap = new Map<string, MemoryCognitiveSearchCollection<any>>();
    this.searchCollectionIndexDefinitionMap = new Map<string, SearchIndex>();
  }

  initializeSearchClients(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  
  deleteIndex(indexName: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async createIndexIfNotExists(indexDefinition: SearchIndex): Promise<void> {
    if (this.searchCollectionIndexMap.has(indexDefinition.name)) {
      return;
    }
    this.createNewIndex(indexDefinition.name, indexDefinition);
  }

  private createNewIndex(indexName: string, indexDefinition: SearchIndex) {
    this.searchCollectionIndexDefinitionMap.set(indexName, indexDefinition);
    this.searchCollectionIndexMap.set(indexName, new MemoryCognitiveSearchCollection());
  }

  async createOrUpdateIndexDefinition(indexName: string, indexDefinition: SearchIndex): Promise<void> {
    if (this.searchCollectionIndexMap.has(indexName)) return;
    this.createNewIndex(indexName, indexDefinition);
  }

  async deleteDocument(indexName: string, document: any): Promise<void> {
    const collection = this.searchCollectionIndexMap.get(indexName);
    if (collection) {
      collection.deleteDocument(document);
    }
  }

  async indexDocument(indexName: string, document: any): Promise<void> {
    const collection = this.searchCollectionIndexMap.get(indexName);
    if (collection) {
      collection.indexDocument(document);
    }
  }

  async search(indexName: string, searchText: string, options?: any): Promise<any> {
    throw new Error('MemoryCognitiveSearch:search - Method not implemented.');
  }

  logSearchCollectionIndexMap() {
    for (const [key, value] of this.searchCollectionIndexMap.entries()) {
      console.log(`Index: ${key} |  Documents: ${JSON.stringify(value)}`);
    }
  } 

  async indexExists(indexName: string): Promise<boolean> {
    return this.searchCollectionIndexMap.has(indexName);
  }
}
```

**Interface Definitions:**

**File:** `data-access/seedwork/services-seedwork-cognitive-search-in-memory/interfaces.ts`

```typescript
export interface BaseDocumentType {
  id: string;
}

export declare interface SearchIndex {
  name: string;
  fields: any[];
}
```

### 6.2 Testing with In-Memory Implementation

**Usage in BDD Tests:**

**File:** `data-access/screenplay/abilities/domain/io/test/domain-infrastructure.ts`

```typescript
// In-memory implementations used for testing
const cognitiveSearch = new MemoryCognitiveSearch();
const blobStorage = new InMemoryBlobStorage();
const contentModerator = new MockContentModerator();

// Used in test domain initialization
const domain = new DomainImpl(
  datastore,
  cognitiveSearch,
  blobStorage,
  payment,
  vercel
);
```

### 6.3 Test Examples

**File:** `data-access/seedwork/services-seedwork-cognitive-search-az/index.test.ts`

```typescript
import { AzCognitiveSearch } from './index';

beforeAll(() => {
  if (!process.env.SEARCH_API_KEY || !process.env.SEARCH_API_ENDPOINT) {
    throw new Error('SEARCH_API_KEY and SEARCH_API_ENDPOINT must be defined.');
  }
});

let cognitiveSearch;

beforeEach(() => {
  const endpoint = process.env.SEARCH_API_ENDPOINT;
  cognitiveSearch = new AzCognitiveSearch(endpoint);
});

test.skip('Initialize cognitive search object', () => {
  expect(cognitiveSearch).toBeDefined();
});

test.skip('cognitive search success', async () => {
  const search = await cognitiveSearch.search('property-listings', 'beach', {
    queryType: 'full',
    searchMode: 'all',
    includeTotalCount: true,
    filter: `communityId eq '625641815f0e5d472135046c'`,
    facets: [
      'type,count:1000',
      'additionalAmenities/category',
      'additionalAmenities/amenities,count:1000',
      'amenities,count:1000',
      'listedForLease,count:1000',
      'listedForSale,count:1000',
      'listedForRent,count:1000',
      'bedrooms,count:1000',
      'bathrooms,count:1000',
      'updatedAt,count:1000',
      'createdAt,count:1000',
      'tags,count:1000',
    ],
    top: 10,
    skip: 0,
  });
  expect(search).toBeDefined();
  expect(search.count).toBeGreaterThan(0);
});
```

---

## 7. Service Layer Integration

### 7.1 Infrastructure Services Architecture

**File:** `data-access/src/app/infrastructure-services/index.ts`

```typescript
export interface InfrastructureServices {
  vercel: VercelInfrastructureService;
  contentModerator: ContentModeratorInfrastructureService;
  cognitiveSearch: CognitiveSearchInfrastructureService;
  blobStorage: BlobStorageInfrastructureService;
  payment: PaymentInfrastructureService;
  datastore: DatastoreInfrastructureService;
  maps: MapsInfrastructureService;
}
```

### 7.2 Cognitive Search Service Interface

**File:** `data-access/src/app/infrastructure-services/cognitive-search/index.ts`

```typescript
import { CognitiveSearchDomain, CognitiveSearchDomainInitializeable } from "../../domain/infrastructure/cognitive-search/interfaces";

export interface CognitiveSearchInfrastructureService extends CognitiveSearchDomain, CognitiveSearchDomainInitializeable {
  search(indexName: string, searchText: string, options?: any): Promise<any>;
}
```

**Domain Interface:**

**File:** `data-access/src/app/domain/infrastructure/cognitive-search/interfaces.ts`

```typescript
import { CognitiveSearchBase } from '../../../../../seedwork/services-seedwork-cognitive-search-interfaces';

export interface CognitiveSearchDomain extends CognitiveSearchBase {}

export interface CognitiveSearchDomainInitializeable {
  startup(): Promise<void>;
  shutdown(): Promise<void>;
}
```

### 7.3 Data Source Base Class Pattern

**File:** `data-access/src/app/data-sources/cognitive-search-data-source.ts`

```typescript
import { DataSource } from "./data-source";
import { CognitiveSearchInfrastructureService } from "../infrastructure-services/cognitive-search";
import { AppContext } from "../init/app-context-builder";
import { Passport } from "../init/passport";

export class CognitiveSearchDataSource<Context extends AppContext> extends DataSource<Context> {

  public get context(): Context {
    return this._context;
  }

  public async withSearch(func: (passport: Passport, search: CognitiveSearchInfrastructureService) => Promise<void>): Promise<void> {
    let passport = this._context.passport; 
    let cognitiveSearch = this._context.infrastructureServices.cognitiveSearch;
    await func(passport, cognitiveSearch);
  }
}
```

### 7.4 Application Services Integration

**Property API Structure:**

**File:** `data-access/src/app/application-services/property/index.ts`

```typescript
export interface PropertyApi { 
  blobApi: PropertyBlobApi,
  dataApi: PropertyDataApi,
  domainApi: PropertyDomainApi,
  searchApi: PropertySearchApi,    // <-- Search API
  mapApi: PropertyMapsApi,
}

export class PropertyApiImpl implements PropertyApi {
  blobApi: PropertyBlobApi;
  dataApi: PropertyDataApi;
  domainApi: PropertyDomainApi;
  searchApi: PropertySearchApi;
  mapApi: PropertyMapsApi;

  constructor(context: AppContext) {
    this.blobApi = new PropertyBlobApiImpl({ context });
    this.dataApi = new PropertyDataApiImpl({ modelOrCollection: PropertyModel, context });
    this.domainApi = new PropertyDomainApiImpl({ unitOfWork: PropertyUnitOfWork, context });
    this.searchApi = new PropertySearchApiImpl({ context });  // <-- Instantiation
    this.mapApi = new PropertyMapsApiImpl({ context });
  }
}
```

**Service Ticket API Structure:**

**File:** `data-access/src/app/application-services/cases/service-ticket/v1/index.ts`

```typescript
export interface ServiceTicketV1Api {
  domainApi: ServiceTicketV1DomainApi;
  dataApi: ServiceTicketV1DataApi;
  searchApi: ServiceTicketV1SearchApi;  // <-- Search API
}

export class ServiceTicketV1ApiImpl implements ServiceTicketV1Api {
  domainApi: ServiceTicketV1DomainApi;
  dataApi: ServiceTicketV1DataApi;
  searchApi: ServiceTicketV1SearchApi;

  constructor(context: AppContext) {
    this.domainApi = new ServiceTicketV1DomainApiImpl({ unitOfWork: ServiceTicketV1UnitOfWork, context });
    this.dataApi = new ServiceTicketV1DataApiImpl({ modelOrCollection: ServiceTicketModel, context });
    this.searchApi = new ServiceTicketV1SearchApiImpl({ context });  // <-- Instantiation
  }
}
```

### 7.5 GraphQL Resolvers Integration

**Property Resolver:**

**File:** `data-access/src/functions/http-graphql/schema/types/property.resolvers.ts` (Lines 64-67)

```typescript
const property: Resolvers = {
  Query: {
    propertiesSearch: async (_, { input }, context, info) => {
      const searchResults = await context.applicationServices.property.searchApi.propertiesSearch(input);
      return searchResults
    },
  },
};
```

**Service Ticket Resolver:**

**File:** `data-access/src/functions/http-graphql/schema/types/service-ticket.resolvers.ts` (Lines 102-114)

```typescript
const serviceTicket: Resolvers = {
  Query: {
    serviceTicketsSearchAdmin: async (_, { input }, context, info) => {
      const searchResults = await context.applicationServices.cases.serviceTicket.v1.searchApi.serviceTicketsSearchAdmin(input, context.community?.id);
      return await context.applicationServices.cases.serviceTicket.v1.searchApi.getServiceTicketsSearchResults(searchResults);
    },
    
    serviceTicketsSearch: async (_, { input }, context, info) => {
      const member = await getMemberForCurrentUser(context);
      const searchResults = await context.applicationServices.cases.serviceTicket.v1.searchApi.serviceTicketsSearch(input, member.id);
      return await context.applicationServices.cases.serviceTicket.v1.searchApi.getServiceTicketsSearchResults(searchResults);
    },
    
    serviceTicketReIndex: async (_, _args, context, info) => {
      const searchResults = await context.applicationServices.cases.serviceTicket.v1.searchApi.reIndexServiceTickets();
      return await context.applicationServices.cases.serviceTicket.v1.searchApi.getServiceTicketsSearchResults(searchResults);
    }
  },
};
```

### 7.6 Domain Initialization

**File:** `data-access/src/app/domain/domain-impl.ts` (Lines 66-88)

```typescript
export class DomainImpl<
  DatastoreImpl extends DatastoreDomain & DatastoreDomainInitializeable,
  CognitiveSearchImpl extends CognitiveSearchDomain & CognitiveSearchDomainInitializeable
>{
  constructor(
    private _datastoreImpl: DatastoreImpl,
    private _cognitiveSearchImpl: CognitiveSearchImpl,
    private _blobStorageImpl: BlobStorageDomain,
    private _paymentImpl: PaymentDomain,
    private _vercelImpl: VercelDomain,
  ) {}

  public async startup(): Promise<void> {
    console.log('custom-log | DomainImpl | startup');
    this._datastoreImpl.startup();
    this._cognitiveSearchImpl.startup();
    // Event handlers registered after services start
    RegisterEventHandlers(
      this._datastoreImpl,
      this._cognitiveSearchImpl,
      this._blobStorageImpl,
      this._paymentImpl,
      this._vercelImpl
    );
  }

  public async shutdown(): Promise<void> {
    StopEventHandlers();
    this._cognitiveSearchImpl.shutdown();
    this._datastoreImpl.shutdown();
    console.log('custom-log | DomainImpl | shutdown');
  }

  public get cognitiveSearch(): Omit<CognitiveSearchImpl, keyof CognitiveSearchDomainInitializeable> {
    return this._cognitiveSearchImpl;
  }
}
```

---

## 8. Code Examples

### 8.1 Complete Filter Expression Examples

**Multi-Criteria Property Search:**
```typescript
// Community filter (required)
communityId eq '625641815f0e5d472135046c'

// Property type (multiple values - OR logic)
and search.in(type, 'condo,townhouse,apartment',',')

// Bedrooms (minimum)
and bedrooms ge 2

// Price range
and price ge 100000 and price le 500000

// Amenities (all must match - AND logic)
and amenities/any(a: a eq 'Pool') and amenities/any(a: a eq 'Gym')

// Geospatial (within distance)
and geo.distance(position, geography'POINT(-122.123 37.456)') le 5

// Listed status (OR logic)
and (listedForSale eq true or listedForRent eq true)

// Updated recently
and updatedAt ge 2025-10-02T00:00:00.000Z

// Tags (OR logic)
and (tags/any(a: a eq 'luxury') or tags/any(a: a eq 'waterfront'))
```

**Complete Filter String:**
```typescript
const filter = "communityId eq '625641815f0e5d472135046c' and search.in(type, 'condo,townhouse',',') and bedrooms ge 2 and price ge 100000 and price le 500000 and amenities/any(a: a eq 'Pool') and amenities/any(a: a eq 'Gym') and geo.distance(position, geography'POINT(-122.123 37.456)') le 5 and (listedForSale eq true or listedForRent eq true) and updatedAt ge 2025-10-02T00:00:00.000Z and (tags/any(a: a eq 'luxury') or tags/any(a: a eq 'waterfront'))";
```

### 8.2 Complex Nested Object Filter

**Additional Amenities (Collection of Complex Types):**
```typescript
// Filter for properties with outdoor amenities (BBQ and Fire Pit)
const filter = `additionalAmenities/any(ad: ad/category eq 'Outdoor' and ad/amenities/any(am: am eq 'BBQ') and ad/amenities/any(am: am eq 'Fire Pit'))`;

// Multiple categories
const filter = `additionalAmenities/any(ad: ad/category eq 'Outdoor' and ad/amenities/any(am: am eq 'BBQ')) and additionalAmenities/any(ad: ad/category eq 'Indoor' and ad/amenities/any(am: am eq 'Fireplace'))`;
```

### 8.3 Facet Request Examples

**Comprehensive Facet List:**
```typescript
const facets = [
  'type,count:1000',                              // Property type facets (up to 1000)
  'additionalAmenities/category',                 // Nested field facet
  'additionalAmenities/amenities,count:1000',    // Nested collection facet
  'amenities,count:1000',                         // Simple collection facet
  'listedForLease,count:1000',                   // Boolean facet
  'listedForSale,count:1000',
  'listedForRent,count:1000',
  'bedrooms,count:1000',                         // Numeric facet
  'bathrooms,count:1000',
  'updatedAt,count:1000',                        // Date facet
  'createdAt,count:1000',
  'tags,count:1000',                             // Tag facet
];
```

**Facet Response Structure:**
```typescript
{
  facets: {
    type: [
      { value: 'condo', count: 45 },
      { value: 'townhouse', count: 32 },
      { value: 'apartment', count: 18 }
    ],
    bedrooms: [
      { value: 1, count: 12 },
      { value: 2, count: 38 },
      { value: 3, count: 29 },
      { value: 4, count: 16 }
    ],
    tags: [
      { value: 'luxury', count: 22 },
      { value: 'waterfront', count: 15 }
    ]
  }
}
```

### 8.4 Geography Point Construction

```typescript
import { GeographyPoint } from '@azure/search-documents';

// From coordinates array [latitude, longitude]
const coordinates = property.location?.position?.coordinates;
let geoGraphyPoint: GeographyPoint = null;
if (coordinates && coordinates.length === 2) {
  geoGraphyPoint = new GeographyPoint({ 
    longitude: coordinates[1], 
    latitude: coordinates[0] 
  });
}

// In filter expression (note: POINT uses lon/lat order)
const filter = `geo.distance(position, geography'POINT(${longitude} ${latitude})') le ${distanceInKm}`;
```

### 8.5 Date Filtering Examples

**Days Ago Pattern:**
```typescript
import dayjs from 'dayjs';

// Properties updated in last 7 days
const day0 = dayjs().subtract(7, 'day').toISOString();
const filter = `updatedAt ge ${day0}`;

// Properties created in last 30 days
const day0 = dayjs().subtract(30, 'day').toISOString();
const filter = `createdAt ge ${day0}`;

// Date range
const startDate = dayjs('2025-01-01').toISOString();
const endDate = dayjs('2025-10-09').toISOString();
const filter = `createdAt ge ${startDate} and createdAt le ${endDate}`;
```

---

## 9. Search Queries Used

### 9.1 Property Search Queries

**GraphQL Query:**

**File:** `ui-community/src/components/layouts/members/components/properties-list-search.container.graphql`

```graphql
query MemberPropertiesListSearchContainerProperties($input: PropertiesSearchInput!) {
  propertiesSearch(input: $input) {
    propertyResults {
      id
      communityId
      name
      type
      bedrooms
      bathrooms
      squareFeet
      price
      amenities
      additionalAmenities {
        category
        amenities
      }
      position {
        latitude
        longitude
      }
      images
      address {
        streetNumber
        streetName
        municipality
        postalCode
        country
      }
      listedForSale
      listedForRent
      listedForLease
      updatedAt
      createdAt
      tags
    }
    count
    facets {
      type { value count }
      amenities { value count }
      additionalAmenitiesCategory { value count }
      additionalAmenitiesAmenities { value count }
      bedrooms { value count }
      bathrooms { value count }
      listedForSale { value count }
      listedForRent { value count }
      listedForLease { value count }
      updatedAt { value count }
      createdAt { value count }
      tags { value count }
    }
  }
}
```

**Variables:**
```typescript
{
  input: {
    searchString: "beach",
    options: {
      facets: [
        "type,count:1000",
        "additionalAmenities/category",
        "additionalAmenities/amenities,count:1000",
        "amenities,count:1000",
        "listedForLease,count:1000",
        "listedForSale,count:1000",
        "listedForRent,count:1000",
        "bedrooms,count:1000",
        "bathrooms,count:1000",
        "updatedAt,count:1000",
        "createdAt,count:1000",
        "tags,count:1000"
      ],
      filter: {
        communityId: "625641815f0e5d472135046c",
        propertyType: ["condo", "townhouse"],
        listingDetail: {
          bedrooms: 2,
          bathrooms: 2,
          prices: [100000, 500000],
          squareFeets: [1000, 3000],
          amenities: ["Pool", "Gym"]
        },
        listedInfo: ["listedForSale"],
        position: {
          latitude: 37.456,
          longitude: -122.123
        },
        distance: 5,
        tags: ["luxury", "waterfront"]
      },
      top: 10,
      skip: 0,
      orderBy: ["price desc", "updatedAt desc"]
    }
  }
}
```

### 9.2 Service Ticket Search Queries

**GraphQL Query:**

```graphql
query ServiceTicketsSearch($input: ServiceTicketsSearchInput!) {
  serviceTicketsSearch(input: $input) {
    serviceTicketsResults {
      id
      communityId
      propertyId
      title
      requestor
      requestorId
      assignedTo
      assignedToId
      description
      ticketType
      status
      priority
      createdAt
      updatedAt
    }
    count
    facets {
      requestor { value count }
      assignedTo { value count }
      requestorId { value count }
      assignedToId { value count }
      status { value count }
      priority { value count }
    }
  }
}
```

**Variables:**
```typescript
{
  input: {
    searchString: "plumbing",
    options: {
      facets: ["status", "priority", "requestorId", "assignedToId"],
      filter: {
        status: ["Open", "In Progress"],
        priority: [1, 2],
        requestorId: ["user123"],
        assignedToId: ["user456"]
      },
      top: 20,
      skip: 0,
      orderBy: ["priority asc", "createdAt desc"]
    }
  }
}
```

### 9.3 OData Filter Syntax Reference

**Comparison Operators:**
```
eq  - Equal to
ne  - Not equal to
gt  - Greater than
ge  - Greater than or equal to
lt  - Less than
le  - Less than or equal to
```

**Logical Operators:**
```
and - Logical AND
or  - Logical OR
not - Logical NOT
```

**String Functions:**
```
search.in(field, 'value1,value2,value3', ',')  - IN operator
```

**Collection Functions:**
```
field/any(x: x eq 'value')                     - Any element matches
field/all(x: x eq 'value')                     - All elements match
```

**Geospatial Functions:**
```
geo.distance(point, geography'POINT(lon lat)') le distance
```

**Date Functions:**
```
field ge 2025-01-01T00:00:00.000Z
field le 2025-12-31T23:59:59.999Z
```

---

## 10. Architecture Patterns

### 10.1 Layered Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      GraphQL API Layer                       │
│  (property.resolvers.ts, service-ticket.resolvers.ts)       │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                Application Services Layer                    │
│  - PropertyApiImpl                                          │
│    ├─ dataApi (CRUD operations)                            │
│    ├─ domainApi (Business logic)                           │
│    └─ searchApi (Search operations) ◄────────────┐         │
│  - ServiceTicketV1ApiImpl                        │         │
│    ├─ dataApi                                    │         │
│    ├─ domainApi                                  │         │
│    └─ searchApi                                  │         │
└──────────────────────────┬──────────────────────┼─────────┘
                           │                      │
┌──────────────────────────▼──────────────────────▼─────────┐
│                   Data Source Layer                        │
│  CognitiveSearchDataSource<AppContext>                    │
│  - withSearch() helper method                             │
│  - Provides context to search operations                  │
└──────────────────────────┬────────────────────────────────┘
                           │
┌──────────────────────────▼────────────────────────────────┐
│              Infrastructure Services Layer                 │
│  InfrastructureServices                                   │
│  └─ cognitiveSearch: CognitiveSearchInfrastructureService│
└──────────────────────────┬────────────────────────────────┘
                           │
┌──────────────────────────▼────────────────────────────────┐
│                   Seedwork Layer                          │
│  - services-seedwork-cognitive-search-interfaces/         │
│    └─ CognitiveSearchBase interface                      │
│  - services-seedwork-cognitive-search-az/                │
│    └─ AzCognitiveSearch (Azure implementation)           │
│  - services-seedwork-cognitive-search-in-memory/         │
│    └─ MemoryCognitiveSearch (Mock implementation)        │
└──────────────────────────┬────────────────────────────────┘
                           │
┌──────────────────────────▼────────────────────────────────┐
│                    Azure SDK Layer                        │
│  @azure/search-documents                                  │
│  - SearchIndexClient                                      │
│  - SearchClient                                           │
│  - SearchIndex                                            │
│  - SearchDocumentsResult                                  │
└───────────────────────────────────────────────────────────┘
```

### 10.2 Event-Driven Indexing Pattern

```
┌──────────────────────────────────────────────────────────┐
│              Domain Aggregate (Property)                  │
│  - propertyUpdate()                                      │
│  - Save to MongoDB                                       │
│  - Emit PropertyUpdatedEvent                            │
└──────────────────┬───────────────────────────────────────┘
                   │
                   │ Event Bus
                   ▼
┌──────────────────────────────────────────────────────────┐
│           Event Handler Registration                      │
│  RegisterPropertyUpdatedUpdateSearchIndexHandler()       │
│  - Listens to PropertyUpdatedEvent                       │
│  - Triggered on domain aggregate save                    │
└──────────────────┬───────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────┐
│              Event Handler Logic                          │
│  1. Fetch updated property from repository               │
│  2. Convert to search index document                     │
│  3. Generate hash (change detection)                     │
│  4. Compare with previous hash                           │
│  5. If changed:                                          │
│     - Update search index (with retry)                   │
│     - Update hash and lastIndexed timestamp             │
│     - Save back to repository                           │
│  6. Telemetry logging                                    │
└──────────────────┬───────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────┐
│         Cognitive Search Service                          │
│  - createIndexIfNotExists()                              │
│  - indexDocument() (merge or upload)                     │
│  - With retry logic (max 3 attempts)                    │
└──────────────────┬───────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────┐
│            Azure Cognitive Search                         │
│  - Document indexed and searchable                       │
└──────────────────────────────────────────────────────────┘
```

### 10.3 Repository Pattern with Search

```
┌──────────────────────────────────────────────────────────┐
│                   GraphQL Resolver                        │
│  propertiesSearch(input)                                 │
└──────────────────┬───────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────┐
│              Search API (Application Service)             │
│  PropertySearchApiImpl.propertiesSearch()                │
│  - Build filter string                                   │
│  - Execute search via withSearch()                       │
│  - Process facets                                        │
│  - Return GraphQL response                               │
└──────────────────┬───────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────┐
│          CognitiveSearchDataSource                        │
│  withSearch((passport, searchService) => {               │
│    // Access to authenticated search service             │
│  })                                                      │
└──────────────────┬───────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────┐
│        Cognitive Search Infrastructure Service            │
│  - search(indexName, searchText, options)                │
│  - Returns: SearchDocumentsResult                        │
└──────────────────────────────────────────────────────────┘
```

### 10.4 Dependency Injection Pattern

**Infrastructure Services Builder (Singleton):**

```typescript
export class InfrastructureServicesBuilder implements InfrastructureServices {
  private _cognitiveSearch: CognitiveSearchInfrastructureService;
  
  private constructor() {
    this._cognitiveSearch = this.InitCognitiveSearch();
  }

  public get cognitiveSearch(): CognitiveSearchInfrastructureService {
    return this._cognitiveSearch;
  }

  private InitCognitiveSearch(): CognitiveSearchInfrastructureService {
    const endpoint = tryGetEnvVar('SEARCH_API_ENDPOINT');
    return new AzCognitiveSearchImpl(endpoint);
  }

  private static _instance: InfrastructureServicesBuilder;
  
  public static initialize(): void {
    if (InfrastructureServicesBuilder._instance) {
      return;
    }
    InfrastructureServicesBuilder._instance = new InfrastructureServicesBuilder();
  }

  public static getInstance(): InfrastructureServicesBuilder {
    if (!InfrastructureServicesBuilder._instance) {
      throw new Error('InfrastructureServicesBuilder not initialized');
    }
    return InfrastructureServicesBuilder._instance;
  }
}
```

**Application Context Pattern:**

```typescript
export interface AppContext {
  passport: Passport;
  infrastructureServices: InfrastructureServices;
  applicationServices: ApplicationServices;
  community?: Community;
}

// Injected into GraphQL context
const context: AppContext = {
  passport: /* ... */,
  infrastructureServices: InfrastructureServicesBuilder.getInstance(),
  applicationServices: /* ... */,
  community: /* ... */
};
```

### 10.5 Interface Segregation

```typescript
// Base interface (minimal contract)
export interface CognitiveSearchBase {
  createIndexIfNotExists(indexDefinition: SearchIndex): Promise<void>;
  createOrUpdateIndexDefinition(indexName: string, indexDefinition: SearchIndex): Promise<void>;
  deleteDocument(indexName: string, document: any): Promise<void>;
  indexDocument(indexName: string, document: any): Promise<void>;
  deleteIndex(indexName: string): Promise<void>;
  indexExists(indexName: string): Promise<boolean>;
}

// Domain interface (adds domain-specific methods)
export interface CognitiveSearchDomain extends CognitiveSearchBase {}

// Lifecycle interface
export interface CognitiveSearchDomainInitializeable {
  startup(): Promise<void>;
  shutdown(): Promise<void>;
}

// Infrastructure service interface (adds search capability)
export interface CognitiveSearchInfrastructureService 
  extends CognitiveSearchDomain, CognitiveSearchDomainInitializeable {
  search(indexName: string, searchText: string, options?: any): Promise<any>;
}
```

### 10.6 Factory Pattern for Testing

**Production:**
```typescript
const cognitiveSearch = new AzCognitiveSearchImpl(endpoint);
```

**Testing:**
```typescript
const cognitiveSearch = new MemoryCognitiveSearch();
```

**Same Interface:**
```typescript
// Both implement CognitiveSearchDomain
cognitiveSearch.createIndexIfNotExists(indexDefinition);
cognitiveSearch.indexDocument(indexName, document);
cognitiveSearch.deleteDocument(indexName, document);
```

---

## Summary

### Key Takeaways for ShareThrift Mock Implementation

1. **Core Interface to Mock:** `CognitiveSearchBase` with 6 methods:
   - `createIndexIfNotExists()`
   - `createOrUpdateIndexDefinition()`
   - `indexDocument()`
   - `deleteDocument()`
   - `deleteIndex()`
   - `indexExists()`
   - `search()` (for infrastructure service)

2. **Index Definition Structure:** Use `SearchIndex` type with:
   - `name: string`
   - `fields: FieldDefinition[]` with properties like `searchable`, `filterable`, `sortable`, `facetable`

3. **Document Operations:**
   - `indexDocument()` uses merge-or-upload semantics
   - `deleteDocument()` requires only the `id` field
   - Both operate on a single document at a time

4. **Search Method Signature:**
   ```typescript
   search(indexName: string, searchText: string, options?: {
     queryType: 'simple' | 'full';
     searchMode: 'any' | 'all';
     includeTotalCount: boolean;
     filter: string;  // OData format
     facets: string[];
     top: number;
     skip: number;
     orderBy: string[];
   }): Promise<SearchDocumentsResult>
   ```

5. **Return Type:** `SearchDocumentsResult` with:
   - `results: Array<{ document: any }>`
   - `count: number`
   - `facets: Record<string, Array<{ value: any, count: number }>>`

6. **Filter Expression Syntax:** OData v4 with support for:
   - Comparison: `eq`, `ne`, `gt`, `ge`, `lt`, `le`
   - Logical: `and`, `or`, `not`
   - Collections: `field/any(x: x eq 'value')`
   - Geospatial: `geo.distance()`
   - Search.in: `search.in(field, 'val1,val2', ',')`

7. **Event-Driven Updates:** Implement event handlers that:
   - Listen to domain events
   - Convert domain objects to search documents
   - Use hash-based change detection
   - Retry on failure (max 3 attempts)
   - Track indexing metadata (lastIndexed, hash, failedDate)

8. **Testing Strategy:**
   - Use in-memory Map<string, Collection> for indexes
   - Implement document storage with upsert semantics
   - Mock search functionality or throw "not implemented"
   - Focus on index management and document operations

---

## Files Reference Index

**Core Implementation Files:**
- `data-access/seedwork/services-seedwork-cognitive-search-interfaces/index.ts`
- `data-access/seedwork/services-seedwork-cognitive-search-az/index.ts`
- `data-access/seedwork/services-seedwork-cognitive-search-in-memory/index.ts`
- `data-access/src/infrastructure-services-impl/cognitive-search/az/impl.ts`

**Index Definitions:**
- `data-access/src/app/domain/infrastructure/cognitive-search/property-search-index-format.ts`
- `data-access/src/app/domain/infrastructure/cognitive-search/service-ticket-search-index-format.ts`

**Search APIs:**
- `data-access/src/app/application-services/property/property.search.ts`
- `data-access/src/app/application-services/cases/service-ticket/v1/service-ticket.search.ts`

**Event Handlers:**
- `data-access/src/app/domain/events/handlers/property-updated-update-search-index.ts`
- `data-access/src/app/domain/events/handlers/service-ticket-v1-updated-update-search-index.ts`
- `data-access/src/app/domain/events/handlers/update-search-index-helpers.ts`

**Infrastructure:**
- `data-access/src/infrastructure-services-impl/infrastructure-services-builder.ts`
- `data-access/src/app/infrastructure-services/cognitive-search/index.ts`
- `data-access/src/app/data-sources/cognitive-search-data-source.ts`

**GraphQL:**
- `data-access/src/functions/http-graphql/schema/types/property.graphql`
- `data-access/src/functions/http-graphql/schema/types/property.resolvers.ts`
- `data-access/src/functions/http-graphql/schema/types/service-ticket.graphql`
- `data-access/src/functions/http-graphql/schema/types/service-ticket.resolvers.ts`

**Infrastructure as Code:**
- `az-bicep/modules/cognitive-search/main.bicep`
- `az-bicep/modules/cognitive-search/search-service.bicep`

---

**End of Document**

