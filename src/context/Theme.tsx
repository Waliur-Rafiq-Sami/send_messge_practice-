"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
};

export default ThemeProvider;

// enableSystem->
// Boolean flag (true/false)
// enableSystem={true} → lets the theme automatically follow the user’s system theme, even if the user changes it later.
// If false, the app ignores the system theme and sticks to your defaultTheme.
