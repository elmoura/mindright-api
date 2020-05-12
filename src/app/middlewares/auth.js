const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');

module.exports = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {

        res.status(401);
        return res.json({ error: 'No token provided' });

    }

    const parts = authHeader.split(' ');

    if (!parts.length === 2) {

        res.status(401);
        return res.json({ error: 'Invalid token format' });

    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {

        res.status(401);
        return res.json({ error: 'Malformatted token' });

    }

    jwt.verify(token, authConfig.secret, (err, decoded) => {

        if (err) {
            res.status(401);
            return res.json({ error: 'Invalid token' });
        }

        req.userId = decoded.id;

        return next();

    });

}