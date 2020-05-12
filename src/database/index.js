require('dotenv/config');
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, () => {
    console.log('connected to DB')
});

mongoose.Promise = global.Promise;

module.exports = mongoose;