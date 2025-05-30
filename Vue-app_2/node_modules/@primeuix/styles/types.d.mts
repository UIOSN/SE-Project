import { ThemeStyleOptions } from '@primeuix/styled';

interface StyleOptions extends ThemeStyleOptions {
    [key: string]: unknown;
}
declare type StyleType = string | ((options: StyleOptions) => string);

export type { StyleOptions, StyleType };
