<template>
  <router-view/>
  <!--  header-->
  <div class="registerHeader">
    <a href="#">&lt<span class="text-[#F59E0B]">Team1</span>/&gt</a>
  </div>

  <!--  mainRegister-->
  <div class="fixed h-full w-full">
    <!--    inputRegister-->
    <div class="inputRegister">
      <input-text
          v-model="vorname"
          placeholder="Vorname"
          class="w-[40%] min-w-[250px]"
          setFocus/>

      <input-text
          v-model="nachname"
          placeholder="Nachname"
          class="w-[40%] min-w-[250px]"/>
      <input-text
          v-model="username"
          placeholder="Username"
          class="w-[40%] min-w-[250px]"/>
      <input-text
          v-model="passwort"
          placeholder="Passwort"
          class="w-[40%] min-w-[250px]"/>

      <input-file
          v-model="file"
          :name="'Profilbild auswählen'"/>
      <Button
          :name="'Registrieren'"
          class="w-[200px]"
          @click="registerUser"/>
      <Button
          :name="'Zurück zu Login'"
          class="w-[200px]"
          @click="backToLogin"/>
    </div>
  </div>

</template>

<script setup lang="ts">
import InputText from "../components/utils/inputText.vue";
import Button from "../components/utils/button.vue";
import InputFile from "../components/utils/inputFile.vue";
import router from '../router';
import {ref} from 'vue';

// HTML Titel setzen
document.title = "Team1 - Registrieren"

// Referenzen
const vorname  = ref("");
const nachname = ref("");
const username = ref("");
const passwort = ref("");
const file     = ref(null);

// Registrieren
async function registerUser() {
  // Überprüfung, ob was eingegeben wurde
  if( vorname.value === "" ) {
    alert("Bitte Vorname eingeben!")
    // vorname.value.focus();
    return;
  }else if( nachname.value === "" ) {
    alert("Bitte Nachname eingeben!")
    // nachname.focus();
    return;
  }else if( username.value === "" ) {
    alert("Bitte Username eingeben!")
    // username.focus();
    return;
  }else if( passwort.value === "" ) {
    alert("Bitte Passwort eingeben!")
    // passwort.focus();
    return;
  }

  // Username max. 12 Zeichen
  if( username.value.length > 12 ) {
    alert("Der Username darf nur maximal 12 Zeichen lang sein!")
    username.value = "";
    // username.focus();
    return;
  }

  // Überprüfung, ob Username existiert
  var checkUser = await checkUsername();

  if( checkUser === true ) {
    username.value = "";
    // username.focus();
    return;
  }

  // Überprüfung ob Profilbild angehängt wurde
  let _imageURL = null;
  if (file.value !== null) {
    _imageURL = await getBase64(file.value);
  }

  // User Daten in Objekt
  const newUser = {
    vorname: vorname.value,
    nachname: nachname.value,
    username: username.value,
    password: passwort.value,
    userimage: _imageURL
  };

  // Post Request an Server
  await fetch('http://localhost:8000/user', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newUser)
  })

  alert("Erfolgreich registriert!")

  // Zur Login Seite springen
  localStorage.removeItem('register')

  router.push('/login')

}

// Überprüfung, ob Username bereits existiert
async function checkUsername() {
  const userdata = await fetch("http://localhost:8000/user").then((res) => res.json());

  if (userdata.find((x: { username: string; }) => x.username === username.value)) {
    alert("Username existiert bereits!");
    return true;
  } else {
    return false;
  }
}

// Zurück zu Login
function backToLogin() {
  localStorage.removeItem('register');

  router.push('/login')
}

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
a {
  display: inline-block;
  text-decoration: none;
  color: white;
  cursor: pointer;
}

.registerHeader {
  display: flex;
  justify-content: center;
  font-size: 2em;
  margin-block-start: 0.67em;
  margin-block-end: 0.67em;
  font-weight: bold;
}

.inputRegister {
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 10px;
  justify-content: center;
  align-items: center;
}
</style>