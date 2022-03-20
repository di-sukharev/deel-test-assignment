import { useRef, useState } from "react";

function useThrottling<T>(api: any, delay: number = 300) {
  const [data, setData] = useState<T | null>();

  let timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const call = (arg: any) => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }

    timeout.current = setTimeout(async () => {
      setData(await api(arg));
    }, delay);
  };

  const reset = () => setData(null);

  return { data, reset, call };
}

export default useThrottling;
