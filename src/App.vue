<template>
  <router-view/>
</template>

<script setup lang="ts">
import router from './router';

const loggedInUser  = localStorage.getItem('loggedInUser');
const register      = localStorage.getItem('register');

if(!loggedInUser && !register) {
  router.push('/login')
}

</script>

<style scoped>

</style>
