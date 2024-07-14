/*
 * @Author: chenzhongsheng
 * @Date: 2024-07-14 21:40:16
 * @Description: Coding something
 */
import { transformVueSFC, isLimSFC } from './vue-lim.es.min';

export default function (this, code)  {
    const id = this.resourcePath;
    if (!isLimSFC(code, id)) return code;
    return transformVueSFC(code);
}