import { Page } from "puppeteer";
import { BrowserService } from "../browser-service";
import DefaultBrowser from "../default-browser";

interface IGoogleBrowser {
  execTask: (url: string, counter: number) => Promise<boolean>;
}

export default class GoogleBrowser
  extends DefaultBrowser
  implements IGoogleBrowser
{
  private static instance: GoogleBrowser | null = null;

  private constructor(browserService: BrowserService) {
    super(browserService);
  }

  public static getInstance(): GoogleBrowser {
    if (!GoogleBrowser.instance) {
      const browserServiceInstance = new BrowserService();

      GoogleBrowser.instance = new GoogleBrowser(browserServiceInstance);
    }

    return GoogleBrowser.instance;
  }

  protected async handleCommonTasks(page: Page): Promise<void> {
    await page.waitForXPath(
      "//a[contains(@class, 'VfPpkd-mRLv6') and contains(@id, 'apply-action-button') and text()='Apply']",
      { timeout: 8000 }
    );
  }
}
