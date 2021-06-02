import pkg from 'mongoose';
const { Schema: _Schema, model } = pkg;
const Schema = _Schema;

let User = new Schema({
    username: {
        type: String
    },
    hashed_password: {
        type: String
    }
});


export default model('User', User);