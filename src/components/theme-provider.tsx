
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { useData } from "@/lib/data-context"

function ApplyTheme() {
  const { theme: appTheme, isDataLoaded } = useData();
  const { resolvedTheme } = useNextTheme();

  React.useEffect(() => {
    if (!isDataLoaded || !resolvedTheme) return;
    
    const themeConfig = appTheme[resolvedTheme as keyof typeof appTheme];
    if (!themeConfig) return;

    const root = document.documentElement;
    root.style.setProperty('--background-hsl', themeConfig.background);
    root.style.setProperty('--foreground-hsl', themeConfig.foreground);
    root.style.setProperty('--primary-hsl', themeConfig.primary);
    root.style.setProperty('--accent-hsl', themeConfig.accent);
    
  }, [appTheme, resolvedTheme, isDataLoaded]);

  return null;
}


export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ApplyTheme />
      {children}
    </NextThemesProvider>
  )
}
