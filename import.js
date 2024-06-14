const fs = require('fs');
const xml2js = require('xml2js');
const { MongoClient } = require('mongodb');

// Remplacez par votre URL de connexion MongoDB Atlas avec les bonnes informations d'identification
const url = "mongodb+srv://SeynaToure:nabou2000@cluster1.8yw0n1n.mongodb.net/dblp?retryWrites=true&w=majority&appName=Cluster1";

const dbName = 'dblp';

async function importData() {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        console.log("Connected to the MongoDB server");

        const db = client.db(dbName);
        const authorsCollection = db.collection('authors');

        const xml = fs.readFileSync('dblp.xml', 'utf8');
        xml2js.parseString(xml, async (err, result) => {
            if (err) {
                console.error("Error parsing XML:", err);
                return;
            }
            const authors = result.dblp.article.map(article => article.author[0]);
            const uniqueAuthors = [...new Set(authors)];  // Remove duplicates
            const authorDocuments = uniqueAuthors.map(name => ({ name }));
            try {
                await authorsCollection.insertMany(authorDocuments);
                console.log("Data imported successfully");
            } catch (e) {
                console.error("Error inserting data:", e);
            } finally {
                await client.close();
                console.log("Connection closed");
            }
        });
    } catch (e) {
        console.error("Error connecting to MongoDB:", e);
    }
}

importData().catch(console.error);
