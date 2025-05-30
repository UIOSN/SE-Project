import { Preset, PaletteDesignToken, Theme } from '@primeuix/themes/types';
export * from '@primeuix/styled';

declare const definePreset: (...presets: Preset[]) => Preset;
declare const updatePreset: (...presets: Preset[]) => Preset;
declare const updatePrimaryPalette: (palette?: PaletteDesignToken) => Preset;
declare const updateSurfacePalette: (palette?: PaletteDesignToken) => Preset;
declare const usePreset: (...presets: Preset[]) => Preset;
declare const useTheme: (theme: Theme) => Theme;

export { definePreset, updatePreset, updatePrimaryPalette, updateSurfacePalette, usePreset, useTheme };
