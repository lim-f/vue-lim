
/*
 * @Author: chenzhongsheng
 * @Date: 2024-07-14 22:24:26
 * @Description: Coding something
 */
import { VariableDeclarator } from '@babel/types';
import type { ScriptNode } from './script-node';
import { NodePath } from '@babel/traverse';

export class Computed {
    script: ScriptNode;

    constructor (script: ScriptNode) {
        this.script = script;
    }

    checkRelatedComputed (path: NodePath<any>) {

        // @ts-ignore
        const parent: NodePath<VariableDeclarator> = path.findParent(parent => {
            return parent.node.type === 'VariableDeclarator';
        });
        if (!parent || !parent.node.init) return;

        const initType = parent.node.init.type;
        if (
            initType === 'CallExpression' &&
            // @ts-ignore
            parent.node.init.callee.name === 'computed'
        ) {
            return;
        }

        if (initType === 'ArrowFunctionExpression' || initType === 'FunctionExpression') {
            return;
        }

        this.script.addImport('computed');

        const binding = parent.scope.getBinding(
            // @ts-ignore
            parent.node.id.name
        );

        this.script.modifyVariable(binding!, 'computed');
    }

}