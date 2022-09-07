<template>
    <button
        type="button"
        class="button">
      {{props.name}}
    </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  name?: String;
}>()

</script>

<style scoped>
.button {
  background: #F59E0B;
  padding: 8px 15px;
  color: black;
  font-family: sans-serif;
  border: 0;
  border-radius: 10px;
  font-size: 1rem;
  text-align: center;
}
.button:hover {
  cursor: pointer;
  transform: scale(1.05);
}
</style>