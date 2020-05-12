const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');


function generateToken(params = {}) {

    const token = jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
    });

    return token;

}

router.post('/register', async(req, res) => {

    try {

        const { email } = req.body;

        if (!email) {
            res.status(400);
            return res.json({ error: 'Please inform the user e-mail' });
        }

        if (await User.findOne({ email })) {

            res.status(400);
            return res.json({ error: 'User already exists!' });

        }

        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({
            user,
            token: generateToken({ id: user.id })
        });


    } catch (error) {

        res.status(400);
        res.json({ error: error.stack || error.message });

    }

});

router.post('/authenticate', async(req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        res.json({ error: 'Please inform the user e-mail and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {

        res.status(400);
        res.json({ error: 'User not found' });

    }

    if (!await bcrypt.compare(password, user.password)) {

        res.status(400);
        return res.json({ error: 'Invalid password' });

    }

    user.password = undefined;

    return res.send({
        user,
        token: generateToken({ id: user.id })
    });

});

router.post('/forgot_password', async(req, res) => {

    const { email } = req.body;
    console.log(email)
    try {

        const user = await User.findOne({ email });

        if (!user) {
            res.status(400);
            return res.json({ error: 'User not found' });
        }

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now
            }
        });

        mailer.sendMail({
            'to': email,
            'from': 'mourasb.gabriel@gmail.com',
            'subject': 'Password recovery',
            'template': '../../resource/mail/auth/forgotPassword',
            'context': { token }
        }, err => {

            if (err) {
                res.status(400);
                res.json({
                    message: 'Cannot send password recovery e-mail',
                    error: err.stack || err.message,
                });
            }

            res.send({ message: 'Password recovery e-mail sent successfully' });
        });

    } catch (error) {

        res.status(400);
        return res.json({ error: error.stack || error.message });

    }
});

router.post('/reset_password', async(req, res) => {

    const { email, token, password } = req.body;

    if (!email || !token || !password) {
        res.status(400);
        return res.json({ error: 'Please inform the user e-mail, token and password' });
    };

    try {

        const user = User.findOne({ email })
            .select('+passwordResetToken passwordResetExpires');

        if (!user) {
            res.status(400);
            return res.json({ error: 'User not found' });
        }

        if (token !== user.passwordResetToken) {
            res.status(400);
            return res.json({ error: 'Informed token does not match with the user password reset token.' });
        }

        const now = new Date();

        if (now > user.passwordResetExpires) {
            res.status(400);
            return res.json({ error: 'Expired token. Please generate a new one.' });
        }

        user.password = password;

        await user.save();

        return res.json({ message: 'Your password was reseted successfully' });

    } catch (error) {
        res.status(400);
        res.json({ error: error.stack || error.message });
    }

});


module.exports = app => app.use('/auth', router);