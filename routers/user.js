const express = require('express');
const sherp = require('sharp');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account');
const User = require('../src/db/mongoose');


// Create new User
router.post('/users', async (req, res) => {
    const User = new User(req.body);
    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(200).send(user, token);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Sign in  User Routes
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(
            req.body.email,
            req.body.password
        );
        const token = await user.generateAuthToken();
        res.send({
            user,
            token,
        });
    } catch (e) {
        res.status(400).send({
            error: 'Catch error',
            e,
        });
    }
});

// sign Out User Routes
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.status(200).send();
    } catch (e) {
        res.status(500).send();
    }
});

// sign Out all User Routes
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send();
    } catch (e) {
        res.status(500).send();
    }
});


