const bcrypt = require("bcrypt");
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('C:\\Projekte\\Team1_Twitter\\test.db');

// User ----------------------------------------------------------------------------
// Alle User ermitteln
function findAllUsers() {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM user", (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows);
            }
        });
    });
}

// User hinzufügen
function insertUser(data) {
    const saltRounds = 10;

    bcrypt.hash(data.password, saltRounds).then(function(hash) {

        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO user (vorname, nachname, username, password, userimage)
                VALUES (?, ?, ?, ?, ?)`,
                data.vorname, data.nachname, data.username, hash, data.userimage,
                (err) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                })
        })
    });
}

// Posts ---------------------------------------------------------------------------
// Alle Posts ermitteln
function findAllPosts() {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM posts", (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows);
            }
        });
    });
}

// Post hinzufügen
function insertPost(data) {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO posts (user_id, text, date, likes, image, likedBy)
                VALUES (?, ?, ?, ?, ?, ?)`,
            data.user_id, data.text, data.date, data.likes, data.image, "[]",
            (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
    })
}

// Post updaten
async function updatePost(data) {
    // Ausgewählten Post ermitteln
    const posts = await findAllPosts();
    const likedPost = posts.find(x => x.id === data.postID);

    // likedBy in Array parsen
    var likedByArr = JSON.parse(likedPost.likedBy);

    if(data.like) {
        // Neuer Like -> User-ID in Array hinzufügen
        likedByArr.unshift(data.userID);
    } else {
        // Like entfernen -> User-ID aus Array entfernen
        likedByArr = likedByArr.filter((f) => { return f !== data.userID })
    }

    // Likes = Anzahl User, die geliked haben
    var likes = likedByArr.length;
    // Array in String
    const likedByStr = JSON.stringify(likedByArr);

    // DB- Update
    return new Promise((resolve, reject) => {
        db.run(`UPDATE posts
                SET likes   = ?,
                    likedBy = ?
                WHERE id = ?`, likes, likedByStr, data.postID,
            (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
    })
}

// Posts mit Userdaten
function findPostsWithUser() {
    return new Promise((resolve, reject) => {
        db.all(`SELECT p.id, p.date, p.text, p.image, p.likedBy, p.likes,
                       p.user_id, u.userimage, u.vorname, u.nachname, u.username 
                FROM posts p 
                LEFT JOIN user u
                ON p.user_id = u.id`,
            (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows);
            }
        });
    });
}

// Trends --------------------------------------------------------------------------
// Alle Trends ermitteln
function findAllTrends() {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM trends", (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows);
            }
        });
    });
}

// Trend hinzufügen
function insertTrend(data) {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO trends (trend, date)
                VALUES (?, ?)`,
            data.trend, data.date,
            (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
    })
}

// Alte Trends löschen
function deleteTrends(trendID) {
    return new Promise((resolve, reject) => {
        db.run(`DELETE FROM trends WHERE id = ?`, trendID,
            (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
    })
}

// Answers -------------------------------------------------------------------------
// Alle Antworten ermitteln
function findAllAnswersToPost(postID) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM answers
                WHERE post_id = ?`, postID, (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows);
            }
        });
    });
}

// Antworten mit Userdaten
function findAnswersWithUser(postID) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT a.id, a.text, a.date,
                       a.user_id, u.userimage, u.vorname, u.nachname, u.username 
                FROM answers a 
                LEFT JOIN user u
                ON a.user_id = u.id
                WHERE a.post_id = ?`, postID,
            (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows);
                }
            });
    });
}

// Antwort hinzufügen
function insertAnswer(data) {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO answers (post_id, user_id, text, date)
                VALUES (?, ?, ?, ?)`,
            data.post_id, data.user_id, data.text, data.date,
            (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
    })
}

module.exports = {
    findAllUsers,
    insertUser,
    findAllPosts,
    insertPost,
    findAllTrends,
    insertTrend,
    updatePost,
    findPostsWithUser,
    deleteTrends,
    findAllAnswersToPost,
    insertAnswer,
    findAnswersWithUser
}