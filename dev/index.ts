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
import { ref, watchEffect } from 'vue'

const API_URL = 'https://api.github.com/repos/vuejs/core/commits?per_page=3&sha='
const branches = ['main', 'v2-compat']

let a = ref(0)



const currentBranch = branches[0]
const commits = ref(null)

watchEffect(async () => {
  const url = \`\${API_URL}\${currentBranch}\`
  commits = await (await fetch(url)).json()
})

function truncate(v) {
  const newline = v.indexOf('\\n')
  return newline > 0 ? v.slice(0, newline) : v
}

function formatDate(v) {
  return v.replace(/T|Z/g, ' ')
}
</script>

<template>
  <h1 v-model='commits' @click='a++'>Latest Vue Core Commits</h1>
  <template v-for="branch in branches">
    <input type="radio"
      :id="branch"
      :value="branch"
      name="branch"
      v-model="currentBranch">
    <label :for="branch">{{ branch }}</label>
  </template>
  <p>vuejs/vue@{{ currentBranch }}</p>
  <ul>
    <li v-for="{ html_url, sha, author, commit } in commits">
      <a :href="html_url" target="_blank" class="commit">{{ sha.slice(0, 7) }}</a>
      - <span class="message">{{ truncate(commit.message) }}</span><br>
      by <span class="author">
        <a :href="author.html_url" target="_blank">{{ commit.author.name }}</a>
      </span>
      at <span class="date">{{ formatDate(commit.author.date) }}</span>
    </li>
  </ul>
</template>
`;

const output = transformVue(input);

console.log(output);