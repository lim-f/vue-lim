/*
 * @Author: chenzhongsheng
 * @Date: 2024-07-12 16:03:05
 * @Description: Coding something
 */


import { transformVueSFC } from 'vue-lim-compiler';

const input = `
<script lim setup>
let i = 0;
i++;
const a = ()=>{}
const a1 = function (params:type) {
    
}
</script>
<template>
  <div>
    <div>{{ i }}</div>
    <button @click="()=>{
        i++;
    }">increase</button>
  </div>
</template>
`;

const output = transformVueSFC(input);

console.log(output);