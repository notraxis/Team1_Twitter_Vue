<template>
  <div class="flex flex-col">
    <Post
        v-for="(post) in postUser"
        v-if="postUser.length>0"
        :post="post"/>
  </div>
</template>

<script setup lang="ts">
import Post from "../components/utils/post.vue";
import {onMounted, ref, watch} from "vue";
import {useRoute} from 'vue-router'

const postUser = ref([]);
var posts = [];

const route = useRoute();

// Reload bei URL Änderung
watch(
    () => route.query.search,
    async () => {
      location.reload();
    }
)

onMounted(async () => {
  postUser.value = await fetch("http://10.11.45.177:8000/postsWithUser").then((res) => res.json());
  postUser.value.reverse();

  const search = route.query.search as string;

  // Suche -> gesuchte Posts ermitteln
  if (search) {
    // Suche User?
    if (search.charAt(0) === "@") {
      // Beiträge zu User ermitteln
      for (let i = 0; i < postUser.value.length; i++) {
        if (search.includes(postUser.value[i].username)) {
          posts.push(postUser.value[i]);
        }
      }
      // ermittelte Posts übergeben
      postUser.value = posts;
      return;
    }
    // Beiträge zu Text ermitteln
    for (var i = 0; i < postUser.value.length; i++) {

      const textArr = postUser.value[i].text.toLowerCase().split(" ");
      const textLow = search.toLowerCase();

      for(let ix=0; ix<textArr.length; ix++) {
        if(textLow === textArr[ix]) {
          posts.push(postUser.value[i]);
        }
      }
    }
    postUser.value = posts;
  }
})

</script>

<style scoped>

</style>