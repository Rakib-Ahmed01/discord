import { useEffect, useState } from 'react';

export default function useOrigin() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return '';
  }

  return window?.location?.origin ?? '';
}
