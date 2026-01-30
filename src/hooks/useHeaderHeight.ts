import { useEffect, useState } from "react";

const useHeaderHeight = () => {
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const header = document.querySelector(".app-header") as HTMLElement;
    if (header) {
      const updateHeaderHeight = () => setHeaderHeight(header.offsetHeight);
      updateHeaderHeight();
      window.addEventListener("resize", updateHeaderHeight);
      return () => window.removeEventListener("resize", updateHeaderHeight);
    }
  }, []);

  return headerHeight;
};

export default useHeaderHeight;
