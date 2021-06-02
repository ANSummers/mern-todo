import pkg from 'mongoose';
const { Schema: _Schema, model } = pkg;
const Schema = _Schema;

let Todo = new Schema({
    todo_description: {
        type: String
    },
    todo_responsible: {
        type: String
    },
    todo_priority: {
        type: String
    },
    todo_completed: {
        type: Boolean
    },
    created_by: {
        type: String
    }
});


export default model('Todo', Todo);