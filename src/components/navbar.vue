<template>
  <nav class="relative">
    <!--navWrapper-->
    <div class="navWrapper">
      <!--    navBar-->
      <div class="text-xl font-bold">
        <!--      navLogo-->
        <div class="text-2xl pt-2.5">
          &lt
          <span
              class="text-[#F59E0B] cursor-pointer"
              @click="routeToHome">
            Team1
          </span>
          /&gt
        </div>
        <ul class="list-none p-0">
          <li class="mb-5 cursor-pointer" @click="routeToHome">🏡Zuhause</li>
          <li class="mb-5 cursor-pointer">Trends</li>
          <li class="mb-5 cursor-pointer">Neuigkeiten</li>
        </ul>
      </div>

      <!--    Anzeige eingeloggter User-->
      <user userNavbar imgNavbar/>
    </div>
  </nav>
</template>

<script setup lang="ts">
import User from "./utils/user.vue";
import router from '../router';

function routeToHome() {
  router.push('/home');
}

</script>

<style scoped>
.navWrapper {
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
  height: 100%;
  width: 15%;
  min-width: 200px;
  border-right: 1px solid #C7C7C733;
}
a {
  display: inline-block;
  text-decoration: none;
  color: white;
  cursor: pointer;
}
</style>