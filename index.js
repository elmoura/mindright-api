const express = require('express');
const app = express();
const router = require('./src/routes/router');
const bodyParser = require('body-parser');
require('./src/database/index');
require('dotenv/config');

//Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
require('./src/app/controllers/index')(app);
app.use(router);


app.listen(process.env.PORT, () => {
    console.log(`API listening at port ${process.env.PORT}`);
});