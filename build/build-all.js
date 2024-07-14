/*
 * @Author: chenzhongsheng
 * @Date: 2024-04-30 11:08:00
 * @Description: Coding something
 */
const { buildSinglePkg } = require('./utils');
const { log } = require('./utils');
const { fs: ufs } = require('up-fs');
const fs = require('fs');
const { resolve } = require('path');

async function main () {
    const version = process.argv[2] || '0.0.1';

    const list = fs.readdirSync(resolve(__dirname, '../packages'));

    for (let i = 0; i < list.length; i++) {
        const dirName = list[i];
        log.green(`Build ${dirName} Start`);
        buildSinglePkg(list[i]);
        generatePublishDir(dirName, version);
    }

    log.green(`Build success`);
}

function generatePublishDir (dirName, version) {

    const pkg = require(`../packages/${dirName}/package.json`);

    const pkgName = pkg.name;

    const sp = `packages/${dirName}/dist`;
    const tp = `publish/${pkgName}`;

    ufs.removeDir(dirName);

    const esName = `${pkgName}.es.min.js`;
    const iifeName = `${pkgName}.iife.min.js`;
    const typeName = 'index.d.ts';

    ufs.copyFile({ target: `${tp}/${typeName}`, src: `${sp}/${typeName}` });
    ufs.copyFile({ target: `${tp}/${esName}`, src: `${sp}/${esName}` });
    ufs.copyFile({ target: `${tp}/LICNESE`, src: `LICNESE` });
    ufs.copyFile({ target: `${tp}/README.md`, src: `README.md` });

    const isLimPkg = pkgName === 'vue-lim';

    if (isLimPkg) {
        ufs.copyFile({ target: `${tp}/${iifeName}`, src: `${sp}/${iifeName}` });
    }

    const packageJson = {
        name: pkgName,
        version: version,
        description: 'Make Vue easier to use.',
        main: esName,
        module: esName,
        types: typeName,
        license: 'MIT',
        keywords: [ 'vue3', 'vue-lim' ],
        homepage: 'https://theajack.github.io/vue-lim',
        'repository': 'git@github.com:theajack/vue-lim.git',
        'author': 'tackchen <theajack@qq.com>',
        publishConfig: {
            registry: 'https://registry.npmjs.org',
        },
    };
    if (isLimPkg) {
        pkg.unpkg = iifeName;
        pkg.jsdelivr = iifeName;
    }
    ufs.writeFile(`${tp}/package.json`, JSON.stringify(packageJson, null, 4));
}

main();