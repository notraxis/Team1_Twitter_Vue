<template>
  <main class="grow">
    <!--  header-->
    <div class="border-x-0 border-t-0 border-b-[1px]  border-solid border-[#C7C7C733]">
      <span class="block pl-2.5 font-bold text-2xl my-[0.83em]">Zuhause</span>
    </div>
    <!--    input-->
    <div class="p-2.5 border-0 border-b-2 border-[#C7C7C733] border-solid">
      <main-input inputPost/>
    </div>
    <!--    feed-->
    <main-feed/>
  </main>
</template>

<script setup lang="ts">
import MainInput from "./utils/inputArea.vue";
import MainFeed from "./mainFeed.vue";
</script>

<style scoped>

</style>