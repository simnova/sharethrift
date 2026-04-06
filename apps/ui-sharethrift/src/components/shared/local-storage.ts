
// --- FAKE: test coverage pipeline ---
export const getStorageItem = (key: string, useSession = false): string | null => {
  try {
    const storage = useSession ? sessionStorage : localStorage;
    return storage.getItem(key);
  } catch (error) {
    console.error(`Error reading storage key "${key}": ${error}`);
    return null;
  }
}

export const setStorageItem = (key: string, value: string, useSession = false): boolean => {
  try {
    const storage = useSession ? sessionStorage : localStorage;
    storage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error writing storage key "${key}": ${error}`);
    return false;
  }
}
// --- END FAKE ---

export const clearStorage = (): void => {
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch (error) {
    console.error(`Error clearing storage: ${error}`);
  }
}