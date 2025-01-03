import { useTheme } from 'next-themes'
import type { Theme } from 'next-themes'

interface ThemeToggle {
  theme: Theme | undefined;
  toggleTheme: () => void;
}

export function useThemeToggle(): ThemeToggle {
  const { theme, setTheme } = useTheme()
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return {
    theme,
    toggleTheme
  }
}
