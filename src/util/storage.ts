const setStorage = <T>(key: string, data: T) => localStorage.setItem(key, data as any);

const getStorage = <T>(key: string): T | undefined => localStorage.getItem(key) as unknown as T;

const removeStorage = (key: string) => localStorage.removeItem(key);

export { setStorage, getStorage, removeStorage };
