<template>
  <router-view/>
  <!--  header-->
  <div class="loginHeader">
    <a href="">&lt<span class="text-[#F59E0B]">Team1</span>/&gt</a>
  </div>
  <!--  mainLogin-->
  <div class="fixed h-full w-full">
    <!--    inputLogin-->
    <div class="inputLogin">
      <input-text
          v-model="username"
          :placeholder="'Username'"
          class="w-[40%] min-w-[250px]"
          setFocus/>

      <input type="password"
             v-model="passwort"
             class="w-[40%] min-w-[250px] py-2 px-[15px] rounded-[10px] bg-[#C5C5C51A] border-none text-white"
             placeholder="Passwort"
             @keyup.enter="login">

      <Button
          :name="'Login'"
          class="w-[200px]"
          @click="login"/>
      <Button
          :name="'Registrieren'"
          class="w-[200px]"
          @click="register"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputText from "../components/utils/inputText.vue";
import Button from "../components/utils/button.vue";
import router from '../router';
import {ref} from 'vue';

// HTML Titel setzen
document.title = "Team1 - Login"

// Referenzen
const username = ref("");
const passwort = ref("");

// Login
async function login() {
  // Es muss ein Name eingegeben sein
  if (username.value === '') {
    alert("Sie müssen einen Namen eingeben!")
    // username.focus();
    return;
  } else if (passwort.value === "") {
    alert("Sie müssen Ihr Passwort eingeben!")
    // passwort.focus();
    return;
  }

  const loginUser = {
    username: username.value,
    password: passwort.value
  }

  // Login Route - Login Überprüfung
  const checkedUser = await fetch('http://localhost:8000/login', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginUser)
  })

  if (checkedUser.status === 404) {
    // User nicht registriert
    alert("User existiert nicht! Bitte registrieren!");
    username.value = "";
    passwort.value = "";
    router.push('/login');
    return;
  } else if (checkedUser.status === 401) {
    // Passwort falsch
    alert("Passwort nicht korrekt!")
    passwort.value = "";
    return;
  }

  // User Objekt in Local Storage speichern
  const checkedUserBody = await checkedUser.json();
  localStorage.setItem('loggedInUser', JSON.stringify(checkedUserBody));

  // zu Home Seite springen
  router.push('/home');
}

// Registrieren
function register() {
  localStorage.setItem('register', "X")

  router.push('/register')
}

</script>

<style scoped>
a {
  display: inline-block;
  text-decoration: none;
  color: white;
  cursor: pointer;
}

.loginHeader {
  display: flex;
  justify-content: center;
  font-size: 2em;
  margin-block-start: 0.67em;
  margin-block-end: 0.67em;
  font-weight: bold;
}

.inputLogin {
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 10px;
  justify-content: center;
  align-items: center;
}
</style>