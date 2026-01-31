const connectToDatabase = require('./db');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String }
}));

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { token } = req.cookies || {};
        // Note: Vercel serverless functions might not parse cookies by default in req.cookies without middleware,
        // but the 'cookie' package can parse req.headers.cookie.
        // Let's manually parse for safety in this environment.

        const cookieHeader = req.headers.cookie;
        let authToken = null;

        if (cookieHeader) {
            const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
                const [key, value] = cookie.trim().split('=');
                acc[key] = value;
                return acc;
            }, {});
            authToken = cookies.token;
        }

        if (!authToken) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        let decoded;
        try {
            decoded = jwt.verify(authToken, JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        await connectToDatabase();
        const user = await User.findById(decoded.userId).select('-password'); // Exclude password

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('User fetch error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
