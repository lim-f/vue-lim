
/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-25 10:45:54
 * @Description: Coding something
 */
import { transformVueSFC, isLimSFC } from 'vue-lim';
import path from 'path';
import fs from 'fs';


export default (): any => ({
    name: 'vue-lim',
    setup (build: any) {
        build.onResolve({ filter: /\.vue$/ }, (args: any) => {
            if (args.resolveDir === '') return;

            return {
                path: path.isAbsolute(args.path)
                    ? args.path
                    : path.join(args.resolveDir, args.path),
                namespace: 'vue-lim'
            };
        });

        // load files with "yaml" namespace
        build.onLoad({ filter: /.*/, namespace: 'vue-lim' }, (args: any) => {
            const id = args.path;
            const code = fs.readFileSync(id, 'utf-8');

            return {
                contents: isLimSFC(code, id) ? transformVueSFC(code) : code,
            };
        });
    }
});
