<template>
  <div class="post">
    <div class="postUser">
      <span class="postUserImage">
        <img
            v-if="post.userimage"
            :src="post.userimage"/>
      </span>
      <span class="name">{{ post.vorname + " " + post.nachname }}</span>
      <span class="username" @click="userUrlQuery(post.username)">{{ "@" + post.username }}</span>
      <span class="currentDate">{{ currentDate }}</span>
    </div>

    <div class="mt-5">
      <div class="postText" v-html="rawHtml"></div>

      <div class="postImage">
        <img
            class="max-h-lg max-w-lg"
            v-if="post.image"
            :src="post.image"/>
      </div>
    </div>

    <div class="postActions">
      <div class="postComment">
        <span
            class="cursor-pointer"
            :class="{commentOpen : commentsOpen}"
            @click="showComments">
          {{ commentBubble }}
        </span>
        <span class="ml-1">{{ commentsCount }}</span>
      </div>

      <div class="postLike">
        <span
            class="cursor-pointer"
            :class="{liked: isLiked}"
            @click="like">
          {{ heart }}
        </span>
        <span class="ml-1">{{ post.likes }}</span>
      </div>
    </div>

    <Comment
        :post-i-d="post.id"
        v-if="showComment"/>

  </div>
</template>

<script setup lang="ts">
import Comment from "./comment.vue";
import {computed, onMounted, ref} from 'vue';
import router from "../../router";

interface PostType {
  date: string,
  id: number,
  image?: string,
  likedBy: string,
  likes: number,
  nachname: string,
  text?: string,
  user_id: number,
  userimage?: string,
  username: string,
  vorname: string
}

const props = defineProps<{
  post?: PostType
}>()

const currentDate = ref("");
const commentsCount = ref("0");
const heart = ref("❤");
const commentBubble = ref("💬");
const rawHtml = ref("");
const rawHtmlComment = ref("");
const showComment = ref(false);

// Text anpassen
rawHtml.value = props.post.text.split(' ').map(e => {
  if (e.startsWith("#")) {
    return `<span class="text-[#F59E0B]">${e}</span>`
  } else if (e.startsWith('@')) {
    return `<span class="text-[#F59E0B]">${e}</span>`
  } else return e
}).join(" ");

onMounted(async () => {
  commentsCount.value = await countCommentsToPost();
})

// Datum von Post und aktuelles Datum
var datePost = new Date(props.post.date);
var dateCurrent = new Date();
// Daten formatieren (TT.MM.JJJJ)
var datePostChk = formatDate(datePost);
var dateCurrentChk = formatDate(dateCurrent);

// wenn Datum ungleich -> Datum anzeigen
if (datePostChk !== dateCurrentChk) {
  currentDate.value = "⏰" + datePostChk;
  // wenn Datum gleich -> Uhrzeit anzeigen
} else {
  currentDate.value = "⏰" + getDateTime(datePost);
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

// Anzahl Kommentare zu Posts ermitteln
async function countCommentsToPost() {
  const answers = await fetch("http://localhost:8000/answers?postID=" + props.post.id).then((res) => res.json());
  return answers.length;
}

// Liken/Entliken
async function like() {
  const storageUser = JSON.parse(localStorage.getItem('loggedInUser'));

  var likedByArr = JSON.parse(props.post.likedBy);
  let newLike;

  if (likedByArr.find(x => x === storageUser.id)) {
    // User hat bereits geliked -> Like zurücknehmen
    props.post.likes -= 1;
    likedByArr = likedByArr.filter((f) => {
      return f !== storageUser.id
    });
    props.post.likedBy = JSON.stringify(likedByArr);

    newLike = {
      userID: storageUser.id,
      postID: props.post?.id,
      like: false
    }
  } else {
    // User hat noch nicht geliked -> Like hinzufügen
    props.post.likes += 1;
    likedByArr.push(storageUser.id);
    props.post.likedBy = JSON.stringify(likedByArr);

    newLike = {
      userID: storageUser.id,
      postID: props.post?.id,
      like: true
    }
  }

  await fetch('http://localhost:8000/posts', {
    method: 'PUT',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newLike)
  })
}

// Like Symbol färben
const isLiked = computed(() => {
  const storageUser = JSON.parse(localStorage.getItem('loggedInUser'));

  const likedByArr = JSON.parse(props.post.likedBy);

  if (likedByArr.find(x => x === storageUser.id)) {
    return true;
  } else {
    return false;
  }
})

// URL anpassen mit Suchbegriff (User)
function userUrlQuery(data) {
  let user = "@" + data;

  router.push({path: '/home', query: {search: user}})
}

// Kommentarbereich einblenden
function showComments() {
  showComment.value = !showComment.value;
}

const commentsOpen = computed(() => {
  if (showComment.value === true) {
    return true;
  } else {
    return false;
  }
})

</script>

<style scoped>
.postUser {
  display: flex;
  align-items: center;
}

.postUser img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.postUser .name {
  font-weight: 700;
  margin-right: 5px;
}

.postUser .username {
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
}

.currentDate {
  color: rgba(255, 255, 255, 0.6);
  flex-grow: 1;
  text-align: right;
}

.post {
  padding: 10px;
  border-bottom: 2px solid #C7C7C733;
}

.postImage {
  display: flex;
  justify-content: center;
}

.postActions {
  display: flex;
  justify-content: flex-end;
  gap: 5px;
  margin-top: 10px;
  user-select: none;
}

.postLike:hover {
  color: red;
}

.liked {
  color: red;
}

.commentOpen {
  color: lightskyblue;
}

.postText {
  overflow-wrap: break-word;
}
</style>