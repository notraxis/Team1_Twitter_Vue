<template>
  <router-view/>
<!--container-->
  <div class="flex gap-0 h-screen">
<!--   navbar-->
      <navbar class="w-[15%] min-w-[200px]"/>

<!--   mainHome-->
      <main-home class="w-[70%] min-w-[550px]"/>

<!--   aside-->
      <sidebar class="w-[15%] min-w-[200px]"/>
  </div>
</template>

<script setup lang="ts">
import Sidebar from "../components/sidebar.vue";
import Navbar from "../components/navbar.vue";
import MainHome from "../components/mainHome.vue";

// HTML Titel setzen
document.title = "Team - Zuhause"

</script>

<style scoped>

</style>
