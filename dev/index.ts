/*
 * @Author: chenzhongsheng
 * @Date: 2024-07-12 16:03:05
 * @Description: Coding something
 */


import { transformVueSFC } from 'vue-lim-compiler';

const input = `
<script lim setup>
let i = {a: 1};
let list = [1,2,3];
Object.assign(list, {});
const push = ()=>{
    // list.push(111)
    // list[0] = 3;
    // delete list[0];
    Object.assign(list, {});
}
const increase = ()=>{
    i.a++;
}
</script>
<template>
  <div>
    <div v-for="item in list"></div>
    <div>{{ i }}</div>
    <button @click="increase">increase</button>
    <button @click="push">increase</button>
  </div>
</template>
`;

const output = transformVueSFC(input);

console.log(output);