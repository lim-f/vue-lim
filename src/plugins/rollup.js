
/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-25 10:45:54
 * @Description: Coding something
 */
import { transformVue, isLimSFC } from './vue-lim.es.min.js';

export default function ()  {

    return {
        name: 'rollup-plugin-prodec',
        transform (code, id) {
            if (!isLimSFC(code, id)) return null;
            return { code: transformVue(code) };
        }
    };
}