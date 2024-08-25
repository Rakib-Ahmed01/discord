import { useCallback, useEffect, useState } from 'react';

// const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
// const isMediumDevice = useMediaQuery(
//   "only screen and (min-width : 769px) and (max-width : 992px)"
// );
// const isLargeDevice = useMediaQuery(
//   "only screen and (min-width : 993px) and (max-width : 1200px)"
// );
// const isExtraLargeDevice = useMediaQuery(
//   "only screen and (min-width : 1201px)"
// );

type UseMediaQueryOptions = {
  defaultValue: boolean;
  initializeWithValue: boolean;
};

const IS_SERVER = typeof window === 'undefined';

export default function useMediaQuery(
  query: string,
  { defaultValue, initializeWithValue }: UseMediaQueryOptions = {
    defaultValue: false,
    initializeWithValue: false,
  }
) {
  const getMatches = useCallback(
    (query: string) => {
      if (IS_SERVER) return defaultValue;
      return window.matchMedia(query).matches;
    },
    [defaultValue]
  );

  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue) {
      return getMatches(query);
    }
    return defaultValue;
  });

  const handleChange = useCallback(() => {
    setMatches(getMatches(query));
  }, [getMatches, query]);

  useEffect(() => {
    const matchMedia = window.matchMedia(query);

    handleChange();

    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange);
    } else {
      matchMedia.addEventListener('change', handleChange);
    }

    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange);
      } else {
        matchMedia.removeEventListener('change', handleChange);
      }
    };
  }, [query, handleChange]);

  return matches;
}
