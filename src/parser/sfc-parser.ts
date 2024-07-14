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
            for (const key in attributes) {
                if (key.startsWith('@')) {
                    const variables = analyzeExpression(attributes[key]);
                    if (variables.length) {
                        variables.forEach((name) => {
                            this.script.onEventModify(name);
                        });
                    }
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