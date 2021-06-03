import express from "express";
import { json } from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import { config as dotenv } from "dotenv";
import bcrypt from "bcryptjs";
import { default as Todo } from "./src/models/Todo.js";
import { default as User } from "./src/models/User.js";
import { default as jwt } from "jsonwebtoken";
import { createMongoConnectionFromEnv } from "./src/helpers/createMongoConnectionFromEnv.js";
import { verifyJWT } from "./src/helpers/verifyJWT.js";

dotenv();
const app = express();

const PORT = 4000;

app.use(cors());
app.use(json());

const todoRoutes = express.Router();

app.get("/isUserAuth", verifyJWT, (req, res) => {
  res.send("Successfully authenticated");
});

app.use("/login", (req, res) => {
  console.log(req.body.password);
  console.log(req.body.username);
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({ username })
    .exec()
    .then((user) => {
      console.log(user);
      bcrypt.compare(password, user.hashed_password, function (err, isMatch) {
        if (err) {
          throw err;
        } else if (isMatch) {
          const token = jwt.sign(
            {
              username,
            },
            "shhhhh",
            { expiresIn: "1h" }
          );

          res.json({ auth: true, token: token });
          console.log("Success!");
        } else {
          res.json({
            auth: false,
            message: "Wrong password and username combination!",
          });
        }
      });
    })
    .catch(() => {
      res.json({
        auth: false,
        message: "Wrong password and username combination!",
      });
      console.log("Something went wrong! Check username and password.");
    });
});

createMongoConnectionFromEnv();

const connection = mongoose.connection;
connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});
connection.on("change", (data) =>
  console.log("mongo change: " + data.toString())
);
todoRoutes.route("/").get([verifyJWT], function (req, res) {
  Todo.find(function (err, todos) {
    if (err) {
      console.log(err);
    } else {
      res.json(todos);
    }
  });
});

todoRoutes.route("/:id").get([verifyJWT], function (req, res) {
  let id = req.params.id;
  Todo.findById(id, function (err, todo) {
    res.json(todo);
  });
});

todoRoutes.route("/add").post([verifyJWT], function (req, res) {
  let todo = new Todo(req.body);
  todo
    .save()
    .then((todo) => {
      res.status(200).json({ todo: "todo added successfully" });
    })
    .catch((err) => {
      res.status(400).send("adding new todo failed");
    });
});

todoRoutes.route("/update/:id").post([verifyJWT], function (req, res) {
  Todo.findById(req.params.id, function (err, todo) {
    if (!todo) res.status(404).send("data is not found");
    else todo.todo_description = req.body.todo_description;
    todo.todo_responsible = req.body.todo_responsible;
    todo.todo_priority = req.body.todo_priority;
    todo.todo_completed = req.body.todo_completed;

    todo
      .save()
      .then((todo) => {
        res.json("Todo updated!");
      })
      .catch((err) => {
        res.status(400).send("Update not possible");
      });
  });
});

app.use("/todos", todoRoutes);

app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});
