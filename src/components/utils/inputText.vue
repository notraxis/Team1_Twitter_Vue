<template>
  <input
      type="text"
      class="py-2 px-[15px] rounded-[10px] bg-[#C5C5C51A] border-none text-white"
      :value="modelValue"
      @input="updateValue"
      ref="inputText">
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';

const inputText = ref<HTMLElement>();

const props = defineProps<{
  modelValue?: string
  setFocus?: boolean
}>()

onMounted(() => {
  if(props.setFocus && inputText.value !== undefined) {
    inputText.value.focus();
  }
})

const emit = defineEmits(['update:modelValue']);

function updateValue(event: Event) {
  const target = <HTMLInputElement>event.target;
  emit('update:modelValue', target.value);
}

</script>

<style scoped>

</style>