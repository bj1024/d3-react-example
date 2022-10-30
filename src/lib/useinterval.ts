import {useEffect, useRef} from 'react';

const useInterval = (callback: Function, ms?: number) => {

  const refCallback = useRef<Function>(() => {
  });

  useEffect(() => {
    refCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    if (ms !== null) {
      const timerid = setInterval(() =>
        refCallback.current(), ms || 0);
      return () => clearInterval(timerid);
    }
    return undefined;
  }, [ms]);
}

export default useInterval;
