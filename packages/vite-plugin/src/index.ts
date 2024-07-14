
/*
 * @Author: chenzhongsheng
 * @Date: 2022-11-25 10:45:54
 * @Description: Coding something
 */
import { transformVueSFC, isLimSFC } from 'vue-lim';

export default function ()  {
    return {
        name: 'vite:vue-lim',
        transform (code: string, id: string) {
            if (!isLimSFC(code, id)) return null;
            return { code: transformVueSFC(code) };
        }
    };
}
