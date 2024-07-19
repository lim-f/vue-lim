
/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-25 10:45:54
 * @Description: Coding something
 */
const { transformVue, isLimSFC } =  require('../vue-lim.min.cjs');

function plugin ()  {
    return {
        name: 'rollup-plugin-vue-lim',
        transform (code, id) {
            if (!isLimSFC(code, id)) return null;
            return { code: transformVue(code) };
        }
    };
}
module.exports = plugin;
module.exports.default = plugin;