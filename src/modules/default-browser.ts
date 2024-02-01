import { HTTPResponse, Page } from "puppeteer";
import { setTimeout } from "node:timers/promises";
import { BrowserService } from "./browser-service";
import { ResponseError } from "../lib/custom-errors";
import { handlePuppeteerError } from "../lib/handle-puppeteer-error";

interface IDefaultBrowser {
  execTask: (url: string) => Promise<boolean>;
}

export default abstract class DefaultBrowser implements IDefaultBrowser {
  private maxAttempts: number;

  protected constructor(private browserService: BrowserService) {
    this.maxAttempts = 2;
  }

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

  public async execTask(
    url: string,
    maxAttempts: number = this.maxAttempts
  ): Promise<boolean> {
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

      await this.handleCommonTasks(page);

      return true;
    } catch (err: any) {
      console.error(err);

      page = await handlePuppeteerError(err, page);

      if (maxAttempts > 0) return await this.execTask(url, maxAttempts - 1);

      return false;
    } finally {
      if (page) await this.browserService.closePage(page);
    }
  }
}
