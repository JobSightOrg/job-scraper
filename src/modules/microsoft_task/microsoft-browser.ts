import { Page } from "puppeteer";
import { BrowserService } from "../browser-service";
import DefaultBrowser from "../default-browser";

interface IMicrosoftBrowser {
  execTask: (url: string, counter: number) => Promise<boolean>;
}

export default class MicrosoftBrowser
  extends DefaultBrowser
  implements IMicrosoftBrowser
{
  private static instance: MicrosoftBrowser | null = null;

  private constructor(browserService: BrowserService) {
    super(browserService);
  }

  public static getInstance(): MicrosoftBrowser {
    if (!MicrosoftBrowser.instance) {
      const browserServiceInstance = new BrowserService();

      MicrosoftBrowser.instance = new MicrosoftBrowser(browserServiceInstance);
    }

    return MicrosoftBrowser.instance;
  }

  protected async handleCommonTasks(page: Page): Promise<void> {
    await page.waitForXPath(
      // "//span[contains(@class, 'ms-Button-label') and contains(@class, 'label-76') and text()='Apply']",
      "//span[contains(@class, 'test') and contains(@class, 'test2') and text()='Apply']",
      { timeout: 8000 }
    );
  }
}
