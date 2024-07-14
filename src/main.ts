/*
 * @Author: chenzhongsheng
 * @Date: 2024-06-23 09:23:28
 * @Description: Coding something
 */

import { SFCParser } from './parser/sfc-parser';

export function transformVueSFC (input: string) {
    const parser = new SFCParser(input);
    return parser.toString();
}

export function isLimSFC (input: string, filename = '') {
    return filename.endsWith('.lim.vue') || /<script.*?lim.*?>/.test(input);
}