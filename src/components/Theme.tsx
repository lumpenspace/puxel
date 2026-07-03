import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { cn } from "../lib/cn";

export const THEMES = ["paper", "midnight", "arcade", "terminal"] as const;
export type ThemeName = (typeof THEMES)[number];

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}

export interface ThemeProviderProps {
  defaultTheme?: ThemeName;
  /** localStorage key; set to null to disable persistence. */
  storageKey?: string | null;
  children: ReactNode;
}

export function ThemeProvider({
  defaultTheme = "paper",
  storageKey = "puxel-theme",
  children,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    if (storageKey && typeof window !== "undefined") {
      const saved = window.localStorage.getItem(storageKey);
      if (saved && (THEMES as readonly string[]).includes(saved)) return saved as ThemeName;
    }
    return defaultTheme;
  });

  const setTheme = useCallback(
    (t: ThemeName) => {
      setThemeState(t);
      if (storageKey) window.localStorage.setItem(storageKey, t);
    },
    [storageKey],
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Segmented control for switching between the four built-in themes. */
export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className={cn("px-pagination", className)}
    >
      {THEMES.map((t) => (
        <button
          key={t}
          type="button"
          role="radio"
          aria-checked={theme === t}
          aria-current={theme === t ? "page" : undefined}
          className="px-pagination-btn"
          onClick={() => setTheme(t)}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
