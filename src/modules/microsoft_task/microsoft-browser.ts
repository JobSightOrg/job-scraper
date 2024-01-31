import { HTTPResponse, Page } from "puppeteer";
import { BrowserService } from "../browser-service";
import DefaultBrowser from "../default-browser";
import { handlePuppeteerError } from "../../lib/handle-puppeteer-error";
import { ResponseError } from "../../lib/custom-errors";

interface IMicrosoftBrowser {
  execTask: (url: string, counter: number) => Promise<boolean>;
}

export default class MicrosoftBrowser
  extends DefaultBrowser
  implements IMicrosoftBrowser
{
  private static instance: MicrosoftBrowser | null = null;

  private constructor(private browserService: BrowserService) {
    super(browserService);
  }

  public static getInstance(): MicrosoftBrowser {
    if (!MicrosoftBrowser.instance) {
      const browserServiceInstance = new BrowserService();

      MicrosoftBrowser.instance = new MicrosoftBrowser(browserServiceInstance);
    }

    return MicrosoftBrowser.instance;
  }

  public async execTask(url: string): Promise<boolean> {
    await this.browserService.execTask(url);
    return true;
    //   let page: Page | null = null;
    //   let response: HTTPResponse | null = null;

    //   try {
    //     if (!this.browserService.getBrowser())
    //       await this.browserService.initialize();

    //     page = await this.browserService.openPage();
    //     response = await page.goto(url, { waitUntil: "load", timeout: 5000 });

    //     if (response && response.status() >= 400)
    //       throw new ResponseError(
    //         `Bad response. Status: ${response.status()}`,
    //         response.status()
    //       );

    //     await page.waitForXPath(
    //       // "//span[contains(@class, 'ms-Button-label') and contains(@class, 'label-76') and text()='Apply']",
    //       "//span[contains(@class, 'test') and contains(@class, 'test2') and text()='Apply']",
    //       { timeout: 5000 }
    //     );

    //     return true;
    //   } catch (err: any) {
    //     console.error(err);
    //     return await handlePuppeteerError(err, page, this.browserService);
    //   } finally {
    //     if (page) await this.browserService.closePage(page);
    //   }
  }
}
