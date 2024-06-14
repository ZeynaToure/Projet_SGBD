const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const url = "mongodb+srv://SeynaToure:nabou2000@cluster1.8yw0n1n.mongodb.net/dblp?retryWrites=true&w=majority&appName=Cluster1";
const dbName = 'dblp';

let db;
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    if (err) {
        console.error('Failed to connect to MongoDB', err);
        return;
    }
    db = client.db(dbName);
    console.log("Connected to MongoDB");
});

// Middleware pour servir les fichiers statiques depuis le répertoire racine
app.use(express.static(path.join(__dirname)));

// Route pour récupérer la liste des auteurs
app.get('/authors', async (req, res) => {
    try {
        const authorsCollection = db.collection('authors');
        const authors = await authorsCollection.find({}).toArray();
        res.json(authors);
    } catch (e) {
        console.error('Error fetching authors', e);
        res.status(500).send('Internal Server Error');
    }
});

// Route principale pour servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
