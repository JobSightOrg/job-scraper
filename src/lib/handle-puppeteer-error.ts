import { Page } from "puppeteer";
import { BrowserService } from "../modules/browser-service";

// Define the type of the exCatch parameter as an object that maps error types to catch functions
type ExCatch = {
  [errorType: string]: (...args: any) => Promise<any>;
};

const exCatch: ExCatch = {
  // Handle timeout error
  TimeoutError: async (page: Page): Promise<null> => {
    await page.close();
    return null;
  },
  // Handle navigation error
  NavigationError: async (page: Page): Promise<void> => {
    await page.close();
  },
};

// Add the parameter types and the return type to the function declaration
export async function handlePuppeteerError(
  e: Error,
  page: Page | null
): Promise<Page | null> {
  // exCatch is an object that maps error types to catch functions
  const catchFunc: Function | undefined = exCatch[e.name];

  // execute the catch function for the matching error type
  if (catchFunc) {
    switch (e.name) {
      case "TimeoutError" || "ResponseError":
        return await catchFunc(page);
      case "NavigationError":
        return await catchFunc(page);
    }
  }

  return page;
}
