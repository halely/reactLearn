import { useSyncExternalStore } from "react";
export const useStorage = (key: string, initiaValue: any) => {
  //订阅者
  const subscribe = (callback: () => void) => {
    //返回一个取消订阅的函数
    window.addEventListener("storage", callback);
    return () => {
      window.removeEventListener("storage", callback);
    };
  };
  //获取快照
  const getSnapshot = () => {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : initiaValue;
  };
  const res = useSyncExternalStore(subscribe, getSnapshot);
  const updateStorage = (val: any) => {
    localStorage.setItem(key, JSON.stringify(val));
    //手动触发订阅者
    window.dispatchEvent(new Event("storage"));
  };
  return [res, updateStorage];
};
