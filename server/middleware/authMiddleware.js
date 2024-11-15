const jwt = require('jsonwebtoken');
const fs =require('fs')
const verifyToken = (req, res, next) => {
    // קח את הטוקן מכותרת ה-Authorization
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1]; // חתוך את המילה "Bearer" מהכותרת

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    const publicKey = fs.readFileSync(path.join(__dirname, '../public.key'), 'utf8');

    // אימות הטוקן
    jwt.verify(token, publicKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.user = decoded; // אתה יכול להוסיף את המידע המפוענח של המשתמש ב-req.user
        next(); // המשך למידול הבא
    });
};
module.exports = { verifyToken };
