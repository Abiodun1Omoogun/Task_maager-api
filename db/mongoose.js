const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {
    useNewURlPaser: true,
    userCreateIndex: true,
    useUnifiedTopology: true,
});