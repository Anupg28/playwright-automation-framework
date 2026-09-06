const { test, expect } = require('@playwright/test');
const { PracticeFormPage } = require('../pages/PracticeFormPage');

test.describe('Automation Practice Form', () => {
  test('submitting a fully completed form shows a correct confirmation summary', async ({ page }) => {
    const form = new PracticeFormPage(page);
    await form.open();

    await form.fillPersonalDetails({
      firstName: 'Anup',
      lastName: 'Ghodake',
      email: 'anup.qa.automation@example.com',
      mobile: '9876543210',
    });
    await form.selectGender({ index: 1 }); // Male
    await form.setDateOfBirth('10 Jan 1995');
    await form.addSubject('Maths');
    await form.selectHobby(1); // Sports
    await form.uploadProfilePicture();
    await form.fillCurrentAddress('221B Baker Street, Pune, India');
    await form.selectState('NCR');
    await form.selectCity('Delhi');

    await form.submit();

    await expect(form.modalTitle).toHaveText('Thanks for submitting the form');
    const summary = await form.getModalBodyText();
    expect(summary).toContain('Anup Ghodake');
    expect(summary).toContain('anup.qa.automation@example.com');
    expect(summary).toContain('9876543210');
    expect(summary).toContain('Sports');
    expect(summary).toContain('221B Baker Street, Pune, India');
    expect(summary).toContain('NCR Delhi');
  });

  test('submitting with required fields empty does not show the confirmation modal', async ({ page }) => {
    const form = new PracticeFormPage(page);
    await form.open();

    // Only fill a non-required field, leave first/last name, mobile, and gender empty.
    await form.fillCurrentAddress('Incomplete submission attempt');
    await form.submit();

    await expect(form.modalTitle).toBeHidden();
    // Required fields render a red validation border on a blocked submit attempt.
    await expect(form.firstNameInput).toHaveCSS('border-color', 'rgb(220, 53, 69)');
  });
});
