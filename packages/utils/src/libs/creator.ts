/*
 * @Author: chenzhongsheng
 * @Date: 2024-06-23 09:51:56
 * @Description: Coding something
 */
export function createIdIncrement () {
    let id = 0;
    return () => id++;
}