import { useEffect, useState } from "react";
import { api } from "../lib/api";

export const useApiData = <T,>(url: string, fallback: T) => {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.get(url)
      .then((response) => mounted && setData(response.data))
      .catch(() => mounted && setData(fallback))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [url]);

  return { data, setData, loading };
};
