/*
 * @Author: chenzhongsheng
 * @Date: 2024-07-12 16:33:01
 * @Description: Coding something
 */
import type { NodePath } from '@babel/traverse';
import type { Identifier, VariableDeclaration, VariableDeclarator } from '@babel/types';
import { getMemberKey, getNodeInfo, isTargetArrayUpdated, isTargetUpdated } from './ast-utils';
import { parseJS, traverseAst } from './js-utils';

export enum VarType {
    Import,
    Define,
    Function,
    Temporary, //
}
export type IDeclareType = 'var'|'let'|'const'|'none';
export interface IVariableData {
    type: VarType,
    declarePath: NodePath,
    path: NodePath<Identifier>,
    kind: IDeclareType,
    modified: boolean,
}
export interface IJson<T = any> {
    [prop: string]: T;
}


export function extractVariable (path: NodePath<Identifier>): Omit<IVariableData, 'script'> | null {

    const { type, key } = getNodeInfo(path);
    // if (
    //     (type === 'ImportSpecifier' && key === 'local') ||
    //     (type === 'ImportDefaultSpecifier' && key === 'local')
    // ) {
    //     return {
    //         type: VarType.Import,
    //         declarePath: path.parentPath.parentPath!,
    //         kind: 'none',
    //         start,
    //         modified: false,
    //     };
    // }

    if (type === 'VariableDeclarator' && key === 'id') {
        const initType = (path.parentPath.node as VariableDeclarator).init?.type;
        if (initType === 'ArrowFunctionExpression' || initType === 'FunctionExpression') {
            return null;
        }

        const declarePath = path.parentPath.parentPath! as NodePath<VariableDeclaration>;

        return {
            type: VarType.Define,
            declarePath,
            kind: (declarePath.node.kind) as IDeclareType,
            modified: false,
            path,
        };
    }

    // if (type === 'FunctionDeclaration' && key === 'id') {
    //     return {
    //         type: VarType.Function,
    //         declarePath: path.parentPath,
    //         kind: 'none',
    //         start,
    //     };
    // }

    return null;
}


export function analyzeExpression (code: string): string[] { // 返回修改了的变量
    code = code.trim();

    const updateVariables: string[] = [];
    const ast = parseJS(code);
    traverseAst(ast, {
        Identifier (path) {
            const name = path.node.name;
            // console.log(path.getBi)
            // console.log('used is', path.container, path.listKey, path.key, path.toString());
            if (isTargetUpdated(path)) {
                if (path.scope.getOwnBinding(name)) return;
                updateVariables.push(name);
            }
        },
        MemberExpression: (path) => {
            if (
                isTargetUpdated(path) ||
                isTargetArrayUpdated(path)
            ) {
                const name = getMemberKey(path);
                // ! 如果是局部变量则不计入统计
                if (path.scope.getOwnBinding(name)) return;
                updateVariables.push(name);
            }
        }
    });

    return updateVariables;
}