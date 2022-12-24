// creta User Model
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

// Create Schema
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

// Task Model and Authentication operation
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner',
});

userSchema.static.findByCredentials = async(email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Unable to login, please check your details.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
    throw new Error('Unable to login, please recheck your details.');
    }
    return user;
};

// Authentication operation
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};


// Sending back user profile info, excluding some attributes
userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    return userObject;
};

// Hashing the password before saving
userSchema.pre("save", async function(next) {
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

// Remove all tasks of a user, if user is deleted
userSchema.pre("remove", async function(next) {
    const user = this;
    await Task.deleteMany({ owner: user._id });
    next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;

