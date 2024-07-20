<!--
 * @Author: chenzhongsheng
 * @Date: 2024-04-30 11:57:26
 * @Description: Coding something
-->

<p align="center">
    <img src='https://shiyix.cn/images/vue.svg' width='100px'/>
</p> 

<p align="center">
    <a href="https://www.github.com/lim-f/vue-lim/stargazers" target="_black">
        <img src="https://img.shields.io/github/stars/lim-f/vue-lim?logo=github" alt="stars" />
    </a>
    <a href="https://www.github.com/lim-f/vue-lim/network/members" target="_black">
        <img src="https://img.shields.io/github/forks/lim-f/vue-lim?logo=github" alt="forks" />
    </a>
    <a href="https://www.npmjs.com/package/vue-lim" target="_black">
        <img src="https://img.shields.io/npm/v/vue-lim?logo=npm" alt="version" />
    </a>
    <a href="https://www.npmjs.com/package/vue-lim" target="_black">
        <img src="https://img.shields.io/npm/dm/vue-lim?color=%23ffca28&logo=npm" alt="downloads" />
    </a>
    <a href="https://www.jsdelivr.com/package/npm/vue-lim" target="_black">
        <img src="https://data.jsdelivr.com/v1/package/npm/vue-lim/badge" alt="jsdelivr" />
    </a>
    <img src="https://shiyix.cn/api2/util/badge/stat?c=Visitors-vuelim" alt="visitors">
</p>

<p align="center">
    <a href="https://github.com/theajack" target="_black">
        <img src="https://img.shields.io/badge/Author-%20theajack%20-7289da.svg?&logo=github" alt="author" />
    </a>
    <a href="https://www.github.com/lim-f/vue-lim/blob/master/LICENSE" target="_black">
        <img src="https://img.shields.io/github/license/lim-f/vue-lim?color=%232DCE89&logo=github" alt="license" />
    </a>
    <a href="https://cdn.jsdelivr.net/npm/vue-lim"><img src="https://img.shields.io/bundlephobia/minzip/vue-lim.svg" alt="Size"></a>
    <a href="https://github.com/lim-f/vue-lim/search?l=javascript"><img src="https://img.shields.io/github/languages/top/lim-f/vue-lim.svg" alt="TopLang"></a>
    <a href="https://github.com/lim-f/vue-lim/issues"><img src="https://img.shields.io/github/issues-closed/lim-f/vue-lim.svg" alt="issue"></a>
    <a href="https://www.github.com/lim-f/vue-lim"><img src="https://img.shields.io/librariesio/dependent-repos/npm/vue-lim.svg" alt="Dependent"></a>
</p>

## [Vue Lim](https://github.com/lim-f/vue-lim): Make Vue easier to use. (Lim means 'Less is More')

**[Docs](https://lim-f.github.io/docs) | [Playground](https://lim-f.github.io/playground) | [React-Lim](https://github.com/lim-f/react-lim) | [中文](https://github.com/lim-f/vue-lim/blob/master/README.cn.md)**

vue-lim is a compilation tool that allows you to get rid of using the Composition API. Here's a simple example

## A Simple Sample

```html
<script setup lim>
let count = 0;
const increase = ()=>{
  count ++;
}
</script>
<template>
  <button @click="increase">count is {{ count }}</button>
</template>
```

## Quick Use

```
npm create lim
```

then choose `vue-lim`

## Install Use

```
npm i vue-lim
```

### Vite

```ts
import { defineConfig } from 'vite'
import lim from 'vue-lim/vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [lim(), vue()],
  // ...
})
```

### Rollup

```ts
import lim from 'vue-lim/rollup'
export default {
    plugins: [
        lim(),
        // Introduce vue related plug-ins by yourself
    ]
};
```

### Esbuild

```ts
import lim from 'vue-lim/esbuild'
import { build } from 'esbuild';

build({
    plugins: [
        lim(),
        // Introduce vue related plug-ins by yourself
    ],
});
```

### Webpack

```ts
module.exports = {
    module: {
        rules: [{
            test: /(\.vue)$/,
            loader: 'vue-lim/webpack',
            exclude: /node_modules/
        }]
        // Introduce vue related loaders by yourself
    }
}
```

## Other

### Compile

When using `.lim.vue` as the file suffix, lim compilation will be enabled

When using only `.vue`, you need to add `lim` attribute on script tag to enable lim compilation

```html
<script setup lim>
    // ...
</script>
```

### Compile Api

```js
import { transformVue } from 'vue-lim';
console.log(transformVue(`// some vue code`));
```

This API can be used in a web environment

```html
<script src='https://cdn.jsdelivr.net/npm/vue-lim'></script>
<script>
console.log(VueLim.transformVue(`// some vue code`));
</script>
```



