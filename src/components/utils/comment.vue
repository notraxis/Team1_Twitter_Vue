<template>
  <div class="commentArea">
    <div class="commentInput pb-2.5">
        <input-area
          placeholder="Schreibe deine Antwort"
          button-name="Antworten"
          :rows="3"
          button-width="w-[100px]"
          input-comment
          @save="reload"
          :post-i-d="props.postID"/>
    </div>
    <div class="allComments">
      <single-comment
        v-for="(answer) in answersUser"
        v-if="answersUser.length>0"
        :answer="answer"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputArea from "./inputArea.vue";
import SingleComment from "./singleComment.vue";
import {onMounted, ref} from "vue";

const props = defineProps<{
  postID?: number
  cc: Function
}>()

const answersUser = ref([]);

const reload = async () => {
  answersUser.value = await fetch("http://localhost:8000/answersWithUser?postID=" + props.postID).then((res) => res.json());
  answersUser.value.reverse();

  props.cc();
}

onMounted(async () => {
  reload()
})

</script>

<style scoped>
.commentArea {
  padding: 10px 0;
  margin: 0 10px;
}
.commentInput {
  padding-top: 10px;
  border-top: 1px solid #C7C7C733;
}
</style>