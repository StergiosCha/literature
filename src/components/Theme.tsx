import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';
const Ctx = createContext<{ theme: Theme; toggle: () => void; size: number; setSize: (n: number) => void } | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('lit.theme') as Theme) || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  const [size, setSizeState] = useState<number>(() => Number(localStorage.getItem('lit.size')) || 18);
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('lit.theme', theme); }, [theme]);
  useEffect(() => { document.documentElement.style.setProperty('--reader-size', `${size}px`); localStorage.setItem('lit.size', String(size)); }, [size]);
  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);
  const setSize = useCallback((n: number) => setSizeState(Math.min(26, Math.max(14, n))), []);
  const v = useMemo(() => ({ theme, toggle, size, setSize }), [theme, toggle, size, setSize]);
  return <Ctx.Provider value={v}>{children}</Ctx.Provider>;
}
export function useTheme() { const v = useContext(Ctx); if (!v) throw new Error('ThemeProvider'); return v; }
