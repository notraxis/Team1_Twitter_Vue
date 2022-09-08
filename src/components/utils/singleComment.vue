<template>

  <div class="comment">
    <div class="commentUser">
      <span class="commentUserImage">
        <img
            v-if="answer.userimage"
            :src="answer.userimage"/>
      </span>
      <span class="commentUsername">
        {{ "@" + props.answer.username }}
      </span>
    </div>

    <div class="commentText" v-html="': ' + answer.text.split(' ').map(e => {
      if (e.startsWith('#')) {
        return `<span class='text-[#F59E0B]'>${e}</span>`
      } else if (e.startsWith('@')) {
        return `<span class='text-[#F59E0B]'>${e}</span>`
      } else return e
      }).join(' ')">
    </div>

    <div class="commentDate">
      {{ answerDate }}
    </div>
  </div>

</template>

<script setup lang="ts">
import {defineProps, ref} from 'vue';
import router from "../../router";

interface AnswerType {
  id: number,
  text?: string,
  date: string,
  user_id: number,
  userimage?: string,
  vorname: string,
  nachname: string,
  username: string
}

const props = defineProps<{
  answer?: AnswerType
}>()

const answerDate = ref("");

// Datum von Antwort und aktuelles Datum
const dateAnswer = new Date(props.answer.date);
const dateCurrent = new Date();
// Daten formatieren (TT.MM.JJJJ)
const dateAnswerChk = formatDate(dateAnswer);
const dateCurrentChk = formatDate(dateCurrent);

// wenn Datum ungleich -> Datum anzeigen
if(dateAnswerChk !== dateCurrentChk) {
  answerDate.value = "⏰" + dateAnswerChk;

  // wenn Datum gleich -> Uhrzeit anzeigen
} else {
  answerDate.value = "⏰" + getDateTime(dateAnswer);
}

// Datum in Uhrzeit formatieren
function getDateTime(date) {
  // Stunden
  var hours = date.getHours();
  if (hours < 10) {
    hours = '0' + hours;
  }
  // Minuten
  var minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = '0' + minutes;
  }

  // Uhrzeit zusammensetzen
  var date = hours + ':' + minutes;
  return date;
}

// Datum formatieren (TT.MM.JJJJ)
function formatDate(date) {
  //Day
  var day = date.getDate();
  if (day < 10) {
    day = '0' + day;
  }

  //Month
  var month = date.getMonth();
  month += 1;
  if (month < 10) {
    month = '0' + month;
  }

  //Full Year
  var year = date.getFullYear();
  if (year < 10) {
    year = '0' + year;
  }

  let formatted_date = day + "." + month + "." + year;
  return formatted_date;
}

// URL anpassen mit Suchbegriff (User)
function userUrlQuery(data) {
  let user = "@" + data;

  router.push({path: '/home', query: {search: user}})
}

</script>

<style scoped>
.comment {
  display: flex;
  flex-display: row;
  align-items: center;
  padding: 5px;
  border-top: 1px solid #C7C7C733;
}

.commentUser {
  display: flex;
  align-items: center;
}

.commentUsername {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.commentText {
  font-size: 14px;
}

.commentDate {
  color: rgba(255, 255, 255, 0.6);
  flex-grow: 1;
  text-align: right;
  font-size: 14px;
}

.commentUserImage img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 5px;
}
</style>