import { Page } from "puppeteer";
import { BrowserService } from "../browser-service";
import DefaultBrowser from "../default-browser";

interface MicrosoftBrowserProps {
  // restartBrowserInstance: () => Promise<void>;
  execTask: (url: string, counter: number) => Promise<boolean>;
}

export default class MicrosoftBrowser
  extends DefaultBrowser
  implements MicrosoftBrowserProps
{
  private static instance: MicrosoftBrowser | null = null;
  // private static initializationPromise: Promise<void> | null = null;
  // private static isInitializingBrowser: boolean = false;

  private constructor(private browserService: BrowserService) {
    super();
  }

  // private static async initializeBrowser(
  //   browserServiceInstance: BrowserService
  // ): Promise<void> {
  //   await browserServiceInstance.initialize();
  // }

  private async restartBrowserInstance(): Promise<void> {
    await this.browserService.restartBrowser();
  }

  public static getInstance(): MicrosoftBrowser {
    if (!MicrosoftBrowser.instance) {
      const browserServiceInstance = new BrowserService();

      MicrosoftBrowser.instance = new MicrosoftBrowser(browserServiceInstance);
      //   MicrosoftBrowser.initializationPromise =
      //     MicrosoftBrowser.initializeBrowser(browserServiceInstance);
      //   MicrosoftBrowser.isInitializingBrowser = true;
      // } else if (MicrosoftBrowser.isInitializingBrowser) {
      //   console.log("initializationPromise", counter);
      //   await MicrosoftBrowser.initializationPromise;
      //   MicrosoftBrowser.isInitializingBrowser = false;
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

      // Fully render HTML page on first page load for browser caching.
      if (this.browserService.numberPages === 1)
        await this.waitTillHTMLRendered(page);

      await page.waitForXPath(
        "//span[contains(@class, 'ms-Button-label') and contains(@class, 'label-76') and text()='Apply']",
        { timeout: 5000 }
      );

      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      if (page) await page.close();
    }
  }
}
