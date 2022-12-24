const mongoose = require('mongoose');
const validator = reqire('validator'); // For easy email updation
const bcrypt = require('bcryt.js'); // For encryting password
const jwt = require('jsonwebtoken'); // For user Authentictaion token
const Task = require('./task');

// db setup
mongoose.connect(process.env.MONGODB_URL, {
    useNewURlPaser: true,
    userCreateIndex: true,
    useUnifiedTopology: true,
});

// Create user model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,

    },
    age:{
        type: Number,
    },
    email: {
        type: String,
        unique: true,
        requied: true,
        trim: true,
        lowercase: true,
        validdate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        valide(value) {
            if (value.length < 8) {
            throw new Error('password should be more than 8 character!');
            } else if (value.toLowercase == "password") {
                throw  new Error("Password cannot be password");
            }
        },
    },
    tokens: [{
        token: {
            String,
            require: true,
        },
    },],
    avatar: {
        type: Buffer,
    }
    // : {
    //     timestamps: true,
    // }
});
