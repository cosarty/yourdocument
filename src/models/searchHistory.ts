import { SEARCH_KEY, type SEARCH_KEY_TYPE } from '@/constant/storKey';
import { getStorage, removeStorage, setStorage } from '@/util/storage';
import { useEffect, useState } from 'react';
const useSearchHistory = () => {
  const [searchList, setSearchList] = useState<SEARCH_KEY_TYPE>(
    getStorage<SEARCH_KEY_TYPE>(SEARCH_KEY) ?? [],
  );

  useEffect(() => {
    if (searchList.length === 0 && getStorage<SEARCH_KEY_TYPE>(SEARCH_KEY))
      removeStorage(SEARCH_KEY);
    if (searchList.filter((s) => !!s).length === 0) return;

    // 每次有新值就加入storage
    setStorage(SEARCH_KEY, searchList);
  }, [searchList]);

  const addSearchHistory = (value: SEARCH_KEY_TYPE[number]) => {
    setSearchList([...new Set([...searchList, value].filter((s) => !!s))]);
  };

  const clearhistory = () => setSearchList([]);

  const deleteSearchHistory = (v: string) =>
    setSearchList((pre) => {
      pre.includes(v);
      if (pre) return pre.filter((p) => p !== v);
      return pre;
    });

  return {
    searchList,
    addSearchHistory,
    clearhistory,
    deleteSearchHistory,
  };
};

export default useSearchHistory;
