<!--
 * @Author: chenzhongsheng
 * @Date: 2024-07-12 16:12:13
 * @Description: Coding something
-->
<script lim setup>
let i = 0;

const increase = () => {
    i++;
};
</script>
<template>
  <div>
    <div>{{ i }}</div>
    <button @click="increase">increase</button>
  </div>
</template>