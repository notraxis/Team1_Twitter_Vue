<template>
  <main class="grow">
    <!--  header-->
    <div class="border-x-0 border-t-0 border-b-[1px]  border-solid border-[#C7C7C733]">
      <span class="block pl-2.5 font-bold text-2xl my-[0.83em]">{{title}}</span>
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
import {ref, watch} from "vue";
import {useRoute} from 'vue-router'

const title = ref("Zuhause");
const route = useRoute();

watch(
    () => route.query.search,
    async () => {
      if(route.query.search) {
        title.value = "Suche: " + route.query.search;
      }
    }
)

</script>

<style scoped>

</style>