export const debounce = <T extends (...args: any[]) => void>(fn: T, delay: number): T => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => fn.apply(this, args), delay);
  } as T;
};
