const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
const ObjectID = require('mongodb').ObjectId;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2uohe.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const port = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log("database connected successfully!")
    const newsCollection = client.db(`${process.env.DB_NAME}`).collection("news");
    const adminCollection = client.db(`${process.env.DB_NAME}`).collection("admins");

    app.get('/', (req, res) => {
        res.send('Welcome to News24 Server!')
    })

    // add news in server
    app.post('/addNews', (req, res) => {
        const newNews = req.body;
        newsCollection.insertOne(newNews)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    // display all news from server
    app.get('/news', (req, res) => {
        newsCollection.find()
            .toArray((err, news) => {
                res.send(news)
            })
    })

    // display news details another page with dynamic route 
    app.get('/info/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        newsCollection.find({ _id: id })
            .toArray((err, news) => {
                res.send(news[0])
            })
    })

    // store new admin information to server
    app.post('/addAdmin', (req, res) => {
        const newAdmin = req.body;
        console.log('adding new admin: ', newAdmin)
        adminCollection.insertOne(newAdmin)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/admin', (req, res) => {
        adminCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, admin) => {
                res.send(admin.length > 0);
            })
    })

    app.get('/international', (req, res) => {
        newsCollection.find({international: international})
            .toArray((err, news) => {
                res.send(news)
            })
    })
});

app.listen(process.env.PORT || port)