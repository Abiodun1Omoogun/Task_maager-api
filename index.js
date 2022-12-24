const cors = require('cors')
const express = require('express');
const UserRouter = require('./router/user');
const taskRouter =- require('./routers/tasks')
const mongooseRequiried = require('./src/db/mongoose')

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`app running on port ${PORT}`);
}) 