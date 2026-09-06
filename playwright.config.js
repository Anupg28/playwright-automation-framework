const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  // demoqa.com is a small shared public demo backend, not a dedicated test environment - running
  // fully unconstrained parallelism (Playwright's default is one worker per CPU core, often 8+)
  // creates enough concurrent load on it to cause real flakiness (slow responses, intermittent
  // timeouts) that doesn't reproduce when each file is run alone. Capping workers is the
  // right-sized concurrency for what this target can actually sustain, not a workaround for a
  // framework bug - still genuinely parallel, just not gratuitously so.
  workers: process.env.CI ? 2 : 3,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['list'],
  ],
  use: {
    baseURL: 'https://demoqa.com',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    // demoqa.com serves real ad content, including a fixed bottom banner (#fixedban) known to
    // overlap form controls. Routing ad-network domains away at launch (a lesson learned the
    // hard way on a previous framework - see README) stops that content from ever loading,
    // rather than reactively dismissing whatever shape it takes.
    launchOptions: {
      args: [
        '--host-resolver-rules=' + [
          'MAP doubleclick.net 127.0.0.1',
          'MAP *.doubleclick.net 127.0.0.1',
          'MAP googlesyndication.com 127.0.0.1',
          'MAP *.googlesyndication.com 127.0.0.1',
          'MAP googleadservices.com 127.0.0.1',
          'MAP *.googleadservices.com 127.0.0.1',
          'MAP adservice.google.com 127.0.0.1',
          'MAP *.adservice.google.com 127.0.0.1',
          'MAP googletagservices.com 127.0.0.1',
          'MAP *.googletagservices.com 127.0.0.1',
        ].join(','),
      ],
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
