// A valid 1x1 transparent PNG, used so the form's file upload field can be exercised
// without committing a binary asset file to the repo.
const TINY_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

class PracticeFormPage {
  constructor(page) {
    this.page = page;
    this.firstNameInput = page.locator('#firstName');
    this.lastNameInput = page.locator('#lastName');
    this.emailInput = page.locator('#userEmail');
    this.mobileInput = page.locator('#userNumber');
    this.dateOfBirthInput = page.locator('#dateOfBirthInput');
    this.subjectsInput = page.locator('#subjectsInput');
    this.currentAddressInput = page.locator('#currentAddress');
    this.pictureUpload = page.locator('#uploadPicture');
    this.stateDropdown = page.locator('#state');
    this.cityDropdown = page.locator('#city');
    this.submitButton = page.locator('#submit');
    this.modalTitle = page.locator('#example-modal-sizes-title-lg');
    this.modalBody = page.locator('.modal-body');
    this.closeModalButton = page.locator('#closeLargeModal');
  }

  async open() {
    await this.page.goto('/automation-practice-form');
  }

  async fillPersonalDetails({ firstName, lastName, email, mobile }) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.mobileInput.fill(mobile);
  }

  async selectGender(gender) {
    // The radio inputs are visually hidden; their <label> is what's actually clickable.
    await this.page.locator(`label[for="gender-radio-${gender.index}"]`).click();
  }

  async setDateOfBirth(dateText) {
    await this.dateOfBirthInput.click();
    await this.dateOfBirthInput.press('Control+A');
    await this.dateOfBirthInput.type(dateText);
    await this.dateOfBirthInput.press('Escape');
  }

  async addSubject(subject) {
    // This field is a react-select input: .fill() sets the DOM value directly, but the
    // component's controlled state doesn't register it without real keystroke events, so the
    // field silently reverts to empty. Real keystrokes via keyboard.type() are what actually
    // drive its internal search/filter state (same reason selectState/selectCity use it too).
    await this.subjectsInput.click();
    await this.page.keyboard.type(subject);
    // Clicking the suggested option (rather than pressing Enter) avoids a separate gotcha: the
    // practice form is wrapped in an actual <form> element, so Enter inside any of its text
    // inputs can trigger a native browser form submission before the rest of the fields are
    // filled, instead of just confirming the autocomplete selection.
    await this.page.getByRole('option', { name: subject, exact: false }).first().click();
  }

  async selectHobby(hobbyIndex) {
    await this.page.locator(`label[for="hobbies-checkbox-${hobbyIndex}"]`).click();
  }

  async uploadProfilePicture(fileName = 'profile.png') {
    await this.pictureUpload.setInputFiles({
      name: fileName,
      mimeType: 'image/png',
      buffer: Buffer.from(TINY_PNG_BASE64, 'base64'),
    });
  }

  async fillCurrentAddress(address) {
    await this.currentAddressInput.fill(address);
  }

  async selectState(stateName) {
    await this.stateDropdown.click();
    await this.page.keyboard.type(stateName);
    await this.page.getByRole('option', { name: stateName, exact: false }).first().click();
  }

  async selectCity(cityName) {
    await this.cityDropdown.click();
    await this.page.keyboard.type(cityName);
    await this.page.getByRole('option', { name: cityName, exact: false }).first().click();
  }

  async submit() {
    await this.submitButton.scrollIntoViewIfNeeded();
    await this.submitButton.click();
  }

  async getModalBodyText() {
    return this.modalBody.textContent();
  }
}

module.exports = { PracticeFormPage, TINY_PNG_BASE64 };
