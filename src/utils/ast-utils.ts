/*
 * @Author: chenzhongsheng
 * @Date: 2024-06-15 00:43:33
 * @Description: Coding something
 */
import type { NodePath } from '@babel/traverse';
import type { Identifier, STANDARDIZED_TYPES } from '@babel/types';

import * as T from '@babel/types';

export const t = T;

type IAstTypes = (typeof STANDARDIZED_TYPES)[number];

type IAstKey = 'key' | 'value' | 'object' | 'property' | 'left' | 'init' | 'arguments'
    | 'callee' | 'body' | 'id' | 'expression' | 'local' | 'imported' | 'argument';


export function isTargetUpdated (path: NodePath<Identifier|T.MemberExpression>) {
    const { type, key, operator } = getNodeInfo(path);

    return (
        (type === 'AssignmentExpression' && key === 'left') ||
        (type === 'UpdateExpression' && key === 'argument') ||
        (type === 'UnaryExpression' && operator === 'delete') || // delete a.a;
        isObjectAssign(path)
    );

}

export function isObjectAssign (path: NodePath<Identifier|T.MemberExpression>) {
    const parent = path.parentPath;
    if (parent.type === 'CallExpression') {
        const callee = (parent.node as T.CallExpression).callee;

        if (
            callee.type === 'MemberExpression' &&
            (callee.object as T.Identifier)?.name === 'Object' &&
            (callee.property as T.Identifier)?.name === 'assign' &&
            path.key === 0
        ) {
            return true;
        }
    }
    return false;
}

const ArrayFnSet = new Set([ 'push', 'pop', 'unshift', 'shift', 'splice', 'sort', 'reverse' ]);

export function isTargetArrayUpdated (path: NodePath<T.MemberExpression>) {
    if (path.parent.type === 'CallExpression') {
        // @ts-ignore
        const fn = path.node.property.name;
        if (typeof fn !== 'string') return;

        if (ArrayFnSet.has(fn)) {
            return true;
        }
    }
    return false;
}

// a.b.c => a
export function getMemberKey (path: NodePath<T.MemberExpression>) {
    return getMemberNodeKey(path.node);
}

export function getMemberNodeKey (node: T.MemberExpression) {
    let obj = node.object;

    while (obj.type === 'MemberExpression') {
        obj = obj.object;
    }

    if (obj.type === 'Identifier') {
        return obj.name;
    }
    return '';
}

export function getNodeInfo (path: NodePath<T.Node>) {
    // @ts-ignore
    const type: IAstTypes = path.container?.type || '';
    // @ts-ignore
    const operator = path.container?.operator;
    const key = path.key as IAstKey;
    const listKey = path.listKey as IAstKey;
    return { type, key, listKey, operator };
}

export function isFromImport (path: NodePath<any>, name: string, moduleName: string) {
    const binding = path.scope.getBinding(name);
    if (!binding) return false;
    const parent = binding.path.parentPath;
    if (parent?.type === 'ImportDeclaration') {
        // @ts-ignore
        if (parent.node?.source?.value === moduleName) return true;
    }
    return false;
}