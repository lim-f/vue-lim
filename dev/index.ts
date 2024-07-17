/*
 * @Author: chenzhongsheng
 * @Date: 2024-07-12 16:03:05
 * @Description: Coding something
 */
/*
 * @Author: chenzhongsheng
 * @Date: 2024-07-12 16:03:05
 * @Description: Coding something
 */


import { transformVue } from '../src/index';

// const input = `
// <script setup lim>
// import {ref} from 'vue';

// let count = 0;
// let a = count+1

// watch(count, (...args)=>{
//   console.log(args)
// })
// </script>

// <template>
//   <button @click="count++">count is {{ count }}</button>
// </template>
// `;

const input = `
<script setup lim>
const person = {
    name: 'Jack',
    age: 18,
};
const addAge = (data) => data.age += 1;
</script>
<template>
    <div>
        <div>age = {{person.age}}</div>
        <button @click="addAge(person)">Add Age</button>
    </div>
</template>
`;

const output = transformVue(input);

console.log(output);