import httpTrigger from ".";
import { MockContext } from "./mocks/mockContext";

var log = (function () {
    let main = <any>jest.fn((message) => message);

    let info = jest.fn((message) => message);
    main.info = info;

    return main;
    
})();

test('should return http status 401 when authentication fails', async () => {
    // ARRANGE
    const payload = {
        email: 'test@email.com'
    };

    const request = {
        method: 'GET',
        url: '/authcallback',
        body: payload,
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + 'dGVzdFVzZXI6dGVzdFBhc3N3b3JkMQ=='
        }
    };
    
    const mockContext = new MockContext();
    mockContext.log = log;

    // ACT
    await httpTrigger(mockContext, request);

    // ASSERT
    expect(mockContext.res.status).toBe(401);
});

test('should return http status 400 when payload missing', async () => {
    // ARRANGE
    const payload = {
        email: 'test'
    };

    const request = {
        method: 'GET',
        url: '/authcallback',
        body: payload,
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + 'dGVzdFVzZXI6dGVzdFBhc3N3b3Jk'
        }
    };
    
    const mockContext = new MockContext();
    mockContext.log = log;

    // ACT
    await httpTrigger(mockContext, request);

    // ASSERT
    expect(mockContext.res.status).toBe(400);
});