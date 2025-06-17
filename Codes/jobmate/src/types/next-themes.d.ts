/**
 * Type declarations for next-themes
 */

declare module 'next-themes/dist/types' {
  import * as React from 'react';

  export interface ThemeProviderProps {
    children?: React.ReactNode;
    defaultTheme?: string;
    forcedTheme?: string;
    themes?: string[];
    attribute?: string | 'class' | 'data-theme';
    value?: { [theme: string]: string };
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
    enableColorScheme?: boolean;
    storageKey?: string;
  }

  export interface UseThemeProps {
    themes: string[];
    forcedTheme?: string;
    setTheme: (theme: string) => void;
    theme?: string;
    resolvedTheme?: string;
    systemTheme?: 'dark' | 'light';
  }
}

declare module 'next-themes' {
  import { ThemeProviderProps, UseThemeProps } from 'next-themes/dist/types';
  
  export const ThemeProvider: React.FC<ThemeProviderProps>;
  export function useTheme(): UseThemeProps;
}
