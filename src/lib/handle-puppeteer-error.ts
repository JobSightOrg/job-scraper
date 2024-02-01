import { Page } from "puppeteer";
import { BrowserService } from "../modules/browser-service";

// Define the type of the exCatch parameter as an object that maps error types to catch functions
type ExCatch = {
  [errorType: string]: (...args: any) => Promise<void>;
};

const exCatch: ExCatch = {
  // Handle timeout error
  TimeoutError: async (browserService: BrowserService): Promise<void> => {
    // const browser: Browser | null = browserService.getBrowser();
    console.log("here", browserService);
  },
  // Handle navigation error
  NavigationError: async (page: Page): Promise<void> => {
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

  // execute the catch function for the matching error type
  if (catchFunc) {
    switch (e.name) {
      case "TimeoutError" || "ResponseError":
        await catchFunc(browserService);
        break;
      case "NavigationError":
        await catchFunc(page);
        break;
    }
  }
}
