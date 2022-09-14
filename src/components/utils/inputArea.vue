<template>
  <div class="mainInput">
    <!--    userImage-->
    <div class="userImage">
      <!-- User-->
      <user
          userInput
          :img-comment-input="inputComment"
      />
    </div>
    <!--    inputArea-->
    <div class="inputArea">
      <textarea
          v-model="inputText"
          class="inputTextArea"
          :class="[
              counterInput ? '!text-red-600' : '',
              inputComment ? '!font-medium' : 'font-bold'
              ]"
          :placeholder="placeholder"
          :rows="rows"
          tabindex="1"
          autofocus
          @keyup.enter="save">
      </textarea>
      <div class="secondRow">
        <input-file
            v-if="props.inputPost"
            v-model="file"
            :name="'Bild auswählen'"
            tabindex="2"/>
        <span
            id="verfuegbar"
            class="grow text-right text-xs"
            :class="inputComment ? 'text-[11px]' : 'text-xs'">
          {{ verfuegbar }}
        </span>
        <Button
            class="w-[200px]"
            :class="[
              counterInput ? '!bg-[#808080]' : '',
              buttonWidth ? buttonWidth : '',
              inputComment ? '!text-[0.75rem]' : ''
              ]"
            :name="buttonName"
            :disabled="isDisabled"
            @click="save"
            tabindex="3"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "./button.vue";
import User from "./user.vue";
import InputFile from "./inputFile.vue";
import {computed, ref} from 'vue';

const props = defineProps<{
  inputPost?: boolean,
  inputComment?: boolean,
  buttonName?: string,
  buttonWidth?: string,
  placeholder?: string,
  rows?: number,
  postID?: number,
  save?: Function
}>()

// Referenzen
const inputText = ref("");
const rows = ref(4);
const verfuegbar = ref("280/280 verfügbar");
const isDisabled = ref(false);
const buttonName = ref("Absenden");
const placeholder = ref("Was ist los?");
const file = ref(null);

// Props
if (props.placeholder) {
  placeholder.value = props.placeholder;
}
if (props.buttonName) {
  buttonName.value = props.buttonName;
}
if (props.rows) {
  rows.value = props.rows;
}

// entsprechende Speicher-Methode ausführen
function save() {
  if (props.inputPost) {
    savePost();
  }
  if (props.inputComment) {
    saveComment();
  }
}

const emit = defineEmits(['save']);

// Post speichern
async function savePost() {
  // wenn nix eingegeben -> return
  if (inputText.value.trim() === '' && file.value === null) {
    inputText.value = "";
    return;
  }

  // eingeloggten User ermitteln
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  // Zeilenumbrüche formatieren
  const text = inputText.value.replaceAll("\n", " <br> ");

  // Überprüfung ob Bild angehängt wurde
  let _imageURL = null;
  if (file.value !== null) {
    _imageURL = await getBase64(file.value);
  }

  // Objekt des neuen Posts erstellen
  const newPost = {
    user_id: loggedInUser.id,
    text: text,
    date: new Date(),
    likes: 0,
    image: _imageURL
  };

  // Post Request an Server -> Posts
  await fetch('http://localhost:8000/posts', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newPost)
  })

  // Trends setzen
  var newTrendsArr = [];

  text.split(' ').forEach(e => {
    if (e.startsWith("#")) {
      if (e.endsWith(".") || e.endsWith("!") || e.endsWith(",")) {
        e = e.substring(0, e.length - 1);
      }
      // Trend auf Server speichern
      newTrendsArr.push({
        trend: e,
        date: new Date()
      })
    }
  })

  // Post Request an Server -> Trends
  if (newTrendsArr.length !== 0) {
    await fetch('http://localhost:8000/trends', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTrendsArr)
    })
  }

  // Anzeige Beiträge aktualisieren
  location.reload();

  // Inputs zurücksetzen
  inputText.value = '';
  verfuegbar.value = "280/280 verfügbar";
}

// Kommentar speichern
async function saveComment() {
  // wenn nix eingegeben wurde -> return
  if (inputText.value.trim() === "") {
    return;
  }

  // wenn was eingegeben wurde -> Daten speichern
  const text = inputText.value.replaceAll("\n", "<br>");

  // Daten zu eingeloggtem User ermitteln
  const userStorage = JSON.parse(localStorage.getItem('loggedInUser'));

  // in Array vorne hinzufügen
  const newComment = {
    post_id: props.postID,
    user_id: userStorage.id,
    text: text,
    date: new Date(),

  }


  // Post Request an Server -> answers
  await fetch('http://localhost:8000/answers', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newComment)
  })

  // Anzeige aktualisieren
  //location.reload();

  // Inputs zurücksetzen
  inputText.value = '';
  verfuegbar.value = "280/280 verfügbar";


  emit("save")
}

// Zähler verfügbare Zeichen
const counterInput = computed(() => {
  const max = 280;

  verfuegbar.value = "/280 verfügbar";

  const diff = max - inputText.value.length;

  verfuegbar.value = diff + verfuegbar.value;

  // zu viele Zeichen -> Text rot färben / Button ausgrauen
  // todo
  if (diff < 0) {
    isDisabled.value = true;
    return true;
  } else {
    isDisabled.value = false;
    return false;
  }
})

// Bild in Base64 String konvertieren
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

</script>

<style scoped>
.mainInput {
  display: flex;
  flex-direction: row;
}

.inputArea {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
}

.secondRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.inputTextArea {
  color: white;
  background: #C5C5C51A;
  border-radius: 10px;
  font-weight: 700;
  resize: none;
  padding: 10px;
  border: none;
  font-family: 'Inter', sans-serif;
}
</style>