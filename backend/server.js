import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import  mongoose from 'mongoose';
import { config as dotenv } from 'dotenv';


import {default as Todo} from './todomodel.js';
dotenv()
const app = express();

const PORT = 4000;

app.use(cors());
app.use(json());

const todoRoutes = express.Router();



async function createMongoConnectionFromEnv() {
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
        await mongoose.connect(uri, { useNewUrlParser: true,  useUnifiedTopology: true });
        return;
    } catch (e) {
        throw new Error("Couldn't connect to mongodb: " + e)
    }
}
createMongoConnectionFromEnv();

const connection = mongoose.connection
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

todoRoutes.route('/').get(function(req, res) {
    Todo.find(function(err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});

todoRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Todo.findById(id, function(err, todo) {
        res.json(todo);
    });
});

todoRoutes.route('/add').post(function(req, res) {
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({'todo': 'todo added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

todoRoutes.route('/update/:id').post(function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send("data is not found");
        else
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;

            todo.save().then(todo => {
                res.json('Todo updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

app.use('/todos', todoRoutes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});

