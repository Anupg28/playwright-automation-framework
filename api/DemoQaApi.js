/**
 * Thin wrapper around demoqa.com's Account + BookStore REST API using Playwright's built-in
 * APIRequestContext - no separate HTTP client library needed, which is one of the things that
 * differentiates Playwright from a UI-only tool like Selenium for a framework like this.
 */
class DemoQaApi {
  constructor(request) {
    this.request = request;
  }

  async createUser(userName, password) {
    return this.request.post('/Account/v1/User', {
      data: { userName, password },
    });
  }

  async generateToken(userName, password) {
    return this.request.post('/Account/v1/GenerateToken', {
      data: { userName, password },
    });
  }

  async isAuthorized(userName, password) {
    return this.request.post('/Account/v1/Authorized', {
      data: { userName, password },
    });
  }

  async getUser(userId, token) {
    return this.request.get(`/Account/v1/User/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async deleteUser(userId, token) {
    return this.request.delete(`/Account/v1/User/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async getAllBooks() {
    return this.request.get('/BookStore/v1/Books');
  }

  async addBooksToUser(userId, isbns, token) {
    return this.request.post('/BookStore/v1/Books', {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        userId,
        collectionOfIsbns: isbns.map((isbn) => ({ isbn })),
      },
    });
  }

  async deleteBookFromUser(userId, isbn, token) {
    return this.request.delete('/BookStore/v1/Book', {
      headers: { Authorization: `Bearer ${token}` },
      data: { isbn, userId },
    });
  }
}

module.exports = { DemoQaApi };
