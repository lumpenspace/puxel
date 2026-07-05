import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "../lib/cn";

export const THEMES = ["paper", "midnight", "arcade", "terminal"] as const;
export type ThemeName = (typeof THEMES)[number];

const THEME_SWATCH_PIXELS = [1, 2, 3, 4] as const;

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

export interface ThemeSwitcherProps {
  className?: string;
  /** Caption rendered before the buttons; pass null to hide it. */
  label?: ReactNode | null;
  /** Fires after a swatch is clicked. Index is zero-based in THEMES order. */
  onThemeSelect?: (theme: ThemeName, index: number) => void;
}

/** Segmented control for switching between the four built-in themes. */
export function ThemeSwitcher({ className, label = "theme", onThemeSelect }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();
  return (
    <div className={cn("px-themeswitcher", className)}>
      {label != null && <span className="px-themeswitcher-label">{label}</span>}
      <div role="radiogroup" aria-label="Theme" className="px-themeswitcher-options">
        {THEMES.map((t, index) => (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={theme === t}
            aria-current={theme === t ? "page" : undefined}
            aria-label={`${t} theme`}
            title={`${t} theme`}
            className="px-themeswitcher-option"
            style={
              Object.fromEntries(
                THEME_SWATCH_PIXELS.map((i) => [
                  `--px-theme-swatch-${i}`,
                  `var(--px-theme-swatch-${t}-${i})`,
                ]),
              ) as CSSProperties
            }
            onClick={() => {
              setTheme(t);
              onThemeSelect?.(t, index);
            }}
          >
            <span className="px-themeswitcher-swatch" aria-hidden="true">
              {THEME_SWATCH_PIXELS.map((i) => (
                <span key={i} />
              ))}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
