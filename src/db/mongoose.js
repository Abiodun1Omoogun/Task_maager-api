const mongoose = require('mongoose');

// db setup
mongoose.connect(process.env.MONGODB_URL, {
    useNewURlPaser: true,
    userCreateIndex: true,
    useUnifiedTopology: true,
});
