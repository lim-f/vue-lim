<!--
 * @Author: chenzhongsheng
 * @Date: 2024-04-30 11:57:26
 * @Description: Coding something
-->
## [Vue Lim](https://github.com/lim-f/vue-lim)

Make Vue easier to use. (Lim means 'Less is More')

**[Playground](https://lim-f.github.io/playground) | [React-Lim](https://github.com/lim-f/react-lim) | [中文](https://github.com/lim-f/vue-lim/blob/master/README.cn.md)**


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

### 编译Api

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



