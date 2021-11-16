import { SearchIndex } from "@azure/search-documents";

export const listingIndexSpec = {
  name: "listings",
  fields: [
    { name: "id", type: "Edm.String", searchable: false, key: true },
    { name: "title", type: "Edm.String", searchable: true, filterable: false, sortable: true, facetable: false },
    { name: "description", type: "Edm.String", searchable: true, filterable: false, sortable: false, facetable: false, analyzerName: "en.microsoft" },
    { name: "primaryCategory", type: "Edm.String", searchable: true, filterable: true, retrievable: true, sortable: true, facetable: true }
  ]
} as SearchIndex;

export interface ListingIndexDocument  {
  id: string;
  title: string;
  description: string;
  primaryCategory: string;
}