<template>
  <aside class="relative">
    <div class="asideWrapper">
      <!--    Trends Header-->
      <div class="font-bold text-2xl pt-2.5">
        <Input
            class="w-full mb-5"
            :placeholder="'Suche...'"
            v-model="text"
            @keyup.enter="search()"/>
        Trends
      </div>
      <!--    Trends Liste-->
      <div class="trends">
        <ul class="list-none p-0">
          <trend-list-item
              v-for="(trend) in newTrendsArr"
              v-if="newTrendsArr.length>0"
              :trend="trend"/>
        </ul>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import Input from "./utils/inputText.vue";
import TrendListItem from "./utils/trendListItem.vue";
import {onMounted, ref} from "vue";
import router from '../router';

const newTrendsArr = ref([]);
const text = ref("");

onMounted(async () => {
  // Trends ermitteln und Trends älter als 1 Woche löschen
  let allTrendsArr = await fetch("http://10.11.45.177:8000/trends").then((res) => res.json());

  var trendsArr = [];

  // Trends ohne Zeit in Array
  for (let i = 0; i < allTrendsArr.length; i++) {
    trendsArr.push(allTrendsArr[i].trend);
  }

  var objUniqueTrends = filterTrends(trendsArr);
  var arrUniqueTrends = Object.entries(objUniqueTrends);

  // Trends nach Häufigkeit sortieren
  arrUniqueTrends.sort(function (a, b) {
    return a[1] - b[1];
  });
  arrUniqueTrends.reverse();

  newTrendsArr.value = arrUniqueTrends;
})

// Trends filtern und zählen
function filterTrends(data) {
  return data.reduce((result, current) => {
    if (!result[current]) {
      result[current] = 1;
    } else {
      result[current] += 1;
    }
    return result;
  }, {})
}

// Suchfunktion
async function search() {
  const postdata = await fetch("http://10.11.45.177:8000/postsWithUser").then((res) => res.json());
  postdata.reverse();

  let postFound = false;

  // Überprüfung, ob Suche nach Username
  if(text.value.charAt(0) === "@") {
    searchUser(text.value, postdata);
    return;
  }

  // Überprüfung, ob es passende Beiträge gibt
  for(let i=0; i<postdata.length; i++) {

    const textArr = postdata[i].text.toLowerCase().split(" ");
    const textLow = text.value.toLowerCase();

    for(let i=0; i<textArr.length; i++) {
      if(textLow === textArr[i]) {
        postFound = true;
      }
    }
  }

  // Kein Beitrag gefunden -> alert
  if(postFound === false) {
    alert("Kein Beitrag mit '" + text.value + "' gefunden!")
    text.value = "";
    // gefundene Beiträge anzeigen
  } else {
    // Suche in Query schreiben
    router.push({path: '/home', query: {search: text.value} })
  }

}

// Beiträge zu User suchen
async function searchUser(input, postData) {
  // Wenn Posts nicht übergeben -> Posts ermitteln
  let postdata;
  if (!postData) {
    postdata = await fetch("http://10.11.45.177:8000/postsWithUser").then((res) => res.json());
    postdata.reverse();
  } else {
    postdata = postData;
  }

  // Wenn Suche über Suchfeld, dann diese Eingabe nehmen
  if (text.value) {
    input = text.value;

    // Suche über angeklickten Username
  } else {
    // Username in Suchfeld schreiben
    text.value = input;
  }

  // Userdaten ermitteln
  const userdata = await fetch("http://10.11.45.177:8000/user").then((res) => res.json());

  let postFound = false;

  // Überprüfung, ob es Beiträge zu User gibt
  for (let i = 0; i < postdata.length; i++) {
    // Username zu Post
    let postUser = userdata.find(x => x.id === postdata[i].user_id);
    if (input.includes(postUser.username)) {
      postFound = true;
    }
  }

  // Kein Beitrag gefunden -> alert
  if (postFound === false) {
    alert("Kein Beitrag zu User '" + input + "' gefunden!");

    text.value = '';

    // gefundene Beiträge anzeigen
  } else {
    // Suche in Query schreiben
    router.push({path: '/home', query: {search: text.value} })
  }

}

</script>

<style scoped>
.asideWrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: fixed;
  border-left: 1px solid #C7C7C733;
  padding: 10px;
}
</style>