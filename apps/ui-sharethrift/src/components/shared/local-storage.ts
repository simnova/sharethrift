
export const clearStorage = (): void => {
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch (error) {
    console.error(`Error clearing storage: ${error}`);
  }
}