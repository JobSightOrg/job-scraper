import { Page, TimeoutError } from "puppeteer";
import { BrowserService } from "../browser-service";
import DefaultBrowser from "../default-browser";
import {
  exCatch,
  handlePuppeteerError,
} from "../../lib/handle-puppeteer-error";

interface MicrosoftBrowserProps {
  // restartBrowserInstance: () => Promise<void>;
  execTask: (url: string, counter: number) => Promise<boolean>;
}

export default class MicrosoftBrowser
  extends DefaultBrowser
  implements MicrosoftBrowserProps
{
  private static instance: MicrosoftBrowser | null = null;

  private constructor(private browserService: BrowserService) {
    super();
  }

  private async restartBrowserInstance(): Promise<void> {
    await this.browserService.restartBrowser();
  }

  public static getInstance(): MicrosoftBrowser {
    if (!MicrosoftBrowser.instance) {
      const browserServiceInstance = new BrowserService();

      MicrosoftBrowser.instance = new MicrosoftBrowser(browserServiceInstance);
    }

    return MicrosoftBrowser.instance;
  }

  public async execTask(url: string): Promise<boolean> {
    let page: Page | null = null;

    try {
      if (!this.browserService.getBrowser())
        await this.browserService.initialize();

      page = await this.browserService.openPage();

      await page.goto(url, { timeout: 5000, waitUntil: "load" });

      // // Fully render HTML page on first page load for browser caching.
      // if (this.browserService.numberPages === 1)
      //   await this.waitTillHTMLRendered(page);

      await page.waitForXPath(
        "//span[contains(@class, 'ms-Button-label') and contains(@class, 'label-76') and text()='Apply']",
        { timeout: 5000 }
      );

      return true;
    } catch (err: any) {
      console.error(err);

      // await handlePuppeteerError(err, exCatch);
      return false;
    } finally {
      if (page) await this.browserService.closePage(page);
    }
  }
}
