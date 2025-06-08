const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Adjust path as needed

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token', error: err.message });
        }
        req.user = decoded; // { id: user._id }
        req.userId = decoded.id; // { id: user._id }
        // req.user = { id: decoded.userId, isAdmin: decoded.isAdmin || false };
        // req.userId = decoded.userId; // Consistent with userId from JWT payload
        next();
    });
};

const middlewareAuthForLoggoutToo = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        req.userId = null; // No token provided, proceed without user
        return next();
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            req.userId = null; // Invalid token, proceed without user
            return next();
        }
        req.user = decoded; // { id: user._id }
        req.userId = decoded.id; // { id: user._id }
        // req.user = { id: decoded.userId, isAdmin: decoded.isAdmin || false };
        // req.userId = decoded.userId;
        next();
    });
};

const authenticateAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('isAdmin');



        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }

        req.user = { id: decoded.id, isAdmin: user.isAdmin };
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token', error: error.message });
    }
};

module.exports = { authenticateToken, middlewareAuthForLoggoutToo, authenticateAdmin };