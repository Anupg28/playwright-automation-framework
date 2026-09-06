const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { DemoQaApi } = require('../api/DemoQaApi');
const { uniqueUsername, strongPassword } = require('../utils/testData');

test.describe('Login', () => {
  let username;
  const password = strongPassword();

  test.beforeAll(async ({ request }) => {
    // Create the account via the API rather than the UI registration form - faster and keeps
    // this suite focused on testing login itself, not registration.
    username = uniqueUsername('login_test');
    const api = new DemoQaApi(request);
    const response = await api.createUser(username, password);
    expect(response.ok()).toBeTruthy();
  });

  test('valid credentials log the user in', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(username, password);

    await expect(page).toHaveURL(/.*\/profile/);
    await expect(page.locator('#userName-value')).toHaveText(username);
  });

  test('incorrect password shows a validation error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(username, 'WrongPassword@123');

    await expect(page).toHaveURL(/.*\/login/);
    // demoqa.com's post-submit reload can briefly sit on a "Loading..." screen longer than the
    // default 5s assertion timeout on a slow run - not a logic bug, just a slow real site.
    await expect(loginPage.errorMessage).toHaveText('Invalid username or password!', { timeout: 10000 });
  });

  test('unregistered username shows a validation error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(`no_such_user_${Date.now()}`, password);

    await expect(loginPage.errorMessage).toHaveText('Invalid username or password!', { timeout: 10000 });
  });
});
