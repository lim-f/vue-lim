/*
 * @Author: chenzhongsheng
 * @Date: 2024-06-14 23:57:14
 * @Description: Coding something
 */

import type { ParseResult } from '@babel/parser';
import type { TraverseOptions } from '@babel/traverse';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import type { File, Node } from '@babel/types';
import { parse } from '@babel/parser';

export function parseJS (code: string): ParseResult<File> {
    return parse(code, {
        plugins: [ 'typescript' ],
        sourceType: 'module',
        // todo
    });
}

export function traverseAst (ast: ParseResult<File>, options: TraverseOptions<Node>) {
    traverse(ast, options);
}

export function generateCode (ast: ParseResult<File>|Node) {
    return generate(ast, {
    }).code;
}