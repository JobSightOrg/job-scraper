import { Browser, Page } from "puppeteer";
import { BrowserService } from "../modules/browser-service";

// Define the type of the exCatch parameter as an object that maps error types to catch functions
type ExCatch = {
  [errorType: string]: (...args: any) => Promise<boolean>;
};

const exCatch: ExCatch = {
  // Handle timeout error
  TimeoutError: async (browserService: BrowserService): Promise<boolean> => {
    const browser: Browser | null = browserService.getBrowser();

    if (browser) {
      await browserService.initialize();
      return true;
    }

    return false;
  },
  // Handle navigation error
  NavigationError: async (page: Page): Promise<boolean> => {
    await page.close();

    return false;
  },
};

// Add the parameter types and the return type to the function declaration
export async function handlePuppeteerError(
  e: Error,
  page: Page | null,
  browserService: BrowserService
): Promise<boolean> {
  // exCatch is an object that maps error types to catch functions
  const catchFunc: Function | undefined = exCatch[e.name];

  // execute the catch function for the matching error type
  if (catchFunc) {
    switch (e.name) {
      case "TimeoutError" || "ResponseError":
        return catchFunc(browserService);
      case "NavigationError":
        return catchFunc(page);
    }
  }

  return false;
}
