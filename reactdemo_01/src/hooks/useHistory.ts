import { useSyncExternalStore } from "react";
export const useHistory = () => {
  const subscribe = (callback: () => void) => {
    window.addEventListener("popstate", callback);
    window.addEventListener("hashchange", callback);
    return () => {
      window.removeEventListener("popstate", callback);
      window.removeEventListener("hashchange", callback);
    };
  };
  const getSnapshot = () => {
    return window.location.href;
  };
  const url = useSyncExternalStore(subscribe, getSnapshot);
  const push = (url: string) => {
    window.history.pushState({}, "", url);
    window.dispatchEvent(new Event("popstate"));
  };
  const replace = (url: string) => {
    window.history.replaceState({}, "", url);
    window.dispatchEvent(new Event("popstate"));
  };

  return [url, push, replace] as const;
};
