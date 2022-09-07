<template>
  <li class="trendsItems">
    <span @click="showPostsToThisTrend(trendText);">{{trendText}}</span>
    <li class="trendsCounter">
      {{trendCounter + " Tweets"}}
    </li>
  </li>
</template>

<script setup lang="ts">
import {ref} from "vue";
import router from "../../router";

const trendText = ref("");
const trendCounter = ref("");

const props = defineProps<{
  trend: any
}>()

trendText.value = props.trend[0];
trendCounter.value = props.trend[1];

function showPostsToThisTrend(trend: any) {
  router.push({path: '/home', query: {search: trend} })
}

</script>

<style scoped>
.trendsItems span {
  font-weight: 700;
  text-decoration: none;
  color: #F59E0B;
  cursor: pointer;
}
.trendsCounter {
  list-style-type: none;
  color: white;
  font-size: 12px;
  margin-bottom: 15px;
}
</style>