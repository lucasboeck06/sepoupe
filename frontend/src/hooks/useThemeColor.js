import { useEffect } from "react";

const DEFAULT_THEME_COLOR = "#F0F0F7";

export function useThemeColor(color) {
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;

    const previous = meta.getAttribute("content");
    meta.setAttribute("content", color);

    return () => {
      meta.setAttribute("content", previous ?? DEFAULT_THEME_COLOR);
    };
  }, [color]);
}
