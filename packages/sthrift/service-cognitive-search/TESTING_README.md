# ServiceCognitiveSearch Testing

This directory contains comprehensive test suites for the ShareThrift Cognitive Search implementation.

## 📂 Test Files

- **`src/__tests__/service-cognitive-search.test.ts`** - Tests for the main service wrapper (13 tests)
- **`src/__tests__/azure-search-service.test.ts`** - Tests for Azure implementation (28 tests)
- **`TEST_DOCUMENTATION.md`** - Complete documentation of all tests
- **`TEST_EXECUTION_SUMMARY.md`** - Summary of testing work and status
- **`vitest.config.ts`** - Vitest configuration

## 🎯 Test Coverage

**Total Tests:** 41

| Component | Tests | Coverage |
|-----------|-------|----------|
| ServiceCognitiveSearch | 13 | 100% |
| AzureCognitiveSearch | 28 | 100% |

## 🚀 Quick Start

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Run Specific Test File
```bash
npm test -- service-cognitive-search.test.ts
npm test -- azure-search-service.test.ts
```

## 📖 Documentation

For detailed information about each test, see:
- **[TEST_DOCUMENTATION.md](./TEST_DOCUMENTATION.md)** - Complete test documentation
- **[TEST_EXECUTION_SUMMARY.md](./TEST_EXECUTION_SUMMARY.md)** - Testing status and summary

## ✅ What's Tested

### ServiceCognitiveSearch (Environment-Aware Wrapper)
- ✅ Service lifecycle (startup/shutdown)
- ✅ Environment detection logic (mock vs Azure)
- ✅ Proxy methods to underlying services
- ✅ Fallback behavior on Azure configuration errors

### AzureCognitiveSearch (Azure Implementation)
- ✅ Authentication (API key and managed identity)
- ✅ Index management (create, update, delete, exists)
- ✅ Document operations (index, delete, error handling)
- ✅ Search operations (query, options, facets)
- ✅ Field type conversion (EDM types)
- ✅ Field attributes (defaults and configuration)

## 🔍 Test Quality

- ✅ **100% function coverage** of public APIs
- ✅ **All external dependencies mocked** (Azure SDK)
- ✅ **Type-safe tests** with proper TypeScript typing
- ✅ **Environment isolation** (no side effects between tests)
- ✅ **Error scenarios tested** (success and failure paths)
- ✅ **Fast execution** (<2 seconds for all tests)

## 🛠️ Test Patterns

All tests follow these best practices:

1. **Arrange-Act-Assert** pattern
2. **Descriptive test names** ("should...when..." format)
3. **Environment isolation** with beforeEach/afterEach hooks
4. **Mock cleanup** after each test
5. **Explicit assertions** for clear expectations

## 📝 Example Test

```typescript
it('should use mock implementation when USE_MOCK_SEARCH is true', () => {
  // Arrange
  process.env['USE_MOCK_SEARCH'] = 'true';
  
  // Act
  const service = new ServiceCognitiveSearch();
  
  // Assert
  expect(service['implementationType']).toBe('mock');
});
```

## 🐛 Troubleshooting

### Tests won't run
1. Ensure dependencies are installed: `npm install`
2. Check that vitest is available: `npx vitest --version`
3. Try running from workspace root: `npm test --workspace=@sthrift/service-cognitive-search`

### Mocks not working
- Ensure `vi.clearAllMocks()` is called in `beforeEach`
- Check that module paths in `vi.mock()` are correct
- Verify environment variables are restored in `afterEach`

### Environment variable issues
- Tests should save and restore `process.env`
- Use `beforeEach` and `afterEach` hooks for isolation
- Never modify `process.env` without restoration

## 📊 CI/CD Integration

These tests are designed to run in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Tests
  run: npm test --workspace=@sthrift/service-cognitive-search

- name: Generate Coverage
  run: npm test --workspace=@sthrift/service-cognitive-search -- --coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./packages/sthrift/service-cognitive-search/coverage/coverage-final.json
```

## 🔄 Maintaining Tests

### When adding new features
1. Add tests for the new functionality
2. Update TEST_DOCUMENTATION.md with test details
3. Ensure coverage remains >90%
4. Run all tests to verify no regressions

### When fixing bugs
1. Add a test that reproduces the bug
2. Fix the bug
3. Verify the test now passes
4. Document the bug and fix in test comments

## 🎓 Learning Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://testingjavascript.com/)
- [Mocking with Vitest](https://vitest.dev/guide/mocking.html)

## 📞 Support

For questions about tests:
1. Check TEST_DOCUMENTATION.md for detailed test descriptions
2. Review test code for usage examples
3. Contact the team for complex scenarios

---

**Last Updated:** October 23, 2025  
**Test Count:** 41 tests  
**Coverage:** 100% functions, >95% lines
