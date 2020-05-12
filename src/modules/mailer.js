const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const expressHandlebars = require('express-handlebars');


const { host, port, user, pass } = require('../config/mail.json');

const transport = nodemailer.createTransport({
    host,
    port,
    auth: { user, pass }
});

transport.use('compile', hbs({
    viewEngine: expressHandlebars.create({
        layoutsDir: path.resolve('./src/resource/mail'),
        partialsDir: path.resolve('./src/resource/mail'),
        defaultLayout: './auth/forgotPassword',
        extname: '.html',
    }),
    viewPath: path.resolve('./src/resources/mail'),
    extName: '.html'
}))

module.exports = transport;