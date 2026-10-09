import { useColorScheme } from 'react-native';
import { useLumo } from '../context/LumoContext';
import { DARK_THEME, LIGHT_THEME, ThemePalette } from './colors';

/**
 * Returns the active theme palette.
 * - If settings.darkMode === 'system', follows the phone's appearance.
 * - 'light' / 'dark' force the respective theme.
 */
export function useTheme(): ThemePalette {
  const { settings } = useLumo();
  const systemScheme = useColorScheme();

  if (settings.darkMode === 'system') {
    return systemScheme === 'dark' ? DARK_THEME : LIGHT_THEME;
  }
  return settings.darkMode === 'dark' ? DARK_THEME : LIGHT_THEME;
}