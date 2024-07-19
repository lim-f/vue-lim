
/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-25 10:45:54
 * @Description: Coding something
 */
import { transformVue, isLimSFC } from '../vue-lim.min.mjs';

export default function ()  {
    return {
        name: 'rollup-plugin-vue-lim',
        transform (code, id) {
            if (!isLimSFC(code, id)) return null;
            return { code: transformVue(code) };
        }
    };
};