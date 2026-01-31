const { serialize } = require('cookie');

module.exports = (req, res) => {
    // Clear cookie
    res.setHeader('Set-Cookie', serialize('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(0),
        path: '/',
        sameSite: 'strict'
    }));

    res.status(200).json({ message: 'Logged out' });
};
