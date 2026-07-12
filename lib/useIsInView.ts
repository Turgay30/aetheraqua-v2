import { useEffect, useState, type RefObject } from "react";

/** Verilen elemanın görünür olup olmadığını izler (mobil sabit çubuk tetikleyicisi için). */
export function useIsInView(ref: RefObject<HTMLElement>): boolean {
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return inView;
}
