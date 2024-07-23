import type { ParseResult } from '@babel/parser';
import { generateCode, parseJS, traverseAst } from '../utils/js-utils';
import type { File, Identifier, ImportDeclaration, VariableDeclaration } from '@babel/types';
import type { IJson, IVariableData } from '../utils/script-util';
import { VarType, extractVariable, isInitFromVue } from '../utils/script-util';
import { getMemberKey, isTargetArrayUpdated, isTargetUpdated, t } from '../utils/ast-utils';
import type { Binding, NodePath } from '@babel/traverse';
import { Computed } from './computed';

/*
 * @Author: chenzhongsheng
 * @Date: 2024-07-12 16:17:43
 * @Description: Coding something
 */
export class ScriptNode {
    code: string;
    ast: ParseResult<File>;

    computed: Computed;

    defineVariables: IJson<IVariableData> = {};


    constructor (code: string) {
        this.computed = new Computed(this);
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

    onEventModify (name: string, forceRef = false) {
        const variable = this.defineVariables[name];

        if (!variable) return;

        // 强制将computed改为ref
        if (forceRef && !variable.forceRef && variable.modifiedFn === 'computed') {
            variable.forceRef = true;
            variable.modified = false;
        } else {
            if (isInitFromVue(variable.path)) {
                return;
            }
        }

        if (variable.modified) return;
        const binding = variable.path.scope.getBinding(name);
        this.onBinding(name, binding);
    }

    private onBinding (name: string, binding?: Binding) {
        if (!binding) throw new Error(`${name} is Undefined`);
        const variable = this.defineVariables[name];
        if (!variable || variable.modified) return;
        if (variable.path.parentPath === binding.path) {
            this.addImport('ref');
            this.modifyVariable(binding);
        }
    }

    modifyVariable (binding: Binding, fn = 'ref') {
        const name = binding.identifier.name;
        const variable = this.defineVariables[name];
        if (!variable) {
            return;
        }

        // 修改变量声明处
        if (!variable.modified) {
            variable.modified = true;

            const node = (variable.declarePath.node as VariableDeclaration).declarations.find(item => (item.id as Identifier).name === name);

            if (!node) {
                throw new Error('未找到节点');
            }

            const arg = fn === 'ref' ? node.init! : t.arrowFunctionExpression([], node.init!);

            // ! 对 computed 在 v-model 中使用场景强制改成 ref
            if (variable.forceRef && variable.modifiedFn === 'computed') {
                node.init = t.callExpression(t.identifier(fn), [
                    // @ts-ignore
                    node.init.arguments[0].body
                ]);
            } else {
                node.init = t.callExpression(t.identifier(fn), [ arg ]);
            }

            binding.referencePaths.forEach(item => {
                if (
                    item.parent.type === 'CallExpression' &&
                    // @ts-ignore
                    item.parent.callee.name === 'watch'
                ) {
                    return;
                }
                this.computed.checkRelatedComputed(item);
                item.replaceInline(t.memberExpression(t.identifier(name), t.identifier('value')));
                item.skip();
            });

            binding.constantViolations.forEach(item => {
                if (item.type === 'AssignmentExpression') {
                    // @ts-ignore
                    item.node.left = t.memberExpression(item.node.left, t.identifier('value'));
                }
            });
            variable.modifiedFn = fn;
        }
    }

    private _vueImport: ImportDeclaration;

    addImport (name: string) {
        const flag = `_added_${name}_import`;
        if (this[flag]) return;
        this[flag] = true;

        const variable = this.defineVariables[name];
        if (variable) {
            // @ts-ignore
            if (variable.type === VarType.Import && variable.declarePath.node?.source.value == 'vue') {
                // @ts-ignore
                this._vueImport = variable.declarePath.node;
                return;
            } else {
                throw new Error(`"${name}" ${name} has the same name: ${variable.declarePath.toString()}`);
            }
        }

        const specifier = t.importSpecifier(t.identifier(name), t.identifier(name));
        if (this._vueImport) {
            this._vueImport.specifiers.push(specifier);
        } else {
            this._vueImport = t.importDeclaration([ specifier ], t.stringLiteral('vue'));
            this.ast.program.body.unshift(this._vueImport);
        }
    }

    transformJs (sfc: string) {
        const output = generateCode(this.ast);
        return sfc.replace(this.code, output);
    }
}