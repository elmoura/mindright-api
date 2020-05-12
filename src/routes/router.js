const postRoutes = require('./postsRoutes');
const express = require('express');
const app = express();

app.use('/posts', postRoutes);

module.exports = app;