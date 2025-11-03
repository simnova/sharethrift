"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LunrSearchEngine = void 0;
var lunr_1 = require("lunr");
var liqe_filter_engine_js_1 = require("./liqe-filter-engine.js");
/**
 * Lunr.js Search Engine Wrapper with LiQE Integration
 *
 * Provides enhanced full-text search capabilities with:
 * - Relevance scoring based on TF-IDF
 * - Field boosting (title gets higher weight than description)
 * - Stemming and stop word filtering
 * - Fuzzy matching and wildcard support
 * - Multi-field search across all searchable fields
 * - Advanced OData-like filtering via LiQE integration
 *
 * This class encapsulates the Lunr.js functionality and provides a clean interface
 * for building and querying search indexes with Azure Cognitive Search compatibility.
 * Enhanced with LiQE for sophisticated filtering capabilities.
 */
var LunrSearchEngine = /** @class */ (function () {
    function LunrSearchEngine() {
        this.indexes = new Map();
        this.documents = new Map();
        this.indexDefinitions = new Map();
        this.liqeFilterEngine = new liqe_filter_engine_js_1.LiQEFilterEngine();
    }
    /**
     * Build a Lunr.js index for the given index name
     *
     * @param indexName - The name of the search index to build
     * @param fields - Array of search field definitions with their capabilities
     * @param documents - Array of documents to index initially
     */
    LunrSearchEngine.prototype.buildIndex = function (indexName, fields, documents) {
        // Store the index definition for later reference
        this.indexDefinitions.set(indexName, { fields: fields });
        // Store documents for retrieval
        var documentMap = new Map();
        documents.forEach(function (doc) {
            var docId = doc['id'];
            if (docId) {
                documentMap.set(docId, doc);
            }
        });
        this.documents.set(indexName, documentMap);
        // Build Lunr index
        var idx = lunr_1.default(function () {
            var _this = this;
            // Set the reference field (unique identifier)
            this.ref('id');
            // Add fields with boosting
            fields.forEach(function (field) {
                if (field.searchable && field.type === 'Edm.String') {
                    // Boost title field significantly more than others
                    var boost = field.name === 'title' ? 10 : field.name === 'description' ? 2 : 1;
                    _this.field(field.name, { boost: boost });
                }
            });
            // Add all documents to the index
            documents.forEach(function (doc) {
                _this.add(doc);
            });
        });
        this.indexes.set(indexName, idx);
    };
    /**
     * Rebuild the index for an index name (used when documents are updated)
     *
     * @param indexName - The name of the index to rebuild
     */
    LunrSearchEngine.prototype.rebuildIndex = function (indexName) {
        var documentMap = this.documents.get(indexName);
        var indexDef = this.indexDefinitions.get(indexName);
        if (!documentMap || !indexDef) {
            console.warn("Cannot rebuild index ".concat(indexName, ": missing documents or definition"));
            return;
        }
        var documents = Array.from(documentMap.values());
        this.buildIndex(indexName, indexDef.fields, documents);
    };
    /**
     * Add a document to an existing index
     *
     * @param indexName - The name of the index to add the document to
     * @param document - The document to add to the index
     */
    LunrSearchEngine.prototype.addDocument = function (indexName, document) {
        var documentMap = this.documents.get(indexName);
        if (!documentMap) {
            console.warn("Cannot add document to ".concat(indexName, ": index not found"));
            return;
        }
        var docId = document['id'];
        if (!docId) {
            console.warn('Document must have an id field');
            return;
        }
        documentMap.set(docId, document);
        this.rebuildIndex(indexName);
    };
    /**
     * Remove a document from an index
     *
     * @param indexName - The name of the index to remove the document from
     * @param documentId - The ID of the document to remove
     */
    LunrSearchEngine.prototype.removeDocument = function (indexName, documentId) {
        var documentMap = this.documents.get(indexName);
        if (!documentMap) {
            console.warn("Cannot remove document from ".concat(indexName, ": index not found"));
            return;
        }
        documentMap.delete(documentId);
        this.rebuildIndex(indexName);
    };
    /**
     * Search using Lunr.js with enhanced query processing
     *
     * @param indexName - The name of the index to search
     * @param searchText - The search query text
     * @param options - Optional search parameters (filters, pagination, facets, etc.)
     * @returns Search results with relevance scoring and facets
     */
    LunrSearchEngine.prototype.search = function (indexName, searchText, options) {
        var idx = this.indexes.get(indexName);
        var documentMap = this.documents.get(indexName);
        if (!idx || !documentMap) {
            return { results: [], count: 0, facets: {} };
        }
        // Handle empty search - return all documents if no search text
        if (!searchText || searchText.trim() === '' || searchText === '*') {
            var allDocuments = Array.from(documentMap.values());
            // Apply LiQE filters if provided, even for empty search
            var filteredDocuments = allDocuments;
            if (options === null || options === void 0 ? void 0 : options.filter) {
                var searchResults = allDocuments.map(function (doc) { return ({
                    document: doc,
                    score: 1.0,
                }); });
                var filteredResults = this.liqeFilterEngine.applyAdvancedFilter(searchResults, options.filter);
                filteredDocuments = filteredResults.map(function (result) { return result.document; });
            }
            var results = this.applyPaginationAndSorting(filteredDocuments, options);
            // Process facets if requested
            var facets = (options === null || options === void 0 ? void 0 : options.facets) && options.facets.length > 0
                ? this.processFacets(filteredDocuments.map(function (doc) { return ({ document: doc, score: 1.0 }); }), options.facets)
                : {};
            var result = {
                results: results.map(function (doc) { return ({ document: doc, score: 1.0 }); }),
                facets: facets,
                count: filteredDocuments.length, // Always include count for empty searches
            };
            return result;
        }
        // Process search query with enhanced features
        var processedQuery = this.processSearchQuery(searchText);
        try {
            // Execute Lunr search - handle both simple text and wildcard queries
            var lunrResults = void 0;
            if (searchText.includes('*')) {
                // For wildcard queries, use the original text without processing
                lunrResults = idx.search(searchText);
            }
            else {
                lunrResults = idx.search(processedQuery);
            }
            // Convert Lunr results to our format
            var searchResults = lunrResults.map(function (result) {
                var document = documentMap.get(result.ref);
                return document
                    ? {
                        document: document,
                        score: result.score,
                    }
                    : null;
            });
            var results = searchResults.filter(function (result) { return result !== null; });
            // Apply additional filters if provided using LiQE for advanced filtering
            var filteredResults = (options === null || options === void 0 ? void 0 : options.filter)
                ? this.liqeFilterEngine.applyAdvancedFilter(results, options.filter)
                : results;
            // Apply sorting, pagination, and facets
            var finalResults = this.processFacetsAndPagination(filteredResults, options);
            return finalResults;
        }
        catch (error) {
            console.warn("Lunr search failed for query \"".concat(searchText, "\":"), error);
            // Fallback to empty results for malformed queries
            return { results: [], count: 0, facets: {} };
        }
    };
    /**
     * Process search query to add fuzzy matching and wildcard support
     *
     * @param searchText - The original search text
     * @returns Processed search text with wildcards and fuzzy matching
     * @private
     */
    LunrSearchEngine.prototype.processSearchQuery = function (searchText) {
        // If query already contains wildcards or fuzzy operators, use as-is
        if (searchText.includes('*') || searchText.includes('~')) {
            return searchText;
        }
        // For simple queries, add wildcard for prefix matching
        // This helps with partial word matches
        return "".concat(searchText, "*");
    };
    /**
     * Apply facets, sorting, and pagination
     */
    LunrSearchEngine.prototype.processFacetsAndPagination = function (results, options) {
        // Apply sorting if provided (default to relevance score descending)
        var sortedResults = results;
        if ((options === null || options === void 0 ? void 0 : options.orderBy) && options.orderBy.length > 0) {
            sortedResults = this.applySorting(results, options.orderBy);
        }
        else {
            // Default sort by relevance score (descending)
            sortedResults = results.sort(function (a, b) { return (b.score || 0) - (a.score || 0); });
        }
        // Apply pagination
        var skip = (options === null || options === void 0 ? void 0 : options.skip) || 0;
        var top = (options === null || options === void 0 ? void 0 : options.top) || 50;
        var totalCount = sortedResults.length;
        var paginatedResults = sortedResults.slice(skip, skip + top);
        // Process facets if requested
        var facets = (options === null || options === void 0 ? void 0 : options.facets) && options.facets.length > 0
            ? this.processFacets(sortedResults, options.facets)
            : {};
        var result = {
            results: paginatedResults,
            facets: facets,
            count: totalCount, // Always include count for consistency
        };
        return result;
    };
    /**
     * Apply sorting to results
     */
    LunrSearchEngine.prototype.applySorting = function (results, orderBy) {
        var _this = this;
        return results.sort(function (a, b) {
            for (var _i = 0, orderBy_1 = orderBy; _i < orderBy_1.length; _i++) {
                var sortField = orderBy_1[_i];
                var parts = sortField.split(' ');
                var fieldName = parts[0];
                var direction = parts[1] || 'asc';
                if (!fieldName)
                    continue;
                var aValue = _this.getFieldValue(a.document, fieldName);
                var bValue = _this.getFieldValue(b.document, fieldName);
                var comparison = 0;
                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    if (aValue < bValue)
                        comparison = -1;
                    else if (aValue > bValue)
                        comparison = 1;
                }
                else if (typeof aValue === 'number' && typeof bValue === 'number') {
                    if (aValue < bValue)
                        comparison = -1;
                    else if (aValue > bValue)
                        comparison = 1;
                }
                if (direction.toLowerCase() === 'desc') {
                    comparison = -comparison;
                }
                if (comparison !== 0) {
                    return comparison;
                }
            }
            return 0;
        });
    };
    /**
     * Process facets for the results
     */
    LunrSearchEngine.prototype.processFacets = function (results, facetFields) {
        var _this = this;
        var facets = {};
        facetFields.forEach(function (fieldName) {
            var valueCounts = new Map();
            results.forEach(function (result) {
                var fieldValue = _this.getFieldValue(result.document, fieldName);
                if (fieldValue !== undefined && fieldValue !== null) {
                    var value = fieldValue;
                    valueCounts.set(value, (valueCounts.get(value) || 0) + 1);
                }
            });
            facets[fieldName] = Array.from(valueCounts.entries())
                .map(function (_a) {
                var value = _a[0], count = _a[1];
                return ({ value: value, count: count });
            })
                .sort(function (a, b) { return b.count - a.count; });
        });
        return facets;
    };
    /**
     * Apply pagination and sorting to documents (for empty search)
     */
    LunrSearchEngine.prototype.applyPaginationAndSorting = function (documents, options) {
        var _this = this;
        var sortedDocs = documents;
        if ((options === null || options === void 0 ? void 0 : options.orderBy) && options.orderBy.length > 0) {
            sortedDocs = documents.sort(function (a, b) {
                var _a;
                for (var _i = 0, _b = (_a = options.orderBy) !== null && _a !== void 0 ? _a : []; _i < _b.length; _i++) {
                    var sortField = _b[_i];
                    var parts = sortField.split(' ');
                    var fieldName = parts[0];
                    var direction = parts[1] || 'asc';
                    if (!fieldName)
                        continue;
                    var aValue = _this.getFieldValue(a, fieldName);
                    var bValue = _this.getFieldValue(b, fieldName);
                    var comparison = 0;
                    if (typeof aValue === 'string' && typeof bValue === 'string') {
                        if (aValue < bValue)
                            comparison = -1;
                        else if (aValue > bValue)
                            comparison = 1;
                    }
                    else if (typeof aValue === 'number' && typeof bValue === 'number') {
                        if (aValue < bValue)
                            comparison = -1;
                        else if (aValue > bValue)
                            comparison = 1;
                    }
                    if (direction.toLowerCase() === 'desc') {
                        comparison = -comparison;
                    }
                    if (comparison !== 0) {
                        return comparison;
                    }
                }
                return 0;
            });
        }
        // Apply pagination
        var skip = (options === null || options === void 0 ? void 0 : options.skip) || 0;
        var top = (options === null || options === void 0 ? void 0 : options.top) || 50;
        return sortedDocs.slice(skip, skip + top);
    };
    /**
     * Get field value from document (supports nested field access)
     */
    LunrSearchEngine.prototype.getFieldValue = function (document, fieldName) {
        return fieldName.split('.').reduce(function (obj, key) {
            if (obj && typeof obj === 'object' && key in obj) {
                return obj[key];
            }
            return undefined;
        }, document);
    };
    /**
     * Check if an index exists
     *
     * @param indexName - The name of the index to check
     * @returns True if the index exists, false otherwise
     */
    LunrSearchEngine.prototype.hasIndex = function (indexName) {
        return this.indexes.has(indexName);
    };
    /**
     * Get index statistics for debugging and monitoring
     *
     * @param indexName - The name of the index to get statistics for
     * @returns Statistics object with document count and field count, or null if index doesn't exist
     */
    LunrSearchEngine.prototype.getIndexStats = function (indexName) {
        var documentMap = this.documents.get(indexName);
        var indexDef = this.indexDefinitions.get(indexName);
        if (!documentMap || !indexDef) {
            return null;
        }
        return {
            documentCount: documentMap.size,
            fieldCount: indexDef.fields.length,
        };
    };
    /**
     * Get information about supported LiQE filter capabilities
     *
     * @returns Object containing supported operators, functions, and examples
     */
    LunrSearchEngine.prototype.getFilterCapabilities = function () {
        return this.liqeFilterEngine.getSupportedFeatures();
    };
    /**
     * Validate if a filter string is supported by LiQE
     *
     * @param filterString - Filter string to validate
     * @returns True if the filter can be parsed by LiQE, false otherwise
     */
    LunrSearchEngine.prototype.isFilterSupported = function (filterString) {
        return this.liqeFilterEngine.isFilterSupported(filterString);
    };
    return LunrSearchEngine;
}());
exports.LunrSearchEngine = LunrSearchEngine;
