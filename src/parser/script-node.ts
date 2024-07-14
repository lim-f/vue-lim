import type { ParseResult } from '@babel/parser';
import { generateCode, parseJS, traverseAst } from '../utils/js-utils';
import type { File, Identifier, VariableDeclaration } from '@babel/types';
import type { IJson, IVariableData } from '../utils/script-util';
import { VarType, extractVariable } from '../utils/script-util';
import { getMemberKey, isTargetArrayUpdated, isTargetUpdated, t } from '../utils/ast-utils';
import type { Binding, NodePath } from '@babel/traverse';

/*
 * @Author: chenzhongsheng
 * @Date: 2024-07-12 16:17:43
 * @Description: Coding something
 */
export class ScriptNode {
    code: string;
    ast: ParseResult<File>;

    defineVariables: IJson<IVariableData> = {};


    constructor (code: string) {

        this.code = code;

        __DEV__ && console.log('HScriptNode onText', code);

        this.ast = parseJS(code);

        let blockDeep = 0;
        traverseAst(this.ast, {
            BlockStatement: {
                enter () {blockDeep++;},
                exit () {blockDeep--;}
            },
            Identifier: (path) => {
                const name = path.node.name;
                if (blockDeep === 0) {
                    const info = extractVariable(path);
                    if (info) {
                        __DEV__ && console.log('extractVariable', name, info);
                        const declarePath = path.findParent((parent) => {
                            return /Declaration$/.test(parent.node.type);
                        });
                        if (!declarePath) throw new Error(`Cannot find declaration: ${path.toString()}`);
                        this.defineVariables[name] = info;
                    }
                }
                if (isTargetUpdated(path)) {
                    this.checkUpdatedVariable(path, name);
                }
            },
            MemberExpression: (path) => {
                if (
                    isTargetUpdated(path) ||
                    isTargetArrayUpdated(path)
                ) {
                    const key = getMemberKey(path);
                    this.checkUpdatedVariable(path, key);
                }
            },
        });
        __DEV__ && console.log('defineVariables', this.defineVariables);
    }
    private checkUpdatedVariable (path: NodePath, name: string) {
        const binding = path.scope.getBinding(name);
        this.onBinding(name, binding);
    }

    onEventModify (name: string) {
        const variable = this.defineVariables[name];
        if (variable.modified) return;
        const binding = variable.path.scope.getBinding(name);
        this.onBinding(name, binding);
    }

    private onBinding (name: string, binding?: Binding) {
        if (!binding) throw new Error(`${name} is Undefined`);
        const variable = this.defineVariables[name];

        if (!variable) {
            throw new Error(`${name} is not found`);
        }
        if (variable.modified) return;
        if (variable.path.parentPath === binding.path) {
            this.addRefImport();
            this.modifyVariable(binding);
        }
    }

    private modifyVariable (binding: Binding) {
        const name = binding.identifier.name;
        const variable = this.defineVariables[name];

        // 修改变量声明处
        if (!variable.modified) {
            variable.modified = true;

            const node = (variable.declarePath.node as VariableDeclaration).declarations.find(item => (item.id as Identifier).name === name);

            if (!node) {
                throw new Error('未找到节点');
            }

            // node.init?.type === 'CallExpression' && node.id;
            node.init = t.callExpression(t.identifier('ref'), [ node.init! ]);

            binding.referencePaths.forEach(item => {
                item.replaceInline(t.memberExpression(t.identifier(name), t.identifier('value')));
                item.skip();
            });
        }
    }

    private _addedRefImport = false;
    private addRefImport () {
        if (this._addedRefImport) return;
        this._addedRefImport = true;

        const ref = this.defineVariables.ref;
        if (ref) {
            // @ts-ignore
            if (ref.type === VarType.Import && ref.declarePath.node?.source.value == 'vue') {
                return;
            } else {
                throw new Error(`"ref" ref has the same name: ${ref.declarePath.toString()}`);
            }
        }

        this.ast.program.body.unshift(
            t.importDeclaration([
                t.importSpecifier(t.identifier('ref'), t.identifier('ref')),
            ], t.stringLiteral('vue'))
        );
    }

    transformJs (sfc: string) {
        const output = generateCode(this.ast);
        return sfc.replace(this.code, output);
    }
}