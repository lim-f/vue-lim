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

/**
 *
https://www.cnblogs.com/eliwang/p/17153663.html

path.stop()
将本次遍历执行完毕后，停止后续节点遍历（会将本次遍历代码完整执行）
path.skip()
执行节点替换操作后，traverse依旧能够遍历，使用path.skip()可以跳过替换后的节点遍历，避免不合理的递归调用，不影响后续节点遍历（skip位置后面代码会执行）
对于单次替换多个节点的情况，考虑是否可以使用path.stop()
return
跳过当前遍历的后续代码，不影响后续节点遍历（相当于continue）

path.inList：是否有同级节点
path.container：获取容器（包含所有同级节点的数组），如果没有同级节点，则返回Node对象
path.key：获取当前节点在容器中的索引，如果没有同级节点，则返回该节点对应的属性名（字符串）
path.listKey：获取容器名，如果没有容器，则返回undefined

path.getSibling(index)：根据容器数组中的索引，来获取同级Path，index可以通过path.key来获取
path.unshiftContainer()与path.pushContainer()：此处的path必须是容器，比如body
    往容器最前面或者后面加入节点
    第一个参数为listKey
    第二个参数为Node或者Node数组
    返回值是一个数组，里面元素是刚加入的NodePath对象

path.scope.block
    该属性可以获取标识符作用域，返回Node对象

path.scope.getBinding('标识符')
    获取当前节点下能够引用到的标识符的绑定（含父级作用域中定义的标识符），返回Binding对象，引用不到则返回undefined
    获取Binding对象：
    Binding中的关键属性：
        identifier：a标识符的Node对象
        path：a标识符的NodePath对象
        scope：a标识符的scope，其中的block节点转为代码后，就是它的作用域范围add，假如获取的是函数标识符，也可以获取其作用域（获取作用域）
        kind：表明标识符的类型，本例中是一个参数（判断是否为参数）
        constant：是否常量
        referencePaths：所有引用该标识符的节点Path对象数组（元素type为Identifier）
        constantViolations：存放所有修改该标识符节点的Path对象数组（长度不为0，表示该标识符有被修改，元素type为AssignmentExpression，即赋值表达式）
        referenced：是否被引用
        references：被引用的次数
获取函数作用域
    可通过Binding对象.scope.block来获取标识符作用域Node

path.scope.getOwnBinding('标识符')
    获取当前节点的标识符绑定（不含父级作用域中定义的标识符、子函数中定义的标识符）

scope.traverse()：【path.scope.traverse() 或者 path.scope.getBinding('xx').scope.traverse()】
    既可以使用Path对象中的scope，也可以使用Binding对象中的scope，推荐使用Binding中的

scope.rename(原名，新名)：会同时修改所有引用该标识符的地方

scope.hasBinding('a')
是否有标识符a的绑定，返回true或者false，返回false时等同于scope.getBindings('a')的值为undefined
scope.hasOwnBinding('a')
当前节点是否有自己标识符a的绑定，返回true或则false
scope.getAllBindings()
获取当前节点的所有绑定，返回一个对象，该对象以标识符为属性名，对应的Bingding对象为属性值
scope.hasReference('a')
查询当前节点中是否有a标识符的引用，返回true或则false
scope.getBindingIdentifier('a')
获取当前节点中绑定的a标识符，返回Identifier的Node对象，等同于scope.getBinding('a').identifier
    */

export function isFuncParameter (path: NodePath<Identifier>) {
    // console.log('isFuncParameter', t.isDeclaration(path.node), path.key, path.listKey, path.parentPath.node);
    return path.listKey === 'params';
}

export function isDeclaration (path: NodePath<Identifier>) {

    // @ts-ignore
    const type = path.container?.type;

    return path.key == 'id' && (
        type === 'FunctionDeclaration' || type === 'VariableDeclarator'
    );
}

export function isUsedIdentifier (path: NodePath<Identifier>) {

    const { type, key, listKey } = getNodeInfo(path);

    // testAnalyzeExpression('a === 3 && count.aa > 1 && a.c > 2 && c + 3 && d ++ && aa() && aa(bb) && {a, c} && {x} && {x1: x2} && (function a(a){return a}) && ((a)=>a); let a=b; a > 3 ? a: b')
    return (
        (type === 'ExpressionStatement' && key === 'expression') ||
        (type === 'MemberExpression' && key === 'object') ||
        (type === 'BinaryExpression') ||
        (type === 'UpdateExpression') ||
        (type === 'CallExpression') ||
        (listKey === 'arguments') ||
        (type === 'ObjectProperty' && key === 'value') ||
        (type === 'ReturnStatement') ||
        (type === 'ArrowFunctionExpression' && key === 'body') ||
        (type === 'VariableDeclarator' && key == 'init') ||
        (type === 'ConditionalExpression')
    );
}

export function createArrowFnExpression (node: T.Expression|T.BlockStatement) {
    return t.arrowFunctionExpression([], node);
}

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

export function isFunctionDeclaration () {

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

export function isStaticNode (node: T.Node|null): boolean {
    // node = unwrapTSNode(node);
    if (!node) return true;
    switch (node.type) {
        case 'UnaryExpression': // void 0, !true
            return isStaticNode(node.argument);

        case 'LogicalExpression': // 1 > 2
        case 'BinaryExpression': // 1 + 2
            return isStaticNode(node.left) && isStaticNode(node.right);

        case 'ConditionalExpression': {
        // 1 ? 2 : 3
            return (
                isStaticNode(node.test) &&
                isStaticNode(node.consequent) &&
                isStaticNode(node.alternate)
            );
        }

        case 'SequenceExpression': // (1, 2)
        case 'TemplateLiteral': // `foo${1}`
            return node.expressions.every(item => isStaticNode(item));

        case 'ParenthesizedExpression': // (1)
            return isStaticNode(node.expression);

        case 'StringLiteral':
        case 'NumericLiteral':
        case 'BooleanLiteral':
        case 'NullLiteral':
        case 'BigIntLiteral':
        case 'ObjectMethod':
            return true;
        case 'ObjectExpression':
            return node.properties.every(item => isStaticNode(item));
        case 'ObjectProperty':
            return isStaticNode(node.value);
        case 'ArrayExpression':
            return node.elements.every(item => isStaticNode(item));
    }
    return false;
}

export function createDeclaration () {
    return t.variableDeclaration('var', []);
}
export function createDeclarator (id: string, expression: T.Expression) {
    return t.variableDeclarator(
        t.identifier(id),
        expression,
    );
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