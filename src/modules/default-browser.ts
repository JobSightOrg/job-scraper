import { HTTPResponse, Page } from "puppeteer";
import { setTimeout } from "node:timers/promises";
import { BrowserService } from "./browser-service";
import { ResponseError } from "../lib/custom-errors";
import { handlePuppeteerError } from "../lib/handle-puppeteer-error";

export default abstract class DefaultBrowser {
  protected constructor(private browserService: BrowserService) {}

  protected abstract handleCommonTasks(page: Page): Promise<void>;

  protected async waitTillHTMLRendered(page: Page, timeout = 10000) {
    const checkDurationMsecs = 1000;
    const maxChecks = timeout / checkDurationMsecs;
    let lastHTMLSize = 0;
    let checkCounts = 1;
    let countStableSizeIterations = 0;
    const minStableSizeIterations = 3;

    while (checkCounts++ <= maxChecks) {
      let html = await page.content();
      let currentHTMLSize = html.length;

      console.log("last: ", lastHTMLSize, " <> curr: ", currentHTMLSize);

      if (lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize)
        countStableSizeIterations++;
      else countStableSizeIterations = 0; //reset the counter

      if (countStableSizeIterations >= minStableSizeIterations) {
        console.log("Page rendered fully...");
        break;
      }

      lastHTMLSize = currentHTMLSize;
      await setTimeout(checkDurationMsecs);
    }
  }

  public async execTask(url: string): Promise<boolean> {
    let page: Page | null = null;
    let response: HTTPResponse | null = null;

    try {
      if (!this.browserService.getBrowser())
        await this.browserService.initialize();

      page = await this.browserService.openPage();
      response = await page.goto(url, { waitUntil: "load", timeout: 5000 });

      if (response && response.status() >= 400)
        throw new ResponseError(
          `Bad response. Status: ${response.status()}`,
          response.status()
        );

      // await page.waitForXPath(
      //   // "//span[contains(@class, 'ms-Button-label') and contains(@class, 'label-76') and text()='Apply']",
      //   "//span[contains(@class, 'test') and contains(@class, 'test2') and text()='Apply']",
      //   { timeout: 5000 }
      // );

      await this.handleCommonTasks(page);

      return true;
    } catch (err: any) {
      console.error(err);
      return await handlePuppeteerError(err, page, this.browserService);
    } finally {
      if (page) await this.browserService.closePage(page);
    }
  }
}
