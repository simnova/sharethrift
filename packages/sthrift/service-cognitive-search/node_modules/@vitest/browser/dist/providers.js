const playwrightBrowsers = ["firefox", "webkit", "chromium"];
class PlaywrightBrowserProvider {
  name = "playwright";
  cachedBrowser = null;
  cachedPage = null;
  browser;
  ctx;
  options;
  getSupportedBrowsers() {
    return playwrightBrowsers;
  }
  initialize(project, { browser, options }) {
    this.ctx = project;
    this.browser = browser;
    this.options = options;
  }
  async openBrowserPage() {
    if (this.cachedPage)
      return this.cachedPage;
    const options = this.ctx.config.browser;
    const playwright = await import('playwright');
    const browser = await playwright[this.browser].launch({
      ...this.options?.launch,
      headless: options.headless
    });
    this.cachedBrowser = browser;
    this.cachedPage = await browser.newPage(this.options?.page);
    return this.cachedPage;
  }
  async openPage(url) {
    const browserPage = await this.openBrowserPage();
    await browserPage.goto(url);
  }
  async close() {
    const page = this.cachedPage;
    this.cachedPage = null;
    const browser = this.cachedBrowser;
    this.cachedBrowser = null;
    await page?.close();
    await browser?.close();
  }
}

const webdriverBrowsers = ["firefox", "chrome", "edge", "safari"];
class WebdriverBrowserProvider {
  name = "webdriverio";
  cachedBrowser = null;
  browser;
  ctx;
  options;
  getSupportedBrowsers() {
    return webdriverBrowsers;
  }
  async initialize(ctx, { browser, options }) {
    this.ctx = ctx;
    this.browser = browser;
    this.options = options;
  }
  async openBrowser() {
    if (this.cachedBrowser)
      return this.cachedBrowser;
    const options = this.ctx.config.browser;
    if (this.browser === "safari") {
      if (options.headless)
        throw new Error("You've enabled headless mode for Safari but it doesn't currently support it.");
    }
    const { remote } = await import('webdriverio');
    this.cachedBrowser = await remote({
      ...this.options,
      logLevel: "error",
      capabilities: this.buildCapabilities()
    });
    return this.cachedBrowser;
  }
  buildCapabilities() {
    const capabilities = {
      ...this.options?.capabilities,
      browserName: this.browser
    };
    const headlessMap = {
      chrome: ["goog:chromeOptions", ["headless", "disable-gpu"]],
      firefox: ["moz:firefoxOptions", ["-headless"]],
      edge: ["ms:edgeOptions", ["--headless"]]
    };
    const options = this.ctx.config.browser;
    const browser = this.browser;
    if (browser !== "safari" && options.headless) {
      const [key, args] = headlessMap[browser];
      const currentValues = this.options?.capabilities?.[key] || {};
      const newArgs = [...currentValues.args || [], ...args];
      capabilities[key] = { ...currentValues, args: newArgs };
    }
    return capabilities;
  }
  async openPage(url) {
    const browserInstance = await this.openBrowser();
    await browserInstance.url(url);
  }
  async close() {
    await Promise.all([
      this.cachedBrowser?.sessionId ? this.cachedBrowser?.deleteSession?.() : null
    ]);
    process.exit();
  }
}

class NoneBrowserProvider {
  name = "none";
  ctx;
  open = false;
  getSupportedBrowsers() {
    return [];
  }
  isOpen() {
    return this.open;
  }
  async initialize(ctx) {
    this.ctx = ctx;
    this.open = false;
    if (ctx.config.browser.headless)
      throw new Error(`You've enabled headless mode for "none" provider but it doesn't support it.`);
  }
  async openPage(_url) {
    this.open = true;
    if (!this.ctx.browser)
      throw new Error("Browser is not initialized");
    const options = this.ctx.browser.config.server;
    const _open = options.open;
    options.open = _url;
    this.ctx.browser.openBrowser();
    options.open = _open;
  }
  async close() {
  }
}

const webdriverio = WebdriverBrowserProvider;
const playwright = PlaywrightBrowserProvider;
const none = NoneBrowserProvider;

export { none, playwright, webdriverio };
