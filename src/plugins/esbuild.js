
/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-25 10:45:54
 * @Description: Coding something
 */
import { transformVueSFC, isLimSFC } from './vue-lim.es.min';
import path from 'path';
import fs from 'fs';

export default () => ({
    name: 'vue-lim',
    setup (build) {
        build.onResolve({ filter: /\.vue$/ }, (args) => {
            if (args.resolveDir === '') return;

            return {
                path: path.isAbsolute(args.path)
                    ? args.path
                    : path.join(args.resolveDir, args.path),
                namespace: 'vue-lim'
            };
        });

        build.onLoad({ filter: /.*/, namespace: 'vue-lim' }, (args) => {
            const id = args.path;
            const code = fs.readFileSync(id, 'utf-8');

            return {
                contents: isLimSFC(code, id) ? transformVueSFC(code) : code,
            };
        });
    }
});
