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

// Read, Update, and Delete operations on User profile
router.get('/users/', auth, async (req, res) => {
    res.send(req.user);
});

// Update
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
        return res.status(401).send({ error: 'Invalid updates' });
    }
    try {
        updates.forEach((update) => (req.user[update] = req.body[update]));
        await req.user.save();
        res.status(201).send(req.user);
    } catch (e) {
        res.status(404).send({
            e,
        });
    }
});

// Delete
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        sendCancelationEmail(req.user.email, req.user.name);
        res.send(req.user);
    } catch (e) {
        res.status(500).send({ e: 'Catch Error', e });
    }
});


//Adding, Deleting, and Fetching Avatar (Profile Picture), we are using for Multer package for uploading  
const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload jpg, jpeg or png image format file'));
        }
        cb(undefined, true);
    },
});

router.post(
    '/users/me/avatar',
    auth,
    upload.single('avatar'),
    async (req, res) => {
        const buffer = await sharp(req.file.buffer)
            .resize({ width: 200, height: 200 })
            .jpeg()
            .toBuffer();
        req.user.avatar = buffer;
        await req.user.save();
        res.send();
    },
    (error, req, res, next) => {
        res.status(400).send({
            error: error.message,
        });
    }
);

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
});

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            throw new Error();
        }
        res.set('Content-Type', 'image/jpg');
        res.send(user.avatar);
    } catch (e) {
        res.status(404).send();
    }
});

module.exports = router;


