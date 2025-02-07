import { useEffect } from "react";

const useDebouncedEffect = (callback, delay, dependencies) => {
  useEffect(() => {
    const handler = setTimeout(() => {
      callback();
    }, delay);

    return () => clearTimeout(handler);
  }, [...dependencies, delay]);
};

export default useDebouncedEffect;
