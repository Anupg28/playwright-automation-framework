# Playwright Automation Framework

A UI + API test automation framework built with **Playwright and JavaScript**, targeting [demoqa.com](https://demoqa.com) — a public site with both a rich, multi-field-type form and a documented REST API on the same backend, which lets one framework demonstrate both sides without a separate tool.

## Tech Stack

- **Playwright Test** (`@playwright/test`) — browser automation, test runner, assertions, and API testing (`APIRequestContext`) in one tool
- **JavaScript** (Node.js)
- **GitHub Actions** — CI on every push/PR to `main`
- Page Object Model for UI pages, a thin API client class for REST calls

## What's covered

| Area | File | What it tests |
|---|---|---|
| Login | `tests/login.spec.js` | Valid login, wrong password, unregistered username |
| Practice Form | `tests/practiceForm.spec.js` | Full submission across text fields, radio, date picker, autocomplete, checkboxes, file upload, and searchable dropdowns; blocked submission when required fields are empty |
| BookStore API | `tests/api.spec.js` | User creation, token generation (success + failure), authorization check, book catalog retrieval, adding/removing a book from a user's collection |

## Project structure

```
playwright-automation-framework/
├── pages/              # Page Object Model classes (LoginPage, RegisterPage, PracticeFormPage)
├── api/                # DemoQaApi - thin wrapper around the Account/BookStore REST endpoints
├── tests/              # Spec files
├── utils/              # Shared test data helpers
├── playwright.config.js
└── .github/workflows/ci.yml
```

## Running locally

```bash
npm install
npx playwright install --with-deps chromium
npx playwright test              # headless
npx playwright test --headed     # see the browser
npm run test:api                 # API tests only
npm run report                   # open the last HTML report
```

## Design decisions worth knowing about

A few things in this framework exist because of real behavior discovered while building it against a live, public, ad-supported site — not defaults picked in advance:

- **Ad-network domains are blocked at the DNS level** (`playwright.config.js`, via `--host-resolver-rules`). demoqa.com serves real ad content, including a fixed bottom banner known to overlap form controls. This was a hard-won lesson from an earlier framework in this portfolio ([selenium-java-framework](https://github.com/Anupg28/selenium-java-framework)), where reactively dismissing whatever ad shape appeared turned out to be unwinnable — the durable fix is preventing the ad content from loading at all.
- **Type-ahead fields (Subjects, State, City) use real keystrokes, not `.fill()`.** These are React-controlled inputs (react-select); setting the DOM value directly doesn't register with the component's internal state, so the field silently reverts to empty. Clicking the field and using `keyboard.type()` drives it correctly.
- **Selecting an autocomplete option clicks it rather than pressing Enter.** The practice form is wrapped in a real `<form>` element, so pressing Enter in a text input can trigger a native browser form submission before the rest of the fields are filled — a genuine gotcha, not a hypothetical one (it happened during development, submitting the form early).
- **Local concurrency is capped at 3 workers, not left at Playwright's default (one per CPU core).** demoqa.com is a small shared public demo backend, not a dedicated test environment; running fully unconstrained parallelism caused real flakiness under concurrent load that didn't reproduce when each spec file ran alone. This is right-sizing concurrency to what the target can sustain, not a workaround for a framework bug.
- **A manually-created `APIRequestContext`, not the per-test `request` fixture, is shared across the BookStore API tests.** Playwright's fixture-scoped `request` object can't be reused across test boundaries from a `beforeAll` hook; the documented pattern for a shared authenticated context across multiple tests is to create one explicitly and dispose it in `afterAll`.

## CI/CD

GitHub Actions runs the full suite headlessly on every push to `main` and on pull requests, and uploads the HTML report plus any failure screenshots/videos/traces as build artifacts — see the Actions tab for run history.

## Author

Anup Ghodake — [github.com/Anupg28](https://github.com/Anupg28)
