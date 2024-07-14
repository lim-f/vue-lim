
/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-25 10:45:54
 * @Description: Coding something
 */

import { transformVueSFC, isLimSFC } from 'vue-lim';

export default function (this: any, code: string)  {
    const id: string = this.resourcePath;
    if (!isLimSFC(code, id)) return code;
    return transformVueSFC(code);
}