import puppeteer, { Browser, Page } from "puppeteer";

interface BrowserServiceProps {
  initialize: () => Promise<void>;
  openPage: () => Promise<Page>;
  closePage: (page: Page) => Promise<void>;
  restartBrowser: () => Promise<void>;
}

export class BrowserService implements BrowserServiceProps {
  private browser: Browser | null = null;
  private headers: {
    "accept-encoding": string;
    "accept-language": string;
    "user-agent": string;
  };
  public numberPages: number = 0;

  public constructor() {
    this.headers = {
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
      "user-agent": this.getRandomUA(),
    };
  }

  /**
   * Get a browser page.
   */
  public async openPage(): Promise<Page> {
    this.checkBrowser();

    const page = await this.browser!.newPage();
    await page.setExtraHTTPHeaders(this.headers);

    this.numberPages++;
    return page;
  }

  /**
   * Close a page.
   */
  public async closePage(page: Page): Promise<void> {
    this.checkBrowser();

    await page.close();

    // if (this.numberPages === 0) {
    //   await this.browser!.close();
    // }
  }

  /**
   * Restart browser.
   */
  public async restartBrowser(): Promise<void> {
    this.checkBrowser();

    await this.browser!.close();
    await this.initialize();
  }

  /**
   * Initialize the instance.
   */
  public async initialize(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: false,
    });
  }

  /**
   * Check if browser exists
   */
  private checkBrowser() {
    if (!this.browser) {
      throw new Error("Browser not initialized. Call initialize() first.");
    }
  }

  /**
   * Get random user agent
   */
  private getRandomUA() {
    const userAgents = [
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.9999.99 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Safari/605.1.15",
      "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.9999.99 Safari/537.36 Edg/99.0.999.99",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:99.0) Gecko/20100101 Firefox/99.0",
    ];

    return userAgents[Math.floor(Math.random() * userAgents.length)];
  }
}
