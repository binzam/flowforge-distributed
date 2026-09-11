import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

type FilterValues<TKey extends string> = Partial<Record<TKey, string>>;

export interface UseListQueryParamsResult<TKey extends string> {
  filters: FilterValues<TKey>;
  page: number;
  setFilter: (key: TKey, value: string | undefined) => void;
  setPage: (page: number) => void;
}

export function useListQueryParams<TKey extends string>(
  filterKeys: readonly TKey[],
): UseListQueryParamsResult<TKey> {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = filterKeys.reduce<FilterValues<TKey>>((acc, key) => {
    const value = searchParams.get(key);
    if (value) acc[key] = value;
    return acc;
  }, {});

  const page = Math.max(
    0,
    Number.parseInt(searchParams.get("page") ?? "0", 10) || 0,
  );

  const setFilter = useCallback(
    (key: TKey, value: string | undefined) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value) {
            next.set(key, value);
          } else {
            next.delete(key);
          }
          next.delete("page");
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setPage = useCallback(
    (nextPage: number) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (nextPage > 0) {
            next.set("page", String(nextPage));
          } else {
            next.delete("page");
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { filters, page, setFilter, setPage };
}
