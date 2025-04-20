import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    // console.log(`Token: ${token}`);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

        if (err) return res.status(403).json({ message: 'Invalid token', error: err });
        req.user = user; // { id: user._id }
        req.userId = user.id; // { id: user._id }
        next();
    });
};

export { authenticateToken };