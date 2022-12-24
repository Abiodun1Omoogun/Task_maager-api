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

