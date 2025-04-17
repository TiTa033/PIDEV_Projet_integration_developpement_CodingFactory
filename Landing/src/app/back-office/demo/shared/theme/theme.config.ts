import { ThemePalette } from '@angular/material/core';

export interface ThemeConfig {
  primary: ThemePalette;
  accent: ThemePalette;
  warn: ThemePalette;
  isDark: boolean;
}

export const defaultTheme: ThemeConfig = {
  primary: 'primary',
  accent: 'accent',
  warn: 'warn',
  isDark: false
};

export const darkTheme: ThemeConfig = {
  primary: 'primary',
  accent: 'accent',
  warn: 'warn',
  isDark: true
}; 