/*
 * @Author: chenzhongsheng
 * @Date: 2024-07-14 21:41:12
 * @Description: Coding something
 */
const { transformVue, isLimSFC } = require('../vue-lim.min.cjs');

function plugin ()  {
    return {
        name: 'vite:vue-lim',
        transform (code, id) {
            if (!isLimSFC(code, id)) return null;
            return { code: transformVue(code) };
        }
    };
};

module.exports = plugin;
module.exports.default = plugin;