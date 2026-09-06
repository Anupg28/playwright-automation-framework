class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#userName');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login');
    this.newUserButton = page.locator('#newUser');
    this.errorMessage = page.locator('#name');
  }

  async open() {
    await this.page.goto('/login');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async goToRegister() {
    await this.newUserButton.click();
  }

  async getErrorMessage() {
    return this.errorMessage.textContent();
  }
}

module.exports = { LoginPage };
