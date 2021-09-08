const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
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
    const newsCollection = client.db("news24").collection("news");

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
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})