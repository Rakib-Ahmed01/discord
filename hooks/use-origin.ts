import { useEffect, useState } from 'react';

export default function useOrigin() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    return () => setIsMounted(false);
  }, []);

  return isMounted ? window?.location?.origin : '';
}
