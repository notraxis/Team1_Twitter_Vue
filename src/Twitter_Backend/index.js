const express = require('express')
const cors = require('cors')
const bcrypt = require("bcrypt");
const app = express()
const port = 8000
const {
    findAllUsers, findAllPosts, findAllTrends,
    insertUser, insertPost, insertTrend,
    updatePost, findPostsWithUser, deleteTrends,
    findAllAnswersToPost, insertAnswer, findAnswersWithUser
} = require("./db")

app.use(express.json({
    limit: 512000
}))
app.use(cors())

// User Requests ------------------------------------------------
// Get Request User
app.get('/user', (req, res) => {
    findAllUsers()
        .then((users) => res.send(users))
        .catch((error) => res.status(500).send(error))
})

// Post Request User
app.post('/user', async (req, res) => {

    await insertUser(req.body)

    findAllUsers()
        .then((users) => res.send(users))
        .catch((error) => res.status(500).send(error))

})

// Login Überprüfung POST Request
app.post('/login', async (req, res) => {
    // Bereits registriert?
    var allUsers = await findAllUsers();
    const findUser = allUsers.find(x => x.username === req.body.username);

    if(findUser) {
        // User ist registriert
        // Überprüfung Passwort
        const match = await bcrypt.compare(req.body.password, findUser.password);

        if(match) {
            // Passwort ist korrekt -> User Objekt senden
            res.send({...findUser, password: null})
        } else {
            // Passwort ist nicht korrekt
            res.status(401).send("Passwort ist nicht korrekt")
        }
    } else {
        // User ist nicht registriert
        res.status(404).send("User ist nicht registriert");
    }
})

// Posts Requests -----------------------------------------------
// Get Request Posts
app.get('/posts', (req, res) => {
    findAllPosts()
        .then((posts) => res.send(posts))
        .catch((error) => res.status(500).send(error))
})

// Post Request Posts
app.post('/posts', async (req, res) => {

    await insertPost(req.body)

    findAllPosts()
        .then((posts) => res.send(posts))
        .catch((error) => res.status(500).send(error))
})

// Put Request Posts
app.put('/posts', async (req, res) => {

    await updatePost(req.body)

    findAllPosts()
        .then((posts) => res.send(posts))
        .catch((error) => res.status(500).send(error))
})

// Get Request Posts+User
app.get('/postsWithUser', (req, res) => {
    findPostsWithUser()
        .then((postsWithUser) => res.send(postsWithUser))
        .catch((error) => res.status(500).send(error))
})

// Trends Requests ----------------------------------------------
// Get Request Trends
app.get('/trends', async (req, res) => {
    const allTrends = await findAllTrends();

    var haveToDelete = false;
    var deleteTrendsArr = [];
    var newTrendsArr = [];

    // Über alle Trends loopen
    for(let i = 0; i<allTrends.length; i++) {
        // 7 Tage Offset
        let dateOffset = (24 * 60 * 60 * 1000) * 7;

        let datePost = new Date(allTrends[i].date);
        let dateCurrent = new Date();

        // Offset von aktuellem Datum abziehen
        dateCurrent.setTime(datePost.getTime() - dateOffset);

        if(datePost < dateCurrent) {
            // Post älter als 7 Tage her -> Trend muss gelöscht werden
            deleteTrendsArr.push(allTrends[i].id);
            haveToDelete = true;
        } else {
            // Post nicht älter als 7 Tage -> in neues Array übertragen
            newTrendsArr.push({
                id: allTrends[i].id,
                trend: allTrends[i].trend,
                date: allTrends[i].date
            });
        }
    }

    // Trends löschen wenn nötig
    if(haveToDelete === true) {
        for(let i = 0; i<deleteTrendsArr.length; i++) {
            await deleteTrends(deleteTrendsArr[i]);
        }
    }

    // Aktuelle Trends senden
    res.send(newTrendsArr);
})

// Post Request Trends
app.post('/trends', async (req, res) => {

    // Mehrere Trends in einem Post -> Schleife
    for (let i = 0; i < req.body.length; i++) {
        await insertTrend(req.body[i])
    }

    const trends = await findAllTrends();
    res.send(trends)
})

// app.delete('/trends', async (req, res) => {
//
//     for(let i = 0; i<req.body.length; i++) {
//         await deleteTrends(req.body[i]);
//     }
//
// })

// Antworten Requests -------------------------------------------
// Get Request Antworten
app.get('/answers', (req, res) => {
    findAllAnswersToPost(req.query.postID)
        .then((answers) => res.send(answers))
        .catch((error) => res.status(500).send(error))
})

// Get Request Antworten+User
app.get('/answersWithUser', (req, res) => {
    findAnswersWithUser(req.query.postID)
        .then((answersWithUser) => res.send(answersWithUser))
        .catch((error) => res.status(500).send(error))
})

// Post Request Antwort
app.post('/answers', async (req, res) => {

    await insertAnswer(req.body)

    findAllAnswersToPost(req.body.post_id)
        .then((answers) => res.send(answers))
        .catch((error) => res.status(500).send(error))
})

app.listen(port, () => {
    console.log(`Port: ${port}`)
})
