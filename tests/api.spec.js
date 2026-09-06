const { test, expect, request } = require('@playwright/test');
const { DemoQaApi } = require('../api/DemoQaApi');
const { uniqueUsername, strongPassword } = require('../utils/testData');

test.describe('BookStore API', () => {
  let apiContext;
  let api;
  let username;
  let password;
  let userId;
  let token;

  test.beforeAll(async () => {
    // A manually-created APIRequestContext (rather than the per-test `request` fixture) is the
    // documented way to share one authenticated context across multiple tests in a describe
    // block - the fixture itself is scoped to a single test and can't be reused in beforeAll.
    apiContext = await request.newContext({ baseURL: 'https://demoqa.com' });
    api = new DemoQaApi(apiContext);

    username = uniqueUsername('api_test');
    password = strongPassword();

    const createResponse = await api.createUser(username, password);
    expect(createResponse.status()).toBe(201);
    const createBody = await createResponse.json();
    userId = createBody.userID;

    const tokenResponse = await api.generateToken(username, password);
    const tokenBody = await tokenResponse.json();
    expect(tokenBody.status).toBe('Success');
    token = tokenBody.token;
  });

  test.afterAll(async () => {
    if (userId && token) {
      await api.deleteUser(userId, token);
    }
    await apiContext.dispose();
  });

  test('creating a user returns a userID', async () => {
    expect(userId).toBeTruthy();
  });

  test('valid credentials are reported as authorized', async () => {
    const response = await api.isAuthorized(username, password);
    const body = await response.json();
    expect(body).toBe(true);
  });

  test('incorrect password fails token generation', async () => {
    const response = await api.generateToken(username, 'WrongPassword@123');
    const body = await response.json();
    expect(body.status).toBe('Failed');
    expect(body.token).toBeNull();
  });

  test('GET all books returns a non-empty catalog', async () => {
    const response = await api.getAllBooks();
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(Array.isArray(body.books)).toBe(true);
    expect(body.books.length).toBeGreaterThan(0);
  });

  test('adding a book to the user collection and verifying it via GET user', async () => {
    const catalog = await (await api.getAllBooks()).json();
    const isbn = catalog.books[0].isbn;

    const addResponse = await api.addBooksToUser(userId, [isbn], token);
    expect(addResponse.status()).toBe(201);

    const userResponse = await api.getUser(userId, token);
    const userBody = await userResponse.json();
    expect(userBody.books.some((b) => b.isbn === isbn)).toBe(true);

    const deleteResponse = await api.deleteBookFromUser(userId, isbn, token);
    expect(deleteResponse.status()).toBe(204);
  });
});
