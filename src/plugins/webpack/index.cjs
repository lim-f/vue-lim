/*
 * @Author: chenzhongsheng
 * @Date: 2024-07-14 21:40:16
 * @Description: Coding something
 */
const { transformVue, isLimSFC } = require('../vue-lim.min.cjs');

function loader (this, code)  {
    const id = this.resourcePath;
    if (!isLimSFC(code, id)) return code;
    return transformVue(code);
}

module.exports = loader;
module.exports.default = loader;