import { Browser, Page } from "puppeteer";
import { BrowserService } from "../modules/browser-service";

// Define the type of the exCatch parameter as an object that maps error types to catch functions
type ExCatch = {
  [errorType: string]: (...args: any) => Promise<void>;
};

const exCatch: ExCatch = {
  // Handle timeout error
  TimeoutError: async (browserService: BrowserService) => {
    const browser: Browser | null = browserService.getBrowser();

    if (browser) {
      let openPages = await browser.pages();

      while (openPages.length > 0) {
        // Wait for a short duration before checking again
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get the current list of open pages
        openPages = await browser.pages();
      }
    }
    // await browserService.initialize();
  },
  // Handle navigation error
  NavigationError: async (page: Page) => {
    await page.close();
  },
};

// Add the parameter types and the return type to the function declaration
export async function handlePuppeteerError(
  e: Error,
  page: Page | null,
  browserService: BrowserService
): Promise<void> {
  // exCatch is an object that maps error types to catch functions
  const catchFunc: Function | undefined = exCatch[e.name];

  console.log(catchFunc.arguments);
  // execute the catch function for the matching error type
  if (catchFunc) {
    switch (e.name) {
      case "TimeoutError":
        catchFunc(browserService);
        break;
      case "NavigationError":
        catchFunc(page);
        break;
    }
  }
}
