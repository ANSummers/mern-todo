import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import { connect } from 'mongoose';
const app = express();

require('dotenv').config()

function getMongoConnectionFromEnv() {
    const username = process.env.MONGO_USERNAME;
    const password = process.env.MONGO_PASSWORD;
    const cluster = process.env.MONGO_CLUSTER;
    const db = process.env.MONGO_DB;
    if (!username || !password || !cluster || !db) {
        throw new Error("Some mongodb configs are not set.");
    }
    // opts copied from Atlas
    const opts = '?retryWrites=true&w=majority';
    const uri = `mongodb+srv://${username}:${password}@${cluster}/${db}${opts}`;

    try {
        return connect(uri, { useNewUrlParser: true});
    } catch (e) {
        throw new Error("Couldn't connect to mongodb: " + e)
    }
}

const connection = getMongoConnectionFromEnv().connection;

const PORT = 4000;

app.use(cors());
app.use(json());

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});

