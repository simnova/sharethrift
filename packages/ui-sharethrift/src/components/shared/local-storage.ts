
export const clearStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error(`Error clearing localStorage: ${error}`);
  }
}