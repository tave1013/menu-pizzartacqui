import { useState, useEffect, useCallback } from "react";

export function useQueryParam(key: string) {
  const [value, setValue] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search);
    return params.get(key) || "";
  });

  // Update URL when value changes (debounced, only on confirm)
  const setQueryParam = useCallback(
    (newValue: string, updateUrl = false) => {
      setValue(newValue);

      if (updateUrl && typeof window !== "undefined") {
        const url = new URL(window.location.href);
        if (newValue && newValue.length >= 2) {
          url.searchParams.set(key, newValue);
        } else {
          url.searchParams.delete(key);
        }
        window.history.replaceState({}, "", url.toString());
      }
    },
    [key]
  );

  // Listen for popstate (back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setValue(params.get(key) || "");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [key]);

  return [value, setQueryParam] as const;
}
