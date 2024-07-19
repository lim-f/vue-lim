/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-25 10:45:54
 * @Description: Coding something
 */
const { transformVue, isLimSFC } = require('../vue-lim.min.cjs');
const path = require('path');
const fs = require('fs');

function plugin () {
    return {
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
                    contents: isLimSFC(code, id) ? transformVue(code) : code,
                };
            });
        }
    };
};
module.exports = plugin;
module.exports.default = plugin;
