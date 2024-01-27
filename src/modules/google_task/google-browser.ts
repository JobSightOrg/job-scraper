import { Page } from "puppeteer";
import { BrowserService } from "../browser-service";
import DefaultBrowser from "../default-browser";
import { handlePuppeteerError } from "../../lib/handle-puppeteer-error";

interface IGoogleBrowser {
  execTask: (url: string, counter: number) => Promise<boolean>;
}

export default class GoogleBrowser
  extends DefaultBrowser
  implements IGoogleBrowser
{
  private static instance: GoogleBrowser | null = null;

  private constructor(private browserService: BrowserService) {
    super();
  }

  public static getInstance(): GoogleBrowser {
    if (!GoogleBrowser.instance) {
      const browserServiceInstance = new BrowserService();

      GoogleBrowser.instance = new GoogleBrowser(browserServiceInstance);
    }

    return GoogleBrowser.instance;
  }

  public async execTask(url: string): Promise<boolean> {
    let page: Page | null = null;

    try {
      if (!this.browserService.getBrowser())
        await this.browserService.initialize();

      page = await this.browserService.openPage();

      await Promise.all([
        page.goto(url, { waitUntil: "load", timeout: 10000 }),
        page.waitForXPath(
          "//a[contains(@class, 'VfPpkd-mRLv6') and contains(@id, 'apply-action-button') and text()='Apply']",
          { timeout: 10000 }
        ),
      ]);

      return true;
    } catch (err: any) {
      console.error(err);

      await handlePuppeteerError(err, page, this.browserService);
      return false;
    } finally {
      if (page) await this.browserService.closePage(page);
    }
  }
}
