import { useState, useEffect } from "react";

export function useScreen() {
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  const [screenSize, setScreenSize] = useState({
    width: screen.width,
    height: screen.height,
  });

  useEffect(() => {
    function handleResize() {
      setScreenSize({
        width: screen.width,
        height: screen.height,
      });
    }

    setIsLargeScreen(screen.width >= 1024);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isLargeScreen, screenSize };
}
