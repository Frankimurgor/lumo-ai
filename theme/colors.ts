// Lumo AI — Theme palettes
// Single source of truth for all colors used across the app.

export interface ThemePalette {
  mode: 'light' | 'dark';
  navy: string;           // primary brand color (used as title / button bg)
  background: string;     // screen background
  card: string;           // card / surface background
  textPrimary: string;    // headings, tool names
  textSecondary: string;  // subtitles, descriptions
  border: string;         // card and divider borders
  chipBg: string;         // inactive chip background
  chipActiveBg: string;   // active chip background
  chipActiveText: string; // active chip text
  placeholder: string;    // input placeholder text
  star: string;           // favorite star fill
  starEmpty: string;      // favorite star outline
  soonBg: string;         // "SOON" tag bg
  soonText: string;       // "SOON" tag text
  chevron: string;        // settings row chevron
  sectionLabel: string;   // uppercase section headers
}

export const LIGHT_THEME: ThemePalette = {
  mode: 'light',
  navy: '#1A237E',
  background: '#F5EFE0',
  card: '#FFFFFF',
  textPrimary: '#1A237E',
  textSecondary: '#5C6BC0',
  border: 'rgba(26, 35, 126, 0.12)',
  chipBg: 'rgba(26, 35, 126, 0.06)',
  chipActiveBg: '#1A237E',
  chipActiveText: '#FFFFFF',
  placeholder: '#8A93C9',
  star: '#F5B301',
  starEmpty: '#C7CCE5',
  soonBg: '#FEF3C7',
  soonText: '#B45309',
  chevron: '#B0B6D6',
  sectionLabel: '#5C6BC0',
};

export const DARK_THEME: ThemePalette = {
  mode: 'dark',
  navy: '#C7CBFF',           // lighter navy for dark bg so it stays readable
  background: '#0F1220',
  card: '#1B1F35',
  textPrimary: '#EAECFF',
  textSecondary: '#9BA3D0',
  border: 'rgba(199, 203, 255, 0.14)',
  chipBg: 'rgba(199, 203, 255, 0.08)',
  chipActiveBg: '#C7CBFF',
  chipActiveText: '#0F1220',
  placeholder: '#7A82B0',
  star: '#F5B301',
  starEmpty: '#4A5178',
  soonBg: '#4A3A10',
  soonText: '#FCD34D',
  chevron: '#6B72A0',
  sectionLabel: '#9BA3D0',
};