const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.get('/', (req, res) => {

    return res.json({ success: 'yeeeeeee', id: req.userId });

});

module.exports = app => app.use('/app', router);