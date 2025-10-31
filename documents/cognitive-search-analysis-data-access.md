# Azure Cognitive Search Implementation Analysis

**Project:** Owner Community Data Access (OCDA)  
**Analysis Date:** October 9, 2025  
**Purpose:** Document complete Azure Cognitive Search implementation for creating mock version in ShareThrift project

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

### NPM Package
- **Package:** `@azure/search-documents`
- **Version:** `^11.2.1`
- **Location:** `package.json` (line 59)

### Related Azure Packages
```json
{
  "@azure/identity": "^2.1.0",           // For authentication
  "@azure/monitor-opentelemetry": "^1.3.0" // For telemetry/tracing
}
```

### Supporting Dependencies
```json
{
  "async-retry": "^1.3.3",  // For retry logic in index updates
  "dayjs": "^1.11.3",        // For date handling in search filters
  "crypto": "built-in"       // For hash generation
}
```

### Files Using @azure/search-documents
1. `src/app/external-dependencies/cognitive-search.ts` - Re-exports Azure types
2. `seedwork/services-seedwork-cognitive-search-az/index.ts` - Main Azure implementation
3. `src/app/domain/events/handlers/property-updated-update-search-index.ts` - GeographyPoint usage

---

## 2. Search Client Implementation

### 2.1 Main Azure Implementation

**File:** `seedwork/services-seedwork-cognitive-search-az/index.ts`

```typescript
import { DefaultAzureCredential, DefaultAzureCredentialOptions, TokenCredential } from '@azure/identity';
import { SearchIndexClient, SearchClient, AzureKeyCredential, SearchIndex, SearchDocumentsResult } from '@azure/search-documents';
import { CognitiveSearchDomain } from '../../src/app/domain/infrastructure/cognitive-search/interfaces';

export class AzCognitiveSearch implements CognitiveSearchDomain {
  private client: SearchIndexClient;
  private searchClients: Map<string, SearchClient<unknown>> = new Map<string, SearchClient<unknown>>();

  tryGetEnvVar(envVar: string): string {
    const value = process.env[envVar];
    if (value === undefined) {
      throw new Error(`Environment variable ${envVar} is not set`);
    }
    return value;
  }

  constructor(searchKey: string, endpoint: string) {
    let credentials : TokenCredential;
    
    // Environment-based credential selection
    if(process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"){
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

  async createIndexIfNotExists(indexName: string, indexDefinition: SearchIndex): Promise<void> {
    if (this.searchClients.has(indexName)) return;
    let index : SearchIndex;
    try {
      index = await this.client.getIndex(indexName);
      console.log(`Index ${index.name} already exists`);
    } catch (err) {
      console.log(`Index ${indexName} does not exist error ${JSON.stringify(err)} thrown, creating it...`);
      index = await this.client.createIndex(indexDefinition);
      console.log(`Index ${index.name} created`);
    }
    this.searchClients.set(indexName, this.client.getSearchClient(indexName));
  }

  async createOrUpdateIndex(indexName: string, indexDefinition: SearchIndex): Promise<void> {
    if (this.searchClients.has(indexName)) return;
    let index : SearchIndex;
    try{
      index = await this.client.getIndex(indexName);
    } catch (err) {
      console.log(`Index ${indexName} does not exist error ${JSON.stringify(err)} thrown, creating it...`);
      index = await this.client.createIndex(indexDefinition);
      console.log(`Index ${index.name} created`);
    }
   
    index = await this.client.createOrUpdateIndex(indexDefinition);
    console.log(`Index ${index.name} updated`);
 
    this.searchClients.set(indexName, this.client.getSearchClient(indexName));
  }

  async search(indexName: string, searchText: string, options?: any): Promise<SearchDocumentsResult<Pick<unknown, never>>> {
    const result = await this.client.getSearchClient(indexName).search(searchText, options);
    console.log('search result', result);
    return result;
  }

  async deleteDocument(indexName: string, document: any): Promise<void> {
    await this.client.getSearchClient(indexName).deleteDocuments([document]);
  }

  async indexDocument(indexName: string, document: any): Promise<void> {
    const searchClient = this.searchClients.get(indexName);
    searchClient.mergeOrUploadDocuments([document]);
  }
}
```

### 2.2 Environment Variables Required

**Configuration in:** `src/init/infrastructure-services-builder.ts` (lines 73-76)

```typescript
private InitCognitiveSearch(): CognitiveSearchInfrastructureService {
  const searchKey = this.tryGetEnvVar('SEARCH_API_KEY');
  const endpoint = this.tryGetEnvVar('SEARCH_API_ENDPOINT');
  return new AzCognitiveSearchImpl(searchKey, endpoint);
}
```

**Required Environment Variables:**
- `SEARCH_API_KEY` - Azure Cognitive Search API key
- `SEARCH_API_ENDPOINT` - Azure Cognitive Search endpoint URL
- `NODE_ENV` - "development" | "test" | "production" (affects credential selection)
- `MANAGED_IDENTITY_CLIENT_ID` - (Optional) For managed identity in production

### 2.3 Wrapper Implementation

**File:** `src/infrastructure-services-impl/cognitive-search/az/impl.ts`

```typescript
import { AzCognitiveSearch } from "../../../../seedwork/services-seedwork-cognitive-search-az";
import { CognitiveSearchInfrastructureService } from "../../../app/infrastructure-services/cognitive-search";

export class AzCognitiveSearchImpl extends AzCognitiveSearch implements CognitiveSearchInfrastructureService {
  
  /**
   * needs following environment variables:
   ** NODE_ENV =  "development" | "test" | "production"
   ** MANAGED_IDENTITY_CLIENT_ID: DefaultAzureCredentialOptions
   * 
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

### 2.4 Authentication Methods

The implementation uses **Azure DefaultAzureCredential** which tries multiple authentication methods in order:

1. **Development/Test:** `DefaultAzureCredential()` - Uses Azure CLI, Visual Studio, etc.
2. **Production with Managed Identity:** Uses `MANAGED_IDENTITY_CLIENT_ID`
3. **Fallback:** `DefaultAzureCredential()`

**Note:** The searchKey parameter is passed but not used in favor of credential-based auth.

---

## 3. Index Definitions

### 3.1 Property Listings Index

**File:** `src/app/domain/infrastructure/cognitive-search/property-search-index-format.ts`

**Index Name:** `property-listings`

```typescript
export const PropertyListingIndexSpec = {
  name: 'property-listings',
  fields: [
    { name: 'id', type: 'Edm.String', searchable: false, key: true },
    
    // Filterable only
    { name: 'communityId', type: 'Edm.String', searchable: false, filterable: true },
    
    // Searchable and sortable
    { name: 'name', type: 'Edm.String', searchable: true, sortable: true },
    
    // Filterable with facets
    { name: 'type', type: 'Edm.String', filterable: true, facetable: true },
    { name: 'bedrooms', type: 'Edm.Int32', filterable: true, sortable: true, facetable: true },
    { name: 'bathrooms', type: 'Edm.Double', filterable: true, sortable: true, facetable: true },
    { name: 'amenities', type: 'Collection(Edm.String)', filterable: true, facetable: true },
    
    // Complex type - Additional Amenities
    {
      name: 'additionalAmenities',
      type: 'Collection(Edm.ComplexType)',
      fields: [
        { name: 'category', type: 'Edm.String', facetable: true, filterable: true, searchable: false },
        { name: 'amenities', type: 'Collection(Edm.String)', facetable: true, filterable: true }
      ]
    },
    
    // Numeric filterable/sortable
    { name: 'price', type: 'Edm.Double', filterable: true, sortable: true },
    { name: 'squareFeet', type: 'Edm.Double', filterable: true, sortable: true },
    
    // Geo-spatial
    { name: 'position', type: 'Edm.GeographyPoint', filterable: true, sortable: true },
    
    // Collections
    { name: 'images', type: 'Collection(Edm.String)' },
    { name: 'tags', type: 'Collection(Edm.String)', filterable: true, facetable: true },
    
    // Complex type - Address (searchable address fields)
    {
      name: 'address',
      type: 'Edm.ComplexType',
      fields: [
        { name: 'streetNumber', type: 'Edm.String', searchable: true },
        { name: 'streetName', type: 'Edm.String', searchable: true },
        { name: 'municipality', type: 'Edm.String', searchable: true, filterable: true, facetable: true, sortable: true },
        { name: 'municipalitySubdivision', type: 'Edm.String', searchable: true, filterable: true },
        { name: 'postalCode', type: 'Edm.String', searchable: true, filterable: true, facetable: true, sortable: true },
        { name: 'country', type: 'Edm.String', searchable: true, filterable: true, facetable: true, sortable: true },
        // ... many more address fields
      ]
    },
    
    // Boolean filters with facets
    { name: 'listedForSale', type: 'Edm.Boolean', filterable: true, sortable: true, facetable: true },
    { name: 'listedForRent', type: 'Edm.Boolean', filterable: true, sortable: true, facetable: true },
    { name: 'listedForLease', type: 'Edm.Boolean', filterable: true, sortable: true, facetable: true },
    
    // Timestamps
    { name: 'updatedAt', type: 'Edm.DateTimeOffset', facetable: true, filterable: true, sortable: true },
    { name: 'createdAt', type: 'Edm.DateTimeOffset', facetable: true, filterable: true, sortable: true }
  ]
} as SearchIndex;
```

**TypeScript Interface:**

```typescript
export interface PropertyListingIndexDocument {
  id: string;
  communityId: string;
  name: string;
  type: string;
  bedrooms: number;
  amenities: string[];
  additionalAmenities: {
    category: string;
    amenities: string[];
  }[];
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
    // ... full address fields
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

**File:** `src/app/domain/infrastructure/cognitive-search/service-ticket-search-index-format.ts`

**Index Name:** `service-ticket-index`

```typescript
export const ServiceTicketIndexSpec = {
  name: 'service-ticket-index',
  fields: [
    { name: 'id', type: 'Edm.String', searchable: false, key: true },
    { name: 'communityId', type: 'Edm.String', searchable: false, filterable: true },
    { name: 'propertyId', type: 'Edm.String', searchable: false, filterable: true },
    
    // Searchable fields
    { name: 'title', type: 'Edm.String', searchable: true, sortable: true },
    { name: 'description', type: 'Edm.String', searchable: true },
    
    // Filterable with facets
    { name: 'requestor', type: 'Edm.String', filterable: true, sortable: true, facetable: true },
    { name: 'requestorId', type: 'Edm.String', filterable: true, sortable: true, facetable: true },
    { name: 'assignedTo', type: 'Edm.String', filterable: true, sortable: true, facetable: true },
    { name: 'assignedToId', type: 'Edm.String', filterable: true, sortable: true, facetable: true },
    { name: 'status', type: 'Edm.String', filterable: true, sortable: true, facetable: true },
    { name: 'priority', type: 'Edm.Int32', filterable: true, sortable: true, facetable: true },
    
    // Timestamps
    { name: 'updatedAt', type: 'Edm.DateTimeOffset', facetable: true, filterable: true, sortable: true },
    { name: 'createdAt', type: 'Edm.DateTimeOffset', facetable: true, filterable: true, sortable: true }
  ]
} as SearchIndex;
```

**TypeScript Interface:**

```typescript
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
  status: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
}
```

### 3.3 Field Type Reference

**File:** `seedwork/services-seedwork-cognitive-search-in-memory/interfaces.ts`

```typescript
export declare type SearchFieldDataType = 
  | "Edm.String" 
  | "Edm.Int32" 
  | "Edm.Int64" 
  | "Edm.Double" 
  | "Edm.Boolean" 
  | "Edm.DateTimeOffset" 
  | "Edm.GeographyPoint" 
  | "Collection(Edm.String)" 
  | "Collection(Edm.Int32)" 
  | "Collection(Edm.Int64)" 
  | "Collection(Edm.Double)" 
  | "Collection(Edm.Boolean)" 
  | "Collection(Edm.DateTimeOffset)" 
  | "Collection(Edm.GeographyPoint)";

export declare type ComplexDataType = 
  | "Edm.ComplexType" 
  | "Collection(Edm.ComplexType)";
```

---

## 4. Search Operations

### 4.1 Property Search Implementation

**File:** `src/app/application-services-impl/cognitive-search/property.ts`

```typescript
export class PropertySearchApiImpl 
  extends CognitiveSearchDataSource<AppContext> 
  implements PropertySearchApi
{
  async propertiesSearch(input: PropertiesSearchInput): Promise<SearchDocumentsResult<Pick<unknown, never>>> {
    let searchString = '';
    if (!input.options.filter?.position) {
      searchString = input.searchString.trim();
    }

    console.log(`Resolver>Query>propertiesSearch: ${searchString}`);
    let filterString = this.getFilterString(input.options.filter);
    console.log('filterString: ', filterString);

    let searchResults: SearchDocumentsResult<Pick<unknown, never>>;
    await this.withSearch(async (_passport, searchService) => {
      searchResults = await searchService.search('property-listings', searchString, {
        queryType: 'full',
        searchMode: 'all',
        includeTotalCount: true,
        filter: filterString,
        facets: input.options.facets,
        top: input.options.top,
        skip: input.options.skip,
        orderBy: input.options.orderBy
      });
    });

    console.log(`Resolver>Query>propertiesSearch ${JSON.stringify(searchResults)}`);
    return searchResults;
  }

  async getPropertiesSearchResults(
    searchResults: SearchDocumentsResult<Pick<unknown, never>>, 
    input: PropertiesSearchInput
  ): Promise<PropertySearchResult> {
    let results = [];
    for await (const result of searchResults?.results ?? []) {
      results.push(result.document);
    }

    // Calculate bedrooms facets (aggregated as "1+", "2+", etc.)
    const bedroomsOptions = [1, 2, 3, 4, 5];
    let bedroomsFacet = bedroomsOptions.map((option) => {
      const found = searchResults?.facets?.bedrooms?.filter((facet) => facet.value >= option);
      let count = 0;
      found.forEach((f) => { count += f.count; });
      return { value: option + '+', count: count };
    });

    // Calculate bathrooms facets
    const bathroomsOptions = [1, 1.5, 2, 3, 4, 5];
    let bathroomsFacet = bathroomsOptions.map((option) => {
      const found = searchResults?.facets?.bathrooms?.filter((facet) => facet.value >= option);
      let count = 0;
      found.forEach((f) => { count += f.count; });
      return { value: option + '+', count: count };
    });

    // Calculate date-based facets
    const periods = [7, 14, 30, 90];
    const periodTextMaps = {
      7: '1 week ago',
      14: '2 weeks ago',
      30: '1 month ago',
      90: '3 months ago',
    };

    let periodInput = parseInt(input?.options?.filter?.updatedAt);
    let updatedAtFacet = periods.map((option) => {
      const day0 = option === periodInput ? dayjs().subtract(periodInput, 'day') : dayjs().subtract(option, 'day');
      const found = searchResults?.facets?.updatedAt?.filter((facet) => {
        let temp = dayjs(facet.value).diff(day0, 'day', true);
        return temp >= 0;
      });
      let count = 0;
      found.forEach((f) => { count += f.count; });
      return { value: periodTextMaps[option], count: count };
    });

    return {
      propertyResults: results,
      count: searchResults.count,
      facets: {
        type: searchResults.facets?.type,
        amenities: searchResults.facets?.amenities,
        additionalAmenitiesCategory: searchResults.facets?.['additionalAmenities/category'],
        additionalAmenitiesAmenities: searchResults.facets?.['additionalAmenities/amenities'],
        listedForSale: searchResults.facets?.listedForSale,
        listedForRent: searchResults.facets?.listedForRent,
        listedForLease: searchResults.facets?.listedForLease,
        bedrooms: bedroomsFacet,
        bathrooms: bathroomsFacet,
        updatedAt: updatedAtFacet,
        createdAt: createdAtFacet,
        tags: searchResults.facets?.tags,
      },
    } as PropertySearchResult;
  }
}
```

### 4.2 Service Ticket Search Implementation

**File:** `src/app/application-services-impl/cognitive-search/service-ticket.ts`

```typescript
export class ServiceTicketSearchApiImpl 
  extends CognitiveSearchDataSource<AppContext> 
  implements ServiceTicketSearchApi
{
  async serviceTicketsSearch(
    input: ServiceTicketsSearchInput, 
    requestorId: string
  ): Promise<SearchDocumentsResult<Pick<unknown, never>>> {
    let searchString = input.searchString.trim();

    console.log(`Resolver>Query>serviceTicketsSearch: ${searchString}`);
    let filterString = this.getFilterString(input.options.filter, requestorId);
    console.log('filterString: ', filterString);

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
    
    console.log(`Resolver>Query>serviceTicketsSearch ${JSON.stringify(searchResults)}`);
    return searchResults;
  }

  async getServiceTicketsSearchResults(
    searchResults: SearchDocumentsResult<Pick<unknown, never>>
  ): Promise<ServiceTicketsSearchResult> {
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

### 4.3 Search Options Structure

**Search Options Include:**
- `queryType`: 'full' (full Lucene query syntax)
- `searchMode`: 'all' (all terms must match)
- `includeTotalCount`: true (return total result count)
- `filter`: OData filter string
- `facets`: Array of field names for faceted search
- `top`: Number of results to return (pagination)
- `skip`: Number of results to skip (pagination)
- `orderBy`: Array of sort expressions

---

## 5. Data Indexing

### 5.1 Property Indexing on Update

**File:** `src/app/domain/events/handlers/property-updated-update-search-index.ts`

```typescript
export default (
  cognitiveSearch: CognitiveSearchDomain,
  propertyUnitOfWork: PropertyUnitOfWork
) => { 
  EventBusInstance.register(PropertyUpdatedEvent, async (payload) => {
    const tracer = trace.getTracer('PG:data-access');
    tracer.startActiveSpan('updateSearchIndex', async (span) => {
      try {
        const logger = logs.getLogger('default');
        logger.emit({
          body: `Property Updated - Search Index Integration: ${JSON.stringify(payload)}`,
          severityNumber: SeverityNumber.INFO,
          severityText: 'INFO',
        });

        const context = SystemExecutionContext();
        await propertyUnitOfWork.withTransaction(context, async (repo) => {
          let property = await repo.getById(payload.id);
          const propertyHash = property.hash;

          let listingDoc: Partial<PropertyListingIndexDocument> = convertToIndexDocument(property);
          const hash = generateHash(listingDoc);

          const maxAttempt = 3;

          if (property.hash === hash) {
            console.log(`Updated Property hash [${hash}] is same as previous hash [[${propertyHash}]]`);
            span.setStatus({ code: SpanStatusCode.OK, message: 'Index update skipped' });
          } else {
            console.log(`Updated Property hash [${hash}] is different from previous hash`);
            await retry(
              async (failedCB, currentAttempt) => {
                if (currentAttempt > maxAttempt) {
                  property.UpdateIndexFailedDate = new Date();
                  property.Hash = hash;
                  await repo.save(property);
                  console.log('Index update failed: ', property.updateIndexFailedDate);
                } else {
                  await updateSearchIndex(listingDoc, property, hash, repo);
                }
              },
              { retries: maxAttempt }
            );
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

  async function updateSearchIndex(
    listingDoc: Partial<PropertyListingIndexDocument>,
    property: Property<PropertyProps>,
    hash: any,
    repo: PropertyRepository<PropertyProps>
  ) {
    await cognitiveSearch.createOrUpdateIndex(PropertyListingIndexSpec.name, PropertyListingIndexSpec);
    await cognitiveSearch.indexDocument(PropertyListingIndexSpec.name, listingDoc);
    console.log(`Property Updated - Index Updated: ${JSON.stringify(listingDoc)}`);

    property.LastIndexed = new Date();
    property.Hash = hash;
    await repo.save(property);
    console.log('Index update successful: ', property.lastIndexed);
  }
};
```

### 5.2 Document Conversion Function

**Converting domain entity to search document:**

```typescript
function convertToIndexDocument(property: Property<PropertyProps>) {
  const updatedAdditionalAmenities = property.listingDetail?.additionalAmenities?.map((additionalAmenity) => {
    return { category: additionalAmenity.category, amenities: additionalAmenity.amenities };
  });

  const coordinates = property.location?.position?.coordinates;
  let geoGraphyPoint: GeographyPoint = null;
  if (coordinates && coordinates.length === 2) {
    geoGraphyPoint = new GeographyPoint({ 
      longitude: coordinates[1], 
      latitude: coordinates[0] 
    });
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
      // ... full address mapping
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

### 5.3 Hash Generation for Change Detection

```typescript
function generateHash(listingDoc: Partial<PropertyListingIndexDocument>) {
  const listingDocCopy = JSON.parse(JSON.stringify(listingDoc));
  delete listingDocCopy.updatedAt; // Exclude timestamp from hash
  const hash = crypto.createHash('sha256')
    .update(JSON.stringify(listingDocCopy))
    .digest('base64');
  return hash;
}
```

### 5.4 Service Ticket Indexing

**File:** `src/app/domain/events/handlers/service-ticket-updated-update-search-index.ts`

```typescript
export default (
  cognitiveSearch: CognitiveSearchDomain,
  serviceTicketUnitOfWork: ServiceTicketUnitOfWork
) => { 
  EventBusInstance.register(ServiceTicketUpdatedEvent, async (payload) => {
    console.log(`Service Ticket Updated - Search Index Integration: ${JSON.stringify(payload)}`);

    const context = SystemExecutionContext();
    await serviceTicketUnitOfWork.withTransaction(context, async (repo) => {
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
        status: serviceTicket.status,
        priority: serviceTicket.priority,
        createdAt: createdDate,
        updatedAt: updatedDate,
      };

      let serviceTicketDocCopy = JSON.parse(JSON.stringify(serviceTicketDoc));
      delete serviceTicketDocCopy.updatedAt;

      const hash = crypto.createHash('sha256')
        .update(JSON.stringify(serviceTicketDocCopy))
        .digest('base64');

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
    serviceTicket: ServiceTicket<ServiceTicketProps>,
    hash: any,
    repo: ServiceTicketRepository<ServiceTicketProps>,
  ) {
    await cognitiveSearch.createOrUpdateIndex(ServiceTicketIndexSpec.name, ServiceTicketIndexSpec);
    await cognitiveSearch.indexDocument(ServiceTicketIndexSpec.name, serviceTicketDoc);
    console.log(`Service Ticket Updated - Index Updated: ${JSON.stringify(serviceTicketDoc)}`);

    serviceTicket.LastIndexed = new Date();
    serviceTicket.Hash = hash;
    await repo.save(serviceTicket);
    console.log('Index update successful: ', serviceTicket.lastIndexed);
  }
};
```

### 5.5 Document Deletion

**Property Deletion:**  
**File:** `src/app/domain/events/handlers/property-deleted-update-search-index.ts`

```typescript
export default (
  cognitiveSearch:CognitiveSearchDomain,
) => { 
  EventBusInstance.register(PropertyDeletedEvent, async (payload) => {
    console.log(`Property Deleted - Search Index Integration: ${JSON.stringify(payload)}`);

    let listingDoc: Partial<PropertyListingIndexDocument> = {
      id: payload.id,
    };
    await cognitiveSearch.deleteDocument(PropertyListingIndexSpec.name, listingDoc);
  });
};
```

**Service Ticket Deletion:**  
**File:** `src/app/domain/events/handlers/service-ticket-deleted-update-search-index.ts`

```typescript
export default (
  cognitiveSearch:CognitiveSearchDomain
) => { 
  EventBusInstance.register(ServiceTicketDeletedEvent, async (payload) => {
    console.log(`Service Ticket Deleted - Search Index Integration: ${JSON.stringify(payload)}`);

    let serviceTicketDoc: Partial<ServiceTicketIndexDocument> = {
      id: payload.id,
    };
    await cognitiveSearch.deleteDocument(ServiceTicketIndexSpec.name, serviceTicketDoc);
  });
};
```

### 5.6 Batch Operations

**Implementation uses:**
- `mergeOrUploadDocuments([document])` - Merges or uploads single document
- `deleteDocuments([document])` - Deletes single document

**Note:** The implementation processes documents individually rather than in batches, though the Azure SDK supports batch operations.

---

## 6. Mock/Test Implementations

### 6.1 In-Memory Mock Implementation

**File:** `seedwork/services-seedwork-cognitive-search-in-memory/index.ts`

```typescript
export class MemoryCognitiveSearchCollection<DocumentType extends BaseDocumentType> 
  implements IMemoryCognitiveSearchCollection<DocumentType> {
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

  async createIndexIfNotExists(indexName: string, indexDefinition: SearchIndex): Promise<void> {
    if (this.searchCollectionIndexMap.has(indexName)) return;
    this.createNewIndex(indexName, indexDefinition);
  }

  private createNewIndex(indexName: string, indexDefinition: SearchIndex) {
    this.searchCollectionIndexDefinitionMap.set(indexName, indexDefinition);
    this.searchCollectionIndexMap.set(indexName, new MemoryCognitiveSearchCollection());
  }

  async createOrUpdateIndex(indexName: string, indexDefinition: SearchIndex): Promise<void> {
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
}
```

### 6.2 Mock Implementation Wrapper

**File:** `src/infrastructure-services-impl/cognitive-search/in-memory/impl.ts`

```typescript
import { MemoryCognitiveSearch} from "../../../../seedwork/services-seedwork-cognitive-search-in-memory";
import { CognitiveSearchInfrastructureService } from "../../../app/infrastructure-services/cognitive-search";

export class MemoryCognitiveSearchImpl extends MemoryCognitiveSearch implements CognitiveSearchInfrastructureService {
  constructor() {
      super();
  }

  startup = async (): Promise<void> => {
    // console.log('MemoryCognitiveSearchImpl startup');
  }

  shutdown = async (): Promise<void> => {
    // console.log('MemoryCognitiveSearchImpl shutdown');
  }

  logIndexes(): void {
    console.log("MemoryCognitiveSearchImpl - logIndexes");
  }
}
```

### 6.3 Test File

**File:** `seedwork/services-seedwork-cognitive-search-az/index.test.ts`

```typescript
import { AzCognitiveSearch } from './index';

// Check if required environment variables are defined
beforeAll(() => {
  if (!process.env.SEARCH_API_KEY || !process.env.SEARCH_API_ENDPOINT) {
    throw new Error('SEARCH_API_KEY and SEARCH_API_ENDPOINT must be defined.');
  }
});

// Common setup for all tests
let cognitiveSearch;

beforeEach(() => {
  const searchKey = process.env.SEARCH_API_KEY;
  const endpoint = process.env.SEARCH_API_ENDPOINT;
  cognitiveSearch = new AzCognitiveSearch(searchKey, endpoint);
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

### 6.4 BDD Test Setup

**File:** `screenplay/abilities/domain/io/test/domain-impl-bdd.ts`

Uses in-memory implementation for testing:

```typescript
const RegisterEventHandlers = (
  datastore: DatastoreDomain,
  cognitiveSearch: CognitiveSearchDomain,
) => {
  RegisterPropertyUpdatedUpdateSearchIndexHandler(cognitiveSearch, datastore.propertyUnitOfWork);
  // Other handlers commented out for testing
};

export class DomainImplBDD<
  DatastoreImpl extends DatastoreDomain & DatastoreDomainInitializeable,
  CognitiveSearchImpl extends CognitiveSearchDomain & CognitiveSearchDomainInitializeable
>{
  constructor(
    private _datastoreImpl: DatastoreImpl,
    private _cognitiveSearchImpl: CognitiveSearchImpl,
  ) {}

  public async startup(): Promise<void> {
    this._datastoreImpl.startup();
    this._cognitiveSearchImpl.startup();
    RegisterEventHandlers(this._datastoreImpl, this._cognitiveSearchImpl);
  }

  public get search(): Omit<CognitiveSearchImpl, keyof CognitiveSearchDomainInitializeable> {
    return this._cognitiveSearchImpl;
  }
}
```

### 6.5 Key Limitations of Mock

**Current mock limitations:**
1. ✅ Index creation/update - Implemented
2. ✅ Document indexing (add/update) - Implemented
3. ✅ Document deletion - Implemented
4. ❌ Search functionality - **NOT IMPLEMENTED** (throws error)
5. ❌ Filtering - Not implemented
6. ❌ Faceting - Not implemented
7. ❌ Sorting - Not implemented
8. ❌ Pagination - Not implemented

---

## 7. Service Layer Integration

### 7.1 Domain Interface

**File:** `src/app/domain/infrastructure/cognitive-search/interfaces.ts`

```typescript
import { SearchIndex } from '../../../external-dependencies/cognitive-search';

export interface CognitiveSearchDomain {
  createIndexIfNotExists(indexName: string, indexDefinition: SearchIndex): Promise<void>;
  createOrUpdateIndex(indexName: string, indexDefinition: SearchIndex): Promise<void>;
  deleteDocument(indexName: string, document: any): Promise<void>;
  indexDocument(indexName: string, document: any): Promise<void>;
}

export interface CognitiveSearchDomainInitializeable {
  startup(): Promise<void>;
  shutdown(): Promise<void>;
}
```

### 7.2 Infrastructure Service Interface

**File:** `src/app/infrastructure-services/cognitive-search/index.ts`

```typescript
import { CognitiveSearchDomain, CognitiveSearchDomainInitializeable } from "../../domain/infrastructure/cognitive-search/interfaces";

export interface CognitiveSearchInfrastructureService 
  extends CognitiveSearchDomain, CognitiveSearchDomainInitializeable {
  search(indexName: string, searchText: string, options?: any): Promise<any>;
}
```

### 7.3 Application Service Interfaces

**File:** `src/app/application-services/cognitive-search/property.interface.ts`

```typescript
import { SearchDocumentsResult } from "../../external-dependencies/cognitive-search";
import { PropertiesSearchInput, PropertySearchResult } from "../../external-dependencies/graphql-api";

export interface PropertyCognitiveSearchApplicationService {
  propertiesSearch(input: PropertiesSearchInput): Promise<SearchDocumentsResult<Pick<unknown, never>>>;
  getPropertiesSearchResults(
    searchResults: SearchDocumentsResult<Pick<unknown, never>>, 
    input: PropertiesSearchInput
  ): Promise<PropertySearchResult>;
}
```

**File:** `src/app/application-services/cognitive-search/service-ticket.interface.ts`

```typescript
import { SearchDocumentsResult } from "../../external-dependencies/cognitive-search";
import { ServiceTicketsSearchInput, ServiceTicketsSearchResult } from "../../external-dependencies/graphql-api";

export interface ServiceTicketCognitiveSearchApplicationService {
  serviceTicketsSearch(
    input: ServiceTicketsSearchInput, 
    requestorId: string
  ): Promise<SearchDocumentsResult<Pick<unknown, never>>>;
  getServiceTicketsSearchResults(
    searchResults: SearchDocumentsResult<Pick<unknown, never>>
  ): Promise<ServiceTicketsSearchResult>;
}
```

### 7.4 Data Source Base Class

**File:** `src/app/application-services-impl/cognitive-search/cognitive-search-data-source.ts`

```typescript
import { DataSource } from "../data-source";
import { Passport } from "../../domain/contexts/iam/passport";
import { CognitiveSearchInfrastructureService } from "../../infrastructure-services/cognitive-search";
import { AppContext } from "../../init/app-context-builder";

export class CognitiveSearchDataSource<Context extends AppContext> extends DataSource<Context> {

  public get context(): Context {
    return this._context;
  }

  public async withSearch(
    func: (passport: Passport, search: CognitiveSearchInfrastructureService) => Promise<void>
  ): Promise<void> {
    let passport = this._context.passport; 
    let cognitiveSearch = this._context.infrastructureServices.cognitiveSearch;
    await func(passport, cognitiveSearch);
  }
}
```

### 7.5 Dependency Injection Setup

**File:** `src/init/infrastructure-services-builder.ts`

```typescript
export class InfrastructureServicesBuilder implements InfrastructureServices{
  private _cognitiveSearch: CognitiveSearchInfrastructureService;
  
  constructor() {
    this._cognitiveSearch = this.InitCognitiveSearch();
  }

  public get cognitiveSearch(): CognitiveSearchInfrastructureService {
    return this._cognitiveSearch;
  }

  private tryGetEnvVar(envVar: string): string {
    const value = process.env[envVar];
    if (value === undefined) {
      throw new Error(`Environment variable ${envVar} is not set`);
    }
    return value;
  }

  private InitCognitiveSearch(): CognitiveSearchInfrastructureService {
    const searchKey = this.tryGetEnvVar('SEARCH_API_KEY');
    const endpoint = this.tryGetEnvVar('SEARCH_API_ENDPOINT');
    return new AzCognitiveSearchImpl(searchKey, endpoint);
  }
}
```

### 7.6 Domain Layer Integration

**File:** `src/app/domain/domain-impl.ts`

```typescript
export class DomainImpl<
  DatastoreImpl extends DatastoreDomain & DatastoreDomainInitializeable,
  CognitiveSearchImpl extends CognitiveSearchDomain & CognitiveSearchDomainInitializeable
>{
  constructor(
    private _datastoreImpl: DatastoreImpl,
    private _cognitiveSearchImpl: CognitiveSearchImpl,
    private _blobStorageImpl: BlobStorageDomain,
    private _vercelImpl: VercelDomain,
  ) {}

  public async startup(): Promise<void> {
    this._datastoreImpl.startup();
    this._cognitiveSearchImpl.startup();
    
    // Event handler should be started at the end
    RegisterEventHandlers(
      this._datastoreImpl,
      this._cognitiveSearchImpl,
      this._blobStorageImpl,
      this._vercelImpl
    );
  }

  public async shutdown(): Promise<void> {
    // Event handler should be stopped at the beginning
    StopEventHandlers();
    // Remaining services should be stopped in the reverse order of startup
    this._cognitiveSearchImpl.shutdown();
    this._datastoreImpl.shutdown();
  }

  public get cognitiveSearch(): Omit<CognitiveSearchImpl, keyof CognitiveSearchDomainInitializeable> {
    return this._cognitiveSearchImpl;
  }
}
```

### 7.7 Event Handler Registration

**File:** `src/app/domain/domain-impl.ts` (continued)

```typescript
const RegisterEventHandlers = (
  datastore: DatastoreDomain,
  cognitiveSearch: CognitiveSearchDomain,
  blobStorage: BlobStorageDomain,
  vercel: VercelDomain
) => {
  // Register all event handlers
  RegisterPropertyDeletedUpdateSearchIndexHandler(cognitiveSearch);
  RegisterPropertyUpdatedUpdateSearchIndexHandler(cognitiveSearch, datastore.propertyUnitOfWork);
  RegisterServiceTicketUpdatedUpdateSearchIndexHandler(cognitiveSearch, datastore.serviceTicketUnitOfWork);
  RegisterServiceTicketDeletedUpdateSearchIndexHandler(cognitiveSearch);
  // ... other handlers
};
```

---

## 8. Code Examples

### 8.1 Complete Filter String Builder (Property Search)

**File:** `src/app/application-services-impl/cognitive-search/property.ts`

```typescript
const PropertyFilterNames = {
  Bedrooms: 'bedrooms',
  Bathrooms: 'bathrooms',
  Type: 'type',
  Amenities: 'amenities',
  AdditionalAmenitiesCategory: 'additionalAmenities/category',
  AdditionalAmenitiesAmenities: 'additionalAmenities/amenities',
  Price: 'price',
  SquareFeet: 'squareFeet',
  Tags: 'tags',
};

private getFilterString(filter: FilterDetail): string {
  let filterStrings = [];

  // Always filter by community (multi-tenancy)
  filterStrings.push(`communityId eq '${filter.communityId}'`);

  if (filter) {
    // Property type - IN clause
    if (filter.propertyType && filter.propertyType.length > 0) {
      filterStrings.push(`search.in(${PropertyFilterNames.Type}, '${filter.propertyType.join(',')}',',')`);
    }

    // Bedrooms - Greater than or equal
    if (filter.listingDetail?.bedrooms) {
      filterStrings.push(`${PropertyFilterNames.Bedrooms} ge ${filter.listingDetail.bedrooms}`);
    }

    // Bathrooms - Greater than or equal
    if (filter.listingDetail?.bathrooms) {
      filterStrings.push(`${PropertyFilterNames.Bathrooms} ge ${filter.listingDetail.bathrooms}`);
    }

    // Amenities - ALL must match (AND logic)
    if (filter.listingDetail?.amenities && filter.listingDetail.amenities.length > 0) {
      filterStrings.push(
        "amenities/any(a: a eq '" + 
        filter.listingDetail.amenities.join("') and amenities/any(a: a eq '") + 
        "')"
      );
    }

    // Additional amenities - Complex nested filter
    if (filter.listingDetail?.additionalAmenities && filter.listingDetail.additionalAmenities.length > 0) {
      const additionalAmenitiesFilterStrings = filter.listingDetail.additionalAmenities.map((additionalAmenity) => {
        return `additionalAmenities/any(ad: ad/category eq '${additionalAmenity.category}' and ad/amenities/any(am: am eq '${additionalAmenity.amenities.join(
          "') and ad/amenities/any(am: am eq '"
        )}'))`;
      });
      filterStrings.push(additionalAmenitiesFilterStrings.join(' and '));
    }

    // Price range
    if (filter.listingDetail?.prices && filter.listingDetail.prices.length > 0) {
      filterStrings.push(
        `${PropertyFilterNames.Price} ge ${filter.listingDetail.prices[0]} and ${PropertyFilterNames.Price} le ${filter.listingDetail.prices[1]}`
      );
    }

    // Square feet range
    if (filter.listingDetail?.squareFeets && filter.listingDetail.squareFeets.length > 0) {
      filterStrings.push(
        `${PropertyFilterNames.SquareFeet} ge ${filter.listingDetail.squareFeets[0]} and ${PropertyFilterNames.SquareFeet} le ${filter.listingDetail.squareFeets[1]}`
      );
    }

    // Listed info - OR logic
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

    // Geo-spatial distance filter
    if (filter.position && filter.distance !== undefined) {
      filterStrings.push(
        `geo.distance(position, geography'POINT(${filter.position.longitude} ${filter.position.latitude})') le ${filter.distance}`
      );
    }

    // Updated at - Date range
    if (filter.updatedAt) {
      const day0 = dayjs().subtract(parseInt(filter.updatedAt), 'day').toISOString();
      filterStrings.push(`updatedAt ge ${day0}`);
    }

    // Created at - Date range
    if (filter.createdAt) {
      const day0 = dayjs().subtract(parseInt(filter.createdAt), 'day').toISOString();
      filterStrings.push(`createdAt ge ${day0}`);
    }

    // Tags - OR logic
    if (filter.tags && filter.tags.length > 0) {
      filterStrings.push(
        "(tags/any(a: a eq '" + 
        filter.tags.join("') or tags/any(a: a eq '") + 
        "'))"
      );
    }
  }

  console.log('filterStrings: ', filterStrings.join(' and '));
  return filterStrings.join(' and ');
}
```

### 8.2 Complete Filter String Builder (Service Ticket Search)

**File:** `src/app/application-services-impl/cognitive-search/service-ticket.ts`

```typescript
const ServiceTicketFilterNames = {
  RequestorId: 'requestorId',
  AssignedToId: 'assignedToId',
  Status: 'status',
  Priority: 'priority',
};

private getFilterString(filter: ServiceTicketsSearchFilterDetail, requestorId: string): string {
  let filterStrings = [];
  
  // Security: Always filter by requestor (user can only see their tickets)
  filterStrings.push(`(requestorId eq '${requestorId}')`);
  
  if (filter) {
    // Requestor ID - IN clause
    if (filter.requestorId && filter.requestorId.length > 0) {
      filterStrings.push(
        `search.in(${ServiceTicketFilterNames.RequestorId}, '${filter.requestorId.join(',')}',',')`
      );
    }

    // Assigned To ID - IN clause
    if (filter.assignedToId && filter.assignedToId.length > 0) {
      filterStrings.push(
        `search.in(${ServiceTicketFilterNames.AssignedToId}, '${filter.assignedToId.join(',')}',',')`
      );
    }

    // Status - IN clause
    if (filter.status && filter.status.length > 0) {
      filterStrings.push(
        `search.in(${ServiceTicketFilterNames.Status}, '${filter.status.join(',')}',',')`
      );
    }

    // Priority - OR logic (numeric equals)
    if (filter.priority && filter.priority.length > 0) {
      let priorityFilter = [];
      filter.priority.forEach((priority) => {
        priorityFilter.push(`${ServiceTicketFilterNames.Priority} eq ${priority}`);
      });
      filterStrings.push(`(${priorityFilter.join(' or ')})`);
    }
  }

  return filterStrings.join(' and ');
}
```

### 8.3 GraphQL Resolver Integration

**File:** `src/graphql/schema/types/property.resolvers.ts`

```typescript
const property: Resolvers = {
  Query: {
    propertiesSearch: async (_, { input }, context, info) => {
      const searchResults = await context.applicationServices.propertySearchApi.propertiesSearch(input);
      return await context.applicationServices.propertySearchApi.getPropertiesSearchResults(searchResults, input);
    },
  },
};

export default property;
```

**File:** `src/graphql/schema/types/service-ticket.resolvers.ts`

```typescript
const serviceTicket: Resolvers = {
  Query: {
    serviceTicketsSearch: async (_, { input }, context, info) => {
      const member = await getMemberForCurrentUser(context, context.communityId);
      const searchResults = await context.applicationServices.serviceTicketSearchApi.serviceTicketsSearch(input, member.id);
      return await context.applicationServices.serviceTicketSearchApi.getServiceTicketsSearchResults(searchResults);
    },
  },
};

export default serviceTicket;
```

---

## 9. Search Queries Used

### 9.1 Property Search Query Examples

**Basic text search:**
```typescript
await searchService.search('property-listings', 'beach house', {
  queryType: 'full',
  searchMode: 'all',
  includeTotalCount: true,
  top: 10,
  skip: 0
});
```

**Filtered search with community scope:**
```typescript
await searchService.search('property-listings', '', {
  queryType: 'full',
  searchMode: 'all',
  includeTotalCount: true,
  filter: `communityId eq '625641815f0e5d472135046c'`,
  top: 10,
  skip: 0
});
```

**Complex filter example:**
```typescript
const filter = `communityId eq '625641815f0e5d472135046c' and ` +
  `search.in(type, 'condo,townhouse',',') and ` +
  `bedrooms ge 2 and ` +
  `bathrooms ge 1.5 and ` +
  `price ge 100000 and price le 500000 and ` +
  `(listedForSale eq true or listedForRent eq true) and ` +
  `geo.distance(position, geography'POINT(-122.3321 47.6062)') le 10`;

await searchService.search('property-listings', searchText, {
  queryType: 'full',
  searchMode: 'all',
  includeTotalCount: true,
  filter: filter,
  facets: ['type', 'bedrooms', 'bathrooms', 'amenities'],
  top: 20,
  skip: 0,
  orderBy: ['price desc']
});
```

**Amenities filter (all must match):**
```typescript
const filter = `amenities/any(a: a eq 'pool') and amenities/any(a: a eq 'gym')`;
```

**Additional amenities filter (category + items):**
```typescript
const filter = `additionalAmenities/any(ad: ad/category eq 'Security' and ` +
  `ad/amenities/any(am: am eq '24/7 Guard') and ` +
  `ad/amenities/any(am: am eq 'CCTV'))`;
```

**Date-based filter:**
```typescript
const sevenDaysAgo = dayjs().subtract(7, 'day').toISOString();
const filter = `updatedAt ge ${sevenDaysAgo}`;
```

**Tags filter (any match):**
```typescript
const filter = `(tags/any(a: a eq 'luxury') or tags/any(a: a eq 'waterfront'))`;
```

### 9.2 Service Ticket Search Query Examples

**Basic search with security filter:**
```typescript
await searchService.search('service-ticket-index', 'plumbing leak', {
  queryType: 'full',
  searchMode: 'all',
  includeTotalCount: true,
  filter: `(requestorId eq 'user123')`,
  top: 10,
  skip: 0
});
```

**Status and priority filter:**
```typescript
const filter = `(requestorId eq 'user123') and ` +
  `search.in(status, 'OPEN,IN_PROGRESS',',') and ` +
  `(priority eq 1 or priority eq 2)`;

await searchService.search('service-ticket-index', searchText, {
  queryType: 'full',
  searchMode: 'all',
  includeTotalCount: true,
  filter: filter,
  facets: ['status', 'priority', 'assignedTo'],
  orderBy: ['priority asc', 'createdAt desc']
});
```

**Assigned tickets filter:**
```typescript
const filter = `(requestorId eq 'user123') and ` +
  `search.in(assignedToId, 'member456,member789',',')`;
```

### 9.3 Facet Request Examples

**Property facets with counts:**
```typescript
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
  'tags,count:1000'
]
```

**Service ticket facets:**
```typescript
facets: [
  'status',
  'priority', 
  'requestor',
  'requestorId',
  'assignedTo',
  'assignedToId'
]
```

### 9.4 Sort Examples

**Property sorting:**
```typescript
orderBy: ['price desc']          // Price high to low
orderBy: ['bedrooms desc']       // Most bedrooms first
orderBy: ['updatedAt desc']      // Recently updated first
orderBy: ['name asc']            // Alphabetical
```

**Service ticket sorting:**
```typescript
orderBy: ['priority asc', 'createdAt desc']  // High priority, then newest
orderBy: ['status asc', 'updatedAt desc']    // By status, then recent
```

### 9.5 Pagination Examples

**Page 1 (10 items):**
```typescript
{ top: 10, skip: 0 }
```

**Page 2:**
```typescript
{ top: 10, skip: 10 }
```

**Page 3:**
```typescript
{ top: 10, skip: 20 }
```

---

## 10. Architecture Patterns

### 10.1 Overall Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    GraphQL Resolvers                        │
│  (property.resolvers.ts, service-ticket.resolvers.ts)       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Application Services Layer                     │
│  (PropertySearchApiImpl, ServiceTicketSearchApiImpl)        │
│                extends CognitiveSearchDataSource            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           Infrastructure Services Layer                     │
│         (CognitiveSearchInfrastructureService)              │
└────────────────────────┬────────────────────────────────────┘
                         │
            ┌────────────┴────────────┐
            ▼                         ▼
┌──────────────────────┐    ┌──────────────────────┐
│  AzCognitiveSearch   │    │ MemoryCognitiveSearch│
│  (Azure SDK)         │    │  (In-Memory Mock)    │
└──────────────────────┘    └──────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│              Azure Cognitive Search Service                 │
│                  (Cloud Service)                            │
└─────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────┐
│                   Domain Events                             │
│  (PropertyUpdatedEvent, ServiceTicketUpdatedEvent, etc.)    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Event Handlers                             │
│  (property-updated-update-search-index.ts, etc.)            │
│         - Convert domain entity to search document          │
│         - Hash-based change detection                       │
│         - Retry logic (3 attempts)                          │
│         - Telemetry/tracing                                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           CognitiveSearchDomain Interface                   │
│  - createOrUpdateIndex()                                    │
│  - indexDocument()                                          │
│  - deleteDocument()                                         │
└─────────────────────────────────────────────────────────────┘
```

### 10.2 Dependency Injection Pattern

**Three-Layer DI:**

1. **Infrastructure Services Builder** - Creates concrete implementations
2. **Domain Implementation** - Wires up domain logic with infrastructure
3. **Application Context** - Provides services to resolvers/handlers

```typescript
// 1. Infrastructure Layer
class InfrastructureServicesBuilder {
  private _cognitiveSearch: CognitiveSearchInfrastructureService;
  
  constructor() {
    this._cognitiveSearch = this.InitCognitiveSearch();
  }
  
  private InitCognitiveSearch(): CognitiveSearchInfrastructureService {
    const searchKey = this.tryGetEnvVar('SEARCH_API_KEY');
    const endpoint = this.tryGetEnvVar('SEARCH_API_ENDPOINT');
    return new AzCognitiveSearchImpl(searchKey, endpoint);
  }
  
  public get cognitiveSearch(): CognitiveSearchInfrastructureService {
    return this._cognitiveSearch;
  }
}

// 2. Domain Layer
class DomainImpl<
  DatastoreImpl extends DatastoreDomain & DatastoreDomainInitializeable,
  CognitiveSearchImpl extends CognitiveSearchDomain & CognitiveSearchDomainInitializeable
> {
  constructor(
    private _datastoreImpl: DatastoreImpl,
    private _cognitiveSearchImpl: CognitiveSearchImpl,
    private _blobStorageImpl: BlobStorageDomain,
    private _vercelImpl: VercelDomain,
  ) {}
  
  public async startup(): Promise<void> {
    this._cognitiveSearchImpl.startup();
    RegisterEventHandlers(
      this._datastoreImpl,
      this._cognitiveSearchImpl,
      this._blobStorageImpl,
      this._vercelImpl
    );
  }
}

// 3. Application Layer
class CognitiveSearchDataSource<Context extends AppContext> {
  public async withSearch(
    func: (passport: Passport, search: CognitiveSearchInfrastructureService) => Promise<void>
  ): Promise<void> {
    let cognitiveSearch = this._context.infrastructureServices.cognitiveSearch;
    await func(passport, cognitiveSearch);
  }
}
```

### 10.3 Repository Pattern with Search

**Separation of concerns:**
- **Repository** - Database operations (CRUD)
- **Search Service** - Search operations (queries, facets)
- **Event Handlers** - Sync between repository and search

```typescript
// Write to database via repository
await propertyRepository.save(property);

// Event fired: PropertyUpdatedEvent

// Event handler catches and updates search index
EventBusInstance.register(PropertyUpdatedEvent, async (payload) => {
  const property = await repo.getById(payload.id);
  const searchDoc = convertToIndexDocument(property);
  await cognitiveSearch.indexDocument('property-listings', searchDoc);
});
```

### 10.4 Event-Driven Index Updates

**Pattern: Domain Event → Event Handler → Index Update**

```typescript
// 1. Domain entity raises event
class Property extends AggregateRoot {
  updateListingDetails(details: ListingDetails) {
    // ... update logic
    this.addIntegrationEvent(PropertyUpdatedEvent(this.id));
  }
}

// 2. Event bus dispatches to registered handlers
EventBusInstance.dispatch(PropertyUpdatedEvent(propertyId));

// 3. Handler processes event
EventBusInstance.register(PropertyUpdatedEvent, async (payload) => {
  // Retrieve latest data
  const property = await repo.getById(payload.id);
  
  // Convert to search document
  const doc = convertToIndexDocument(property);
  
  // Hash-based change detection
  const hash = generateHash(doc);
  if (property.hash !== hash) {
    // Update index with retry logic
    await retry(async () => {
      await cognitiveSearch.createOrUpdateIndex(indexName, indexSpec);
      await cognitiveSearch.indexDocument(indexName, doc);
      property.LastIndexed = new Date();
      property.Hash = hash;
      await repo.save(property);
    }, { retries: 3 });
  }
});
```

### 10.5 Strategy Pattern for Implementation Switching

**Interface-based implementation switching:**

```typescript
// Interface
interface CognitiveSearchDomain {
  createIndexIfNotExists(indexName: string, indexDefinition: SearchIndex): Promise<void>;
  createOrUpdateIndex(indexName: string, indexDefinition: SearchIndex): Promise<void>;
  deleteDocument(indexName: string, document: any): Promise<void>;
  indexDocument(indexName: string, document: any): Promise<void>;
}

// Azure Implementation
class AzCognitiveSearch implements CognitiveSearchDomain {
  // Real Azure SDK implementation
}

// Mock Implementation
class MemoryCognitiveSearch implements CognitiveSearchDomain {
  // In-memory implementation
}

// Factory decides which to use
function createCognitiveSearch(): CognitiveSearchDomain {
  if (process.env.NODE_ENV === 'test') {
    return new MemoryCognitiveSearch();
  }
  return new AzCognitiveSearch(apiKey, endpoint);
}
```

### 10.6 Data Source Pattern (Apollo-style)

**Provides context-aware access to services:**

```typescript
export class CognitiveSearchDataSource<Context extends AppContext> extends DataSource<Context> {
  
  public async withSearch(
    func: (passport: Passport, search: CognitiveSearchInfrastructureService) => Promise<void>
  ): Promise<void> {
    let passport = this._context.passport;  // User context
    let cognitiveSearch = this._context.infrastructureServices.cognitiveSearch;
    await func(passport, cognitiveSearch);
  }
}

// Usage in application service
class PropertySearchApiImpl extends CognitiveSearchDataSource<AppContext> {
  async propertiesSearch(input: PropertiesSearchInput) {
    let searchResults;
    await this.withSearch(async (_passport, searchService) => {
      searchResults = await searchService.search('property-listings', input.searchString, {
        // ... options
      });
    });
    return searchResults;
  }
}
```

### 10.7 Hash-Based Change Detection Pattern

**Prevents unnecessary index updates:**

```typescript
// 1. Generate hash excluding timestamp
function generateHash(doc: PropertyListingIndexDocument) {
  const docCopy = JSON.parse(JSON.stringify(doc));
  delete docCopy.updatedAt;  // Exclude from hash
  return crypto.createHash('sha256')
    .update(JSON.stringify(docCopy))
    .digest('base64');
}

// 2. Compare with stored hash
const currentHash = property.hash;
const newHash = generateHash(searchDoc);

if (currentHash === newHash) {
  console.log('No changes, skip index update');
  return;
}

// 3. Update index and store new hash
await cognitiveSearch.indexDocument(indexName, searchDoc);
property.Hash = newHash;
property.LastIndexed = new Date();
await repo.save(property);
```

### 10.8 Retry Pattern with Telemetry

**Resilient index updates with observability:**

```typescript
const tracer = trace.getTracer('PG:data-access');
tracer.startActiveSpan('updateSearchIndex', async (span) => {
  try {
    const maxAttempt = 3;
    
    await retry(
      async (failedCB, currentAttempt) => {
        if (currentAttempt > maxAttempt) {
          span.setStatus({ code: SpanStatusCode.ERROR, message: 'Index update failed' });
          property.UpdateIndexFailedDate = new Date();
          await repo.save(property);
        } else {
          span.addEvent('Index update attempt: ' + currentAttempt);
          await updateSearchIndex(doc, property, hash, repo);
        }
      },
      { retries: maxAttempt }
    );
    
    span.setStatus({ code: SpanStatusCode.OK, message: 'Index update successful' });
    span.end();
  } catch (ex) {
    span.recordException(ex);
    span.setStatus({ code: SpanStatusCode.ERROR, message: ex.message });
    span.end();
    throw ex;
  }
});
```

### 10.9 Multi-Tenancy Pattern

**Community-scoped search:**

```typescript
// Always include community filter
private getFilterString(filter: FilterDetail): string {
  let filterStrings = [];
  
  // Multi-tenancy: Always scope to community
  filterStrings.push(`communityId eq '${filter.communityId}'`);
  
  // Add other filters...
  
  return filterStrings.join(' and ');
}

// Security: User can only see their own service tickets
private getFilterString(filter: ServiceTicketsSearchFilterDetail, requestorId: string): string {
  let filterStrings = [];
  
  // Security: Always filter by requestor
  filterStrings.push(`(requestorId eq '${requestorId}')`);
  
  // Add other filters...
  
  return filterStrings.join(' and ');
}
```

### 10.10 Interface Segregation

**Layered interface hierarchy:**

```typescript
// Base domain interface (minimal)
interface CognitiveSearchDomain {
  createIndexIfNotExists(indexName: string, indexDefinition: SearchIndex): Promise<void>;
  createOrUpdateIndex(indexName: string, indexDefinition: SearchIndex): Promise<void>;
  deleteDocument(indexName: string, document: any): Promise<void>;
  indexDocument(indexName: string, document: any): Promise<void>;
}

// Lifecycle interface
interface CognitiveSearchDomainInitializeable {
  startup(): Promise<void>;
  shutdown(): Promise<void>;
}

// Infrastructure interface (adds search capability)
interface CognitiveSearchInfrastructureService 
  extends CognitiveSearchDomain, CognitiveSearchDomainInitializeable {
  search(indexName: string, searchText: string, options?: any): Promise<any>;
}

// Application-specific interfaces
interface PropertyCognitiveSearchApplicationService {
  propertiesSearch(input: PropertiesSearchInput): Promise<SearchDocumentsResult>;
  getPropertiesSearchResults(searchResults: SearchDocumentsResult, input: PropertiesSearchInput): Promise<PropertySearchResult>;
}
```

---

## Summary

This analysis documents a complete Azure Cognitive Search implementation with:

- ✅ **Two search indexes** (Properties & Service Tickets)
- ✅ **Full-text search** with Lucene query syntax
- ✅ **Complex filtering** (geo-spatial, ranges, collections, nested objects)
- ✅ **Faceted search** with custom aggregations
- ✅ **Event-driven indexing** with hash-based change detection
- ✅ **Retry logic** and telemetry integration
- ✅ **Multi-tenancy** and security filters
- ✅ **In-memory mock** for testing (partial implementation)
- ✅ **Clean architecture** with proper layer separation
- ✅ **Dependency injection** throughout
- ✅ **GraphQL integration** for API exposure

**Key Files for Mock Implementation:**
1. Index specs: `property-search-index-format.ts`, `service-ticket-search-index-format.ts`
2. Search logic: `property.ts`, `service-ticket.ts` (in application-services-impl)
3. Filter builders: Same files as #2
4. Mock reference: `seedwork/services-seedwork-cognitive-search-in-memory/index.ts`
5. Interfaces: `src/app/domain/infrastructure/cognitive-search/interfaces.ts`

**Environment Variables Needed:**
- `SEARCH_API_KEY`
- `SEARCH_API_ENDPOINT`
- `NODE_ENV`
- `MANAGED_IDENTITY_CLIENT_ID` (optional, for production)

---

**End of Analysis**

