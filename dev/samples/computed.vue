
<script lim setup>
let i = 1;
let i2 = i + 1;

set: i2, (v)=>{
    i = v;
}

function increase(){
    i++;
}
</script>
<template>
  <div>
    <div>{{ i }}</div>
    <div>{{ i2 }}</div>
    <button @click="increase">increase</button>
  </div>
</template>