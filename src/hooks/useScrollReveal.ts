"use client";

import { useEffect, useRef } from "react";

// Ajoute la classe "in-view" (voir .reveal dans globals.css) dès que
// l'élément entre dans le viewport, puis arrête d'observer. Le CSS gère
// lui-même le repli pour prefers-reduced-motion.
export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (!("IntersectionObserver" in window)) {
      element.classList.add("in-view");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("in-view");
          observer.unobserve(element);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return ref;
}
