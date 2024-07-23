/*
 * @Author: chenzhongsheng
 * @Date: 2024-07-12 16:14:56
 * @Description: Coding something
 */

import { Parser } from 'htmlparser2';
import { ScriptNode } from './script-node';
import { analyzeExpression } from '../utils/script-util';

export class SFCParser {
    originCode: string;

    script: ScriptNode;

    isInLimScript: boolean;

    constructor (code: string) {
        this.originCode = code;
        const parser = new Parser({
            onopentag: this.onOpenTag.bind(this),
            ontext: this.onText.bind(this),
        });
        parser.write(this.originCode);
        parser.end();
    }


    private onOpenTag (name: string, attributes: Record<string, string>) {
        if (name === 'script') {
            // todo 进入规则
            if (('setup' in attributes) && ('lim' in attributes)) {
                this.isInLimScript = true;
            }
        } else {

            if (!this.script) return;

            for (const key in attributes) {
                const value = attributes[key];

                if (key.startsWith('@')) {
                    const variables = analyzeExpression(value);
                    if (variables.length) {
                        variables.forEach((name) => {
                            this.script.onEventModify(name);
                        });
                    }
                } else if (key === 'v-model') {
                    this.script.onEventModify(value, true);
                } else if (key === 'v-for') {
                    // ! 因为不好区分是否对 item做了修改，此处只要v-for使用了 都视为modify
                    this.script.onEventModify(value.substring(value.lastIndexOf(' in ') + 4));
                }
            }
        }

    }
    onText (text: string) {
        if (this.isInLimScript && !this.script) {
            this.script = new ScriptNode(text);
        }
    }

    toString () {
        if (!this.script) return this.originCode;

        return this.script.transformJs(this.originCode);
    }
}