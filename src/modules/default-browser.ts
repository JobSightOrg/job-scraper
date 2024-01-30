import { promises as fsPromises } from "fs";
import { Page } from "puppeteer";
import { setTimeout } from "node:timers/promises";

export default abstract class DefaultBrowser {
  protected proxies: string[];

  protected constructor() {
    this.proxies = [];
  }

  // protected async loadProxies() {
  //   try {
  //     // Read the contents of the file asynchronously
  //     const data = await fsPromises.readFile("proxies.txt", "utf8");

  //     // Split the file contents into an array of lines
  //     this.proxies = data.split("\n");
  //   } catch (error) {
  //     console.error("Error reading the file:", error);
  //   }
  // }

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

  abstract execTask(url: string): Promise<boolean>;
}
