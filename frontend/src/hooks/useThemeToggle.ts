import { useTheme } from 'next-themes'

type Theme = 'light' | 'dark'

interface ThemeToggle {
  theme: Theme | undefined;
  toggleTheme: () => void;
}

export function useThemeToggle(): ThemeToggle {
  const { theme, setTheme } = useTheme()
  
  const toggleTheme = () => {
    const currentTheme = theme as Theme
    setTheme(currentTheme === 'dark' ? 'light' : 'dark')
  }

  return {
    theme: theme as Theme | undefined,
    toggleTheme
  }
}
