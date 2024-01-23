import { BrowserService } from "../browser-service";
import DefaultBrowser from "../default-browser";

interface MicrosoftBrowserProps {
  restartBrowserInstance: () => Promise<void>;
  execTask: (url: string) => Promise<boolean>;
}

export default class MicrosoftBrowser
  extends DefaultBrowser
  implements MicrosoftBrowserProps
{
  private static instance: MicrosoftBrowser | null = null;

  private constructor(private browserService: BrowserService) {
    super();
  }

  public static async getInstance(): Promise<MicrosoftBrowser> {
    if (!MicrosoftBrowser.instance) {
      const browserServiceInstance = new BrowserService();
      console.log("here");
      MicrosoftBrowser.instance = new MicrosoftBrowser(browserServiceInstance);
      await browserServiceInstance.initialize();
    }

    return MicrosoftBrowser.instance;
  }

  public async restartBrowserInstance(): Promise<void> {
    await this.browserService.restartBrowser();
  }

  public async execTask(url: string): Promise<boolean> {
    const page = await this.browserService.openPage();

    try {
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
      await page.close();
    }
  }
}
