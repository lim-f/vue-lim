/*
 * @Author: chenzhongsheng
 * @Date: 2024-06-23 09:23:28
 * @Description: Coding something
 */

import { SFCParser } from './parser/sfc-parser';

if (typeof window !== 'undefined') {
    // @ts-ignore
    if (!window.process) window.process = { env: {} };
    // @ts-ignore
    if (!window.Buffer) window.Buffer = {
        // @ts-ignore
        from: (array) => new Uint8Array(array),
        // @ts-ignore
        isBuffer: (v) => v instanceof Uint8Array,
    };
}

export function transformVue (input: string) {
    const parser = new SFCParser(input);
    return parser.toString();
}

export function isLimSFC (input: string, filename = '') {
    return filename.endsWith('.lim.vue') || /<script.*?lim.*?>/.test(input);
}