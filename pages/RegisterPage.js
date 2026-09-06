class RegisterPage {
  constructor(page) {
    this.page = page;
    this.firstNameInput = page.locator('#firstname');
    this.lastNameInput = page.locator('#lastname');
    this.usernameInput = page.locator('#userName');
    this.passwordInput = page.locator('#password');
    this.registerButton = page.locator('#register');
    this.errorMessage = page.locator('#name');
  }

  async open() {
    await this.page.goto('/register');
  }

  async register({ firstName, lastName, username, password }) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.registerButton.click();
  }

  async getErrorMessage() {
    return this.errorMessage.textContent();
  }
}

module.exports = { RegisterPage };
