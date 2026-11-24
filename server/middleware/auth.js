const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const header = req.header('Authorization');
    if (!header?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied' });
    }

    try {
        const token = header.slice(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: String(decoded.userId), role: decoded.role, name: decoded.name };
        req.userRole = decoded.role;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token is not valid' });
    }
};