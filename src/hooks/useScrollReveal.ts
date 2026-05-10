import { useEffect, useState } from "react";

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.15) {
  const [isVisible, setIsVisible] = useState(false);
  const [element, setElement] = useState<T | null>(null);

  useEffect(() => {
    if (!element) return;
    
    const obs = new IntersectionObserver(
      ([entry]) => { 
        if (entry.isIntersecting) { 
          setIsVisible(true); 
          obs.disconnect(); 
        } 
      },
      { threshold }
    );
    
    obs.observe(element);
    return () => obs.disconnect();
  }, [element, threshold]);

  return { ref: setElement, isVisible };
}
