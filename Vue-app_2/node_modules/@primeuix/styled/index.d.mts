import * as _primeuix_utils_eventbus from '@primeuix/utils/eventbus';

declare function definePreset<T extends Record<string, unknown>>(...presets: T[]): T;

declare function updatePreset<T extends Record<string, unknown>>(...presets: T[]): T;

declare function updatePrimaryPalette<T = unknown, P = unknown>(palette?: T): P;

declare function updateSurfacePalette<T = unknown, P = unknown>(palette?: T): P;

declare function usePreset<T extends Record<string, unknown>>(...presets: T[]): T;

declare function useTheme<T = unknown>(theme: T): T;

declare const _default$5: {
    defaults: {
        variable: {
            prefix: string;
            selector: string;
            excludedKeyRegex: RegExp;
        };
        options: {
            prefix: string;
            darkModeSelector: string;
            cssLayer: boolean;
        };
    };
    _theme: undefined;
    _layerNames: Set<unknown>;
    _loadedStyleNames: Set<unknown>;
    _loadingStyles: Set<unknown>;
    _tokens: {};
    update(newValues?: any): void;
    readonly theme: any;
    readonly preset: any;
    readonly options: any;
    readonly tokens: {};
    getTheme(): any;
    setTheme(newValue: any): void;
    getPreset(): any;
    setPreset(newValue: any): void;
    getOptions(): any;
    setOptions(newValue: any): void;
    getLayerNames(): unknown[];
    setLayerNames(layerName: any): void;
    getLoadedStyleNames(): Set<unknown>;
    isStyleNameLoaded(name: string): boolean;
    setLoadedStyleName(name: string): void;
    deleteLoadedStyleName(name: string): void;
    clearLoadedStyleNames(): void;
    getTokenValue(tokenPath: string): any;
    getCommon(name: string | undefined, params: any): {
        primitive: {
            css: string | undefined;
            tokens: any;
        };
        semantic: {
            css: string | undefined;
            tokens: any[] | undefined;
        };
        global: {
            css: string | undefined;
            tokens: any[] | undefined;
        };
        style: any;
    };
    getComponent(name: string | undefined, params: any): {
        css: string | undefined;
        tokens: any[] | undefined;
        style: any;
    };
    getDirective(name: string | undefined, params: any): {
        css: string | undefined;
        tokens: any[] | undefined;
        style: any;
    };
    getCustomPreset(name: string | undefined, preset: any, selector: string, params: any): {
        css: string | undefined;
        tokens: any[] | undefined;
        style: any;
    };
    getLayerOrderCSS(name?: string): string;
    transformCSS(name: string | undefined, css: string, type?: string, mode?: string): string;
    getCommonStyleSheet(name: string | undefined, params: any, props?: {}): any;
    getStyleSheet(name: string, params: any, props?: {}): string;
    onStyleMounted(name: string): void;
    onStyleUpdated(name: string): void;
    onStyleLoaded(event: any, { name }: {
        name: any;
    }): void;
};

declare const _default$4: (color1: string, color2: string, weight: number) => string;

declare const _default$3: (color: string) => string | Record<number, string>;

declare const _default$2: (color: string, percent: number) => string;

declare const _default$1: (color: string, percent: number) => string;

declare function css(style: any): any;

declare const $dt: (tokenPath: string) => {
    name: string;
    variable: string;
    value: any;
};
declare const dt: (tokenPath: string, fallback?: string | undefined, type?: string | undefined) => any;
declare const dtwt: (theme: any | undefined, tokenPath: string, fallback?: string, type?: string) => any;

declare const $t: (theme?: any) => {
    preset(value: any): /*elided*/ any;
    options(value: any): /*elided*/ any;
    primaryPalette(primary: any): /*elided*/ any;
    surfacePalette(surface: any): /*elided*/ any;
    define({ useDefaultPreset, useDefaultOptions }?: {
        useDefaultPreset?: boolean | undefined;
        useDefaultOptions?: boolean | undefined;
    }): {
        preset: any;
        options: any;
    };
    update({ mergePresets, mergeOptions }?: {
        mergePresets?: boolean | undefined;
        mergeOptions?: boolean | undefined;
    }): {
        preset: any;
        options: any;
    };
    use(options: any): {
        preset: any;
        options: any;
    };
};

declare function export_default(theme: any, options?: any): {
    value: any[];
    tokens: any[];
    declarations: string;
    css: string;
};

declare const ThemeService: _primeuix_utils_eventbus.EventBusOptions;

interface StyleSheetProps {
    attrs?: Record<string, unknown>;
}
interface StyleMeta {
    css?: string;
    attrs?: Record<string, unknown>;
    markup?: string;
    element?: HTMLStyleElement;
}
declare class StyleSheet {
    _styles: Map<string, StyleMeta>;
    _attrs: Record<string, unknown>;
    constructor({ attrs }?: StyleSheetProps);
    get(key: string): StyleMeta | undefined;
    has(key: string): boolean;
    delete(key: string): void;
    clear(): void;
    add(key: string, css?: string): void;
    update(): void;
    getStyles(): Map<string, StyleMeta>;
    getAllCSS(): (string | undefined)[];
    getAllMarkup(): (string | undefined)[];
    getAllElements(): (HTMLStyleElement | undefined)[];
    /**
     * Used to create a style element.
     *
     * @param {StyleMeta} meta
     * @returns {HTMLStyleElement | undefined}
     */
    createStyleElement(meta?: StyleMeta): HTMLStyleElement | undefined;
}

declare function toTokenKey(str: string): string;
declare function merge(value1: any, value2: any): void;
declare function toValue(value: any): any;
declare function toUnit(value: string, variable?: string): string;
declare function toNormalizePrefix(prefix: string): string;
declare function toNormalizeVariable(prefix?: string, variable?: string): string;
declare function getVariableName(prefix?: string, variable?: string): string;
declare function hasOddBraces(str?: string): boolean;
declare function getVariableValue(value: any, variable?: string, prefix?: string, excludedKeyRegexes?: RegExp[], fallback?: string): string | undefined;
declare function getComputedValue(obj: {} | undefined, value: any): any;
declare function setProperty(properties: string[], key: string, value?: string): void;
declare function getRule(selector: string, properties: string): string;

declare const _default: {
    regex: {
        rules: {
            class: {
                pattern: RegExp;
                resolve(value: string): {
                    type: string;
                    selector: string;
                    matched: boolean;
                };
            };
            attr: {
                pattern: RegExp;
                resolve(value: string): {
                    type: string;
                    selector: string;
                    matched: boolean;
                };
            };
            media: {
                pattern: RegExp;
                resolve(value: string): {
                    type: string;
                    selector: string;
                    matched: boolean;
                };
            };
            system: {
                pattern: RegExp;
                resolve(value: string): {
                    type: string;
                    selector: string;
                    matched: boolean;
                };
            };
            custom: {
                resolve(value: string): {
                    type: string;
                    selector: string;
                    matched: boolean;
                };
            };
        };
        resolve(value: any): any[];
    };
    _toVariables(theme: any, options: any): {
        value: any[];
        tokens: any[];
        declarations: string;
        css: string;
    };
    getCommon({ name, theme, params, set, defaults }: any): {
        primitive: {
            css: string | undefined;
            tokens: any;
        };
        semantic: {
            css: string | undefined;
            tokens: any[] | undefined;
        };
        global: {
            css: string | undefined;
            tokens: any[] | undefined;
        };
        style: any;
    };
    getPreset({ name, preset, options, params, set, defaults, selector }: any): {
        css: string | undefined;
        tokens: any[] | undefined;
        style: any;
    };
    getPresetC({ name, theme, params, set, defaults }: any): {
        css: string | undefined;
        tokens: any[] | undefined;
        style: any;
    };
    getPresetD({ name, theme, params, set, defaults }: any): {
        css: string | undefined;
        tokens: any[] | undefined;
        style: any;
    };
    applyDarkColorScheme(options: any): boolean;
    getColorSchemeOption(options: any, defaults: any): any[];
    getLayerOrder(name: string, options: any | undefined, params: any, defaults: any): string;
    getCommonStyleSheet({ name, theme, params, props, set, defaults }: any): any;
    getStyleSheet({ name, theme, params, props, set, defaults }: any): string;
    createTokens(obj: any | undefined, defaults: any, parentKey?: string, parentPath?: string, tokens?: any): any;
    getTokenValue(tokens: any, path: string, defaults: any): any;
    getSelectorRule(selector1: any, selector2: any, type: string, css: string): string;
    transformCSS(name: string, css: string, mode?: string, type?: string, options?: any, set?: any, defaults?: any, selector?: string): string;
};

interface ThemeOptions {
    /**
     * The prefix for the theme
     * @default 'p'
     */
    prefix?: string;
    /**
     * Dark mode selector
     * @default 'system'
     */
    darkModeSelector?: string;
    /**
     * Whether to use the css layer
     * @default false
     */
    cssLayer?: boolean | {
        name?: string;
        order?: string;
    };
}
interface ThemeStyleOptions {
    dt: (key: string, fallback?: string | number | Pick<ThemeStyleOptions, 'dt'>) => string | number | undefined;
}

export { $dt, $t, StyleSheet, _default$5 as Theme, type ThemeOptions, ThemeService, type ThemeStyleOptions, _default as ThemeUtils, css, definePreset, dt, dtwt, getComputedValue, getRule, getVariableName, getVariableValue, hasOddBraces, merge, _default$4 as mix, _default$3 as palette, setProperty, _default$2 as shade, _default$1 as tint, toNormalizePrefix, toNormalizeVariable, toTokenKey, toUnit, toValue, export_default as toVariables, updatePreset, updatePrimaryPalette, updateSurfacePalette, usePreset, useTheme };
