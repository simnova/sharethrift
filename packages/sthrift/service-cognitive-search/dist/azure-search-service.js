"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureCognitiveSearch = void 0;
var search_documents_1 = require("@azure/search-documents");
var identity_1 = require("@azure/identity");
/**
 * Azure Cognitive Search implementation
 *
 * Provides a wrapper around Azure Cognitive Search that implements
 * the CognitiveSearchBase interface for consistency with the mock implementation.
 */
var AzureCognitiveSearch = /** @class */ (function () {
    function AzureCognitiveSearch() {
        this.searchClients = new Map();
        this.endpoint = process.env['SEARCH_API_ENDPOINT'] || '';
        if (!this.endpoint) {
            throw new Error('SEARCH_API_ENDPOINT environment variable is required for Azure Cognitive Search');
        }
        // Use API key if provided, otherwise use Azure credentials
        var apiKey = process.env['SEARCH_API_KEY'];
        if (apiKey) {
            this.credential = new search_documents_1.AzureKeyCredential(apiKey);
            console.log('AzureCognitiveSearch: Using API key authentication');
        }
        else {
            this.credential = new identity_1.DefaultAzureCredential();
            console.log('AzureCognitiveSearch: Using Azure credential authentication');
        }
        this.indexClient = new search_documents_1.SearchIndexClient(this.endpoint, this.credential);
    }
    /**
     * Service lifecycle methods
     */
    AzureCognitiveSearch.prototype.startup = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('AzureCognitiveSearch: Starting up');
                        // Azure client doesn't need explicit startup - connection is lazy
                        return [4 /*yield*/, Promise.resolve()];
                    case 1:
                        // Azure client doesn't need explicit startup - connection is lazy
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AzureCognitiveSearch.prototype.shutdown = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('AzureCognitiveSearch: Shutting down');
                        this.searchClients.clear();
                        return [4 /*yield*/, Promise.resolve()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Convert our SearchIndex format to Azure's SearchIndex format
     */
    AzureCognitiveSearch.prototype.convertToAzureIndex = function (indexDefinition) {
        var _this = this;
        var azureFields = indexDefinition.fields.map(function (field) { return ({
            name: field.name,
            type: _this.convertFieldType(field.type),
            searchable: field.searchable || false,
            filterable: field.filterable || false,
            sortable: field.sortable || false,
            facetable: field.facetable || false,
            key: field.key || false,
            retrievable: field.retrievable !== false, // Default to true
        }); });
        return {
            name: indexDefinition.name,
            fields: azureFields,
        };
    };
    /**
     * Convert our field types to Azure field types
     */
    AzureCognitiveSearch.prototype.convertFieldType = function (type) {
        var typeMap = {
            'Edm.String': 'Edm.String',
            'Edm.Int32': 'Edm.Int32',
            'Edm.Double': 'Edm.Double',
            'Edm.Boolean': 'Edm.Boolean',
            'Edm.DateTimeOffset': 'Edm.DateTimeOffset',
            'Edm.GeographyPoint': 'Edm.GeographyPoint',
            'Collection(Edm.String)': 'Collection(Edm.String)',
            'Collection(Edm.ComplexType)': 'Collection(Edm.ComplexType)',
            'Edm.ComplexType': 'Edm.ComplexType',
        };
        return typeMap[type] || 'Edm.String';
    };
    /**
     * Get or create a search client for the given index
     */
    AzureCognitiveSearch.prototype.getSearchClient = function (indexName) {
        if (!this.searchClients.has(indexName)) {
            var client_1 = new search_documents_1.SearchClient(this.endpoint, indexName, this.credential);
            this.searchClients.set(indexName, client_1);
        }
        var client = this.searchClients.get(indexName);
        if (!client) {
            throw new Error("Search client not found for index: ".concat(indexName));
        }
        return client;
    };
    /**
     * Index management methods
     */
    AzureCognitiveSearch.prototype.createIndexIfNotExists = function (indexDefinition) {
        return __awaiter(this, void 0, void 0, function () {
            var azureIndex, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        azureIndex = this.convertToAzureIndex(indexDefinition);
                        return [4 /*yield*/, this.indexClient.createOrUpdateIndex(azureIndex)];
                    case 1:
                        _a.sent();
                        console.log("AzureCognitiveSearch: Index ".concat(indexDefinition.name, " created or updated"));
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error("AzureCognitiveSearch: Failed to create index ".concat(indexDefinition.name, ":"), error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AzureCognitiveSearch.prototype.createOrUpdateIndexDefinition = function (_indexName, indexDefinition) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createIndexIfNotExists(indexDefinition)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AzureCognitiveSearch.prototype.deleteIndex = function (indexName) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.indexClient.deleteIndex(indexName)];
                    case 1:
                        _a.sent();
                        this.searchClients.delete(indexName);
                        console.log("AzureCognitiveSearch: Index ".concat(indexName, " deleted"));
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error("AzureCognitiveSearch: Failed to delete index ".concat(indexName, ":"), error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AzureCognitiveSearch.prototype.indexExists = function (indexName) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.indexClient.getIndex(indexName)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, true];
                    case 2:
                        _a = _b.sent();
                        // Index doesn't exist if we get a 404
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Document operations
     */
    AzureCognitiveSearch.prototype.indexDocument = function (indexName, document) {
        return __awaiter(this, void 0, void 0, function () {
            var client, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        client = this.getSearchClient(indexName);
                        return [4 /*yield*/, client.mergeOrUploadDocuments([document])];
                    case 1:
                        _a.sent();
                        console.log("AzureCognitiveSearch: Document indexed in ".concat(indexName));
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error("AzureCognitiveSearch: Failed to index document in ".concat(indexName, ":"), error_3);
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AzureCognitiveSearch.prototype.deleteDocument = function (indexName, document) {
        return __awaiter(this, void 0, void 0, function () {
            var client, keyField, error_4;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        client = this.getSearchClient(indexName);
                        keyField = document['id'] || document['key'];
                        if (!keyField) {
                            throw new Error('Document must have an id or key field for deletion');
                        }
                        return [4 /*yield*/, client.deleteDocuments([
                                (_a = {}, _a[keyField] = document[keyField], _a),
                            ])];
                    case 1:
                        _b.sent();
                        console.log("AzureCognitiveSearch: Document deleted from ".concat(indexName));
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _b.sent();
                        console.error("AzureCognitiveSearch: Failed to delete document from ".concat(indexName, ":"), error_4);
                        throw error_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Search operations
     */
    AzureCognitiveSearch.prototype.search = function (indexName, searchText, options) {
        return __awaiter(this, void 0, void 0, function () {
            var client, azureOptions, result, documents, _a, _b, _c, doc, e_1_1, convertedFacets, _i, _d, _e, key, facetArray, error_5;
            var _f, e_1, _g, _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        _j.trys.push([0, 14, , 15]);
                        client = this.getSearchClient(indexName);
                        azureOptions = {};
                        if (options && 'top' in options) {
                            azureOptions['top'] = options['top'];
                        }
                        if (options && 'skip' in options) {
                            azureOptions['skip'] = options['skip'];
                        }
                        if (options && 'filter' in options) {
                            azureOptions['filter'] = options['filter'];
                        }
                        if (options && 'facets' in options) {
                            azureOptions['facets'] = options['facets'];
                        }
                        if (options && 'orderBy' in options) {
                            azureOptions['orderBy'] = options['orderBy'];
                        }
                        if (options && 'includeTotalCount' in options) {
                            azureOptions['includeTotalCount'] = options['includeTotalCount'];
                        }
                        return [4 /*yield*/, client.search(searchText, azureOptions)];
                    case 1:
                        result = _j.sent();
                        documents = [];
                        _j.label = 2;
                    case 2:
                        _j.trys.push([2, 7, 8, 13]);
                        _a = true, _b = __asyncValues(result.results);
                        _j.label = 3;
                    case 3: return [4 /*yield*/, _b.next()];
                    case 4:
                        if (!(_c = _j.sent(), _f = _c.done, !_f)) return [3 /*break*/, 6];
                        _h = _c.value;
                        _a = false;
                        doc = _h;
                        documents.push({
                            document: doc.document,
                            score: doc.score,
                        });
                        _j.label = 5;
                    case 5:
                        _a = true;
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 13];
                    case 7:
                        e_1_1 = _j.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 13];
                    case 8:
                        _j.trys.push([8, , 11, 12]);
                        if (!(!_a && !_f && (_g = _b.return))) return [3 /*break*/, 10];
                        return [4 /*yield*/, _g.call(_b)];
                    case 9:
                        _j.sent();
                        _j.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 12: return [7 /*endfinally*/];
                    case 13:
                        convertedFacets = {};
                        if (result.facets) {
                            for (_i = 0, _d = Object.entries(result.facets); _i < _d.length; _i++) {
                                _e = _d[_i], key = _e[0], facetArray = _e[1];
                                convertedFacets[key] = facetArray.map(function (facet) { return ({
                                    value: facet['value'] || '',
                                    count: facet['count'] || 0,
                                }); });
                            }
                        }
                        return [2 /*return*/, {
                                results: documents,
                                count: result.count || 0,
                                facets: convertedFacets,
                            }];
                    case 14:
                        error_5 = _j.sent();
                        console.error("AzureCognitiveSearch: Failed to search ".concat(indexName, ":"), error_5);
                        throw error_5;
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    return AzureCognitiveSearch;
}());
exports.AzureCognitiveSearch = AzureCognitiveSearch;
