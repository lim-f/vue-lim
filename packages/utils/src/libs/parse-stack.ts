/*
 * @Author: chenzhongsheng
 * @Date: 2024-06-12 16:24:57
 * @Description: Coding something
 */
export class ParseStack<T = string> {
    stack: T[] = [];

    current: T;

    constructor (v: T) {
        this.current = v;
    }

    push (v: T) {
        this.stack.push(this.current);
        this.current = v;
    }

    pop (onReplace?: (cur: T, prev: T)=>T) {
        let prev = this.stack.pop();
        if (typeof prev !== 'undefined') {
            if (onReplace) {
                prev = onReplace(this.current, prev);
            }
            this.current = prev;
        }
        return prev;
    }
}

export class ParseStringHistoryStack extends ParseStack<string> {

    lengthSum = 0;

    constructor (v = '') {
        super(v);
        this.lengthSum = v.length;
    }


    push (v: string) {
        super.push(v);
        this.lengthSum += v.length;
    }

    pop () {
        if (this.stack.length > 1) {
            this.lengthSum -= this.stack[this.stack.length - 1].length;
        } else {
            this.lengthSum = 0;
        }
        return super.pop((cur, prev) => prev + cur);
    }

    historyLength () {
        const stack = this.stack;
        let sum = 0;
        for (const v of stack) {
            sum += v.length;
        }
        return sum + this.current.length;
    }

    append (v: string) {
        this.current += v;
    }
}