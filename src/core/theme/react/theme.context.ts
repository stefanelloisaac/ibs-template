import { createContext } from 'react';
import type { ThemeContextState } from '../support/theme.types';

export const ThemeContext = createContext<ThemeContextState | null>(null);
