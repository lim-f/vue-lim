<!--
 * @Author: chenzhongsheng
 * @Date: 2024-04-30 11:57:26
 * @Description: Coding something
-->


## [Vue Lim](https://github.com/lim-f/vue-lim)

<div align='center'>
    <img width='100' src='https://shiyix.cn/images/vue.svg'/>
    
### 让 Vue 使用起来更简单.

Lim 的含义是 'Less is More

**[文档](https://lim-f.github.io/docs-cn) | [在线体验](https://lim-f.github.io/playground) | [React-Lim](https://github.com/lim-f/react-lim) | [English](https://github.com/lim-f/vue-lim)**

</div>

vue-lim 是一个编译工具，让你可以摆脱使用Composition API。以下是一个简单的例子

## [简单的例子](https://lim-f.github.io/playground)

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

## 快速开始

```
npm create lim
```

然后选择 `vue-lim`

## 安装使用

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
        // 自行引入其他vue
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
        // 自行引入其他vue相关插件
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
        // 自行引入其他vue相关loader
    }
}
```

## 其他

### 编译

当使用 `.lim.vue` 作为文件后缀时会开启 lim 的编译

当使用仅 `.vue` 作为后缀, 你需要添加 `lim` 属性到 script 标签来开启 lim 的编译

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



