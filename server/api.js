const express = require('express');
require('dotenv').config();
const sequelize = require('./models/index');
const userRoutes = require('./routes/UserRoute');
const OnwerParmtersRoutes = require('./routes/OnwerParmtersRoutes');
const alternativePartmnetsRoutes = require('./routes/alternativePartmnetsRoutes');
require('./models/associations');
const MessageRoutes = require('./routes/MessageRouter')
const path = require('path');
const cors = require('cors');
const app = express();
const session = require('express-session');
const multer = require('multer');

app.use(express.static(path.join(__dirname, '../react-project/build')));
app.use(express.static(path.join(__dirname, '../react-project/public')));

// הגדרת פורמט JSON בגוף הבקשות
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:4200'],
  credentials: true
}));

// סנכרון עם מסד הנתונים (יצירת הטבלה אם היא לא קיימת)
sequelize.sync({ alter: true })
  .then(() => {
    console.log('User table synced!');
  })
  .catch((err) => {
    console.error('Error syncing table:', err);
  });

// יצירת מסלול (route) בסיסי
const sessionConfig = {
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
  saveUninitialized: true,
  resave: true,
  secret: 'hachiku1'
};
app.use(session(sessionConfig));



// הגדרת אחסון הקבצים
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../react-project/public', 'uploads'));
  },
  filename: (req, file, cb) => {
    console.log(file.originalname)
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ניהול בקשת POST להעלאת קובץ
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('לא נבחר קובץ.');
  }
  res.status(200).send('הקובץ הועלה בהצלחה.');
});

// יצירת משתמש חדש (לשלוח בקשה POST עם נתונים)
app.use('/api/users', userRoutes);
app.use('/api/OnwerParmters', OnwerParmtersRoutes);
app.use('/api/alternativePartmnetsRoutes', alternativePartmnetsRoutes);
app.use('/api/MessageRoutes', MessageRoutes);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../react-project/build', 'index.html'));
});

// הגדרת פורט של השרת
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
