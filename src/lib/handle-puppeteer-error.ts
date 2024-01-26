// Define the type of the exCatch parameter as an object that maps error types to catch functions
type ExCatch = {
  [errorType: string]: () => void;
};

const exCatch: ExCatch = {
  // Handle timeout error
  TimeoutError: () => {},
  // Handle navigation error
  NavigationError: () => {},
};

// Add the parameter types and the return type to the function declaration
export async function handlePuppeteerError(
  e: Error,
  exCatch: ExCatch
): Promise<void> {
  // exCatch is an object that maps error types to catch functions
  const catchFunc = exCatch[e.name];
  let handled = false;

  if (catchFunc) {
    // execute the catch function for the matching error type
    catchFunc();
    handled = true;
  }

  if (!handled) {
    // rethrow the error if no matching catch function was found
    throw e;
  }
}
