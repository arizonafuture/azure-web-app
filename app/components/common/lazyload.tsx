"use client";

import { useEffect, useRef, useState } from "react";

interface LazyBackgroundProps {
  src: string;
  className?: string;
  children?: React.ReactNode;
}

const LazyBackground: React.FC<LazyBackgroundProps> = ({
  src,
  className = "",
  children,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        minHeight: "450px",
        backgroundImage: `linear-gradient(180deg, rgba(24, 37, 78, 0.00) 0%,rgba(24, 37, 78, 0.90) 100%), url(${src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {children}
    </div>
  );
};

export default LazyBackground;
