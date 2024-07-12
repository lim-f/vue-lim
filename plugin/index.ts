/*
 * @Author: chenzhongsheng
 * @Date: 2024-06-14 11:04:59
 * @Description: Coding something
 */

export default function myPlugin () {
    const virtualModuleId = 'virtual:my-module';
    const resolvedVirtualModuleId = '\0' + virtualModuleId;

    return {
        name: 'my-plugin', // 必须的，将会在 warning 和 error 中显示
        // resolveId (id, aaa) {
        //     console.log('resolveId', id, aaa);
        //     if (id === virtualModuleId) {
        //         return resolvedVirtualModuleId;
        //     }
        // },
        // load (id, aaa) {
        //     console.log('load', id, aaa);
        //     if (id === resolvedVirtualModuleId) {
        //         return `export const msg = "from virtual module"`;
        //     }
        // },
        buildStart () {

        },
        buildEnd () {
            console.log('End');
            // 生成 HTML
        },

        closeBundle () {
            console.log('Close bundle');
        },

        transformIndexHtml (a, b, c) {
            // console.log('transformIndexHtml');
        },

        // config: () => ({
        //     esbuild: {
        //         jsx: 'preserve'
        //     }
        // }) as any,

        transform (code: string, id: string) {
            // console.log('transform', id);
            if (id.endsWith('.htm') || id.endsWith('.htmf')) {
                return '';
            }
            return code;
        },
    };
}