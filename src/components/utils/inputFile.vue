<template>
  <label
      id="inputImageLabel"
      for="inputImage">

    <span>
      {{ span }}
    </span>

    <input
        type="file"
        accept="image/png, image/jpeg"
        id="inputImage"
        ref="file"
        @change="onChangeFileUpload">
  </label>
</template>

<script setup lang="ts">
import {ref} from 'vue'

// Referenzen
const span = ref("");
const file = ref();

const props = defineProps<{
  name: string,
  modelValue?: File
}>()

// Bild-Upload stylen
span.value = props.name;

const emit = defineEmits(['update:modelValue']);

// Wenn Bild hochgeladen wurde
function onChangeFileUpload() {
  if (file.value) {
    // Text des Labels ändern
    span.value = file.value.files[0].name + " ausgewählt"

    // File herausgeben
    emit('update:modelValue', file.value.files[0]);
  }
}

</script>

<style scoped>
input[type="file"] {
  opacity: 0;
  z-index: -1;
  position: absolute;
  top: -1px;
  left: 0;
  width: 0.1px;
  height: 0.1px;
  user-select: none;
}

label[for="inputImage"] {
  background: #F59E0B;
  padding: 8px 15px;
  color: black;
  font-family: sans-serif;
  border: 0;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  min-width: 200px;
  text-align: center;
}

label[for="inputImage"]:hover {
  transform: scale(1.05);
}
</style>