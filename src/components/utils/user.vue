<template>
  <!--    navUser-->
  <div class="flex flex-col text-[18px] font-bold">
    <!--      navUserImage-->
    <div class="flex flex-row items-center"
      :class="imgNavbar ? 'mb-[5px]' : ''">
      <!--        loggedInUserImage-->
      <span>
          <img
              class="loggedInUserImage"
              :class="[
                  imgNavbar ? 'w-[50px] h-[50px]' : 'w-[60px] h-[60px]',
                  imgCommentInput ? 'w-[40px] h-[40px]' : 'w-[60px] h-[60px]',
                  imgComment ? 'w-[30px] h-[30px] !mr-[5px]' : 'w-[60px] h-[60px]'
                  ]"
              v-if="loggedInUser.userimage"
              :src="loggedInUser.userimage"
              ref="loggedInUserImage"
              @click="easterEgg"/>
      </span>
      <!--        navUserName-->
      <div v-if="props.userNavbar" class="flex flex-col">
        <!--          loggedInUser-->
        <span class="text-[#F59E0B]">{{name}}</span>
        <!--          loggedInUsername-->
        <span class="loggedInUsername">{{"@" + username}}</span>
      </div>
    </div>
    <!--      buttonLogout-->
    <Button
        v-if="props.userNavbar"
        class="buttonLogout"
        :name="'Logout'"
        @click="logout"/>
  </div>
</template>

<script setup lang="ts">
import Button from "./button.vue";
import router from '../../router';
import {ref} from 'vue';

const props = defineProps<{
  userNavbar?: boolean,
  userInput?: boolean,
  userPost?: boolean,
  userComment?: boolean,
  imgNavbar?: boolean,
  imgCommentInput?: boolean,
  imgComment?: boolean,
  userimage?: string
}>()

// eingeloggten User setzen
const loggedInUser  = JSON.parse(localStorage.getItem('loggedInUser'));
const name          = ref("");
const username      = ref("");
const loggedInUserImage = ref("");
name.value          = loggedInUser.vorname + " " + loggedInUser.nachname
username.value      = loggedInUser.username

// Logout
function logout() {
  // Eingeloggten User aus LocalStorage entfernen
  localStorage.removeItem('loggedInUser')

  // zurück zu Login-Seite
  router.push('/login')
}

// Easter Egg
function easterEgg() {
  if(props.imgComment || props.imgNavbar) {return}

  const imageSpinning = [
    {transform: 'rotate(0) scale(1)'},
    {transform: 'rotate(360deg) scale(1)'}
  ]

  const imageTiming = {
    duration: 1500,
    iterations: 1,
  }
  loggedInUserImage.value.animate(imageSpinning, imageTiming);
}

</script>

<style scoped>
.loggedInUsername {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 10px;
}

.loggedInUserImage {
  border-radius: 50%;
  margin-right: 10px;
}

.buttonLogout {
  background: #C5C5C51A;
  border: 1px solid #F59E0B;
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  font-weight: 500;
}
</style>