/*
 * @Author: chenzhongsheng
 * @Date: 2024-07-14 21:40:16
 * @Description: Coding something
 */
import { transformVue, isLimSFC } from '../vue-lim.min.mjs';

export default function (this, code)  {
    const id = this.resourcePath;
    if (!isLimSFC(code, id)) return code;
    return transformVue(code);
}