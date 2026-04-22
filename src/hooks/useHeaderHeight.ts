import { useEffect, useState } from "react";

export const useHeaderHeight = () => {
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const header = document.querySelector(".app-header") as HTMLElement | null;
    if (!header) return;
    const update = () => setHeaderHeight(header.offsetHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return headerHeight;
};
