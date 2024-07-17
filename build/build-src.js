/*
 * @Author: chenzhongsheng
 * @Date: 2023-12-09 21:29:58
 * @Description: Coding something
 */
const { resolve } = require('path');
const { buildCommon, log } = require('./utils');
const fs = require('fs');
const { fs: ufs } = require('up-fs');

function main () {

    const version = process.argv[2] || '0.0.1';

    const pubDir = resolve(__dirname, '../publish');
    const srcDir = resolve(__dirname, '../src/dist');

    const esName = 'vue-lim.es.min.js';
    const iifeName = 'vue-lim.iife.min.js';
    const typeName = 'index.d.ts';

    ufs.removeDir(pubDir);

    buildCommon({
        titleName: 'vue-lim',
        bundleCmd: `npx vite build -m=src_es`,
    });

    ufs.copyFile({ src: `${srcDir}/${esName}`, target: `${pubDir}/${esName}` });

    buildCommon({
        titleName: 'vue-lim',
        bundleCmd: `npx vite build -m=src_iife`,
        dtsCmd: `npx dts-bundle-generator -o src/dist/${typeName} src/index.ts`,
    });
    ufs.copyFile({ src: `${srcDir}/${iifeName}`, target: `${pubDir}/${iifeName}` });
    ufs.copyFile({ src: `${srcDir}/${typeName}`, target: `${pubDir}/${typeName}` });

    ufs.copyFile({ src: `LICNESE`, target: `${pubDir}/LICNESE` });
    ufs.copyFile({ src: `README.md`, target: `${pubDir}/README.md` });

    const pluginDir = resolve(__dirname, '../src/plugins');
    const plugins = fs.readdirSync(pluginDir);
    plugins.forEach(name => {
        ufs.copyFile({ src: `${pluginDir}/${name}`, target: `${pubDir}/${name}` });
    });

    ufs.writeFile(`${pluginDir}/package.json`, JSON.stringify({
        name: 'vue-lim',
        version: version,
        description: 'Make Vue easier to use.',
        main: esName,
        module: esName,
        types: typeName,
        unpkg: iifeName,
        jsdelivr: iifeName,
        license: 'MIT',
        keywords: [ 'vue3', 'vue-lim' ],
        homepage: 'https://lim-f.github.io/playground',
        'repository': 'git@github.com:lim-f/vue-lim.git',
        'author': 'tackchen <theajack@qq.com>',
        publishConfig: {
            registry: 'https://registry.npmjs.org',
        },
    }, null, 4));
}

main();
