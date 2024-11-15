const express = require('express');
const sequelize = require('./models/index');
const userRoutes = require('./routes/UserRoute'); // ייבוא המודל של משתמשים
const OnwerParmtersRoutes = require('./routes/OnwerParmtersRoutes'); // ייבוא המודל של משתמשים
const alternativePartmnetsRoutes = require('./routes/alternativePartmnetsRoutes'); // ייבוא המודל של משתמשים
require('./models/associations'); // חשוב לייבא את ההגדרות לפני הסינכרון
const path = require('path');
const cors=require('cors')
const app = express();
const session = require('express-session');
require('dotenv').config();
// הגדרת פורמט JSON בגוף הבקשות
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));

// סנכרון עם מסד הנתונים (יצירת הטבלה אם היא לא קיימת)
sequelize.sync({ force: true })
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


// יצירת משתמש חדש (לשלוח בקשה POST עם נתונים)
app.use('/api/users', userRoutes);
app.use('/api/OnwerParmters', OnwerParmtersRoutes);
app.use('/api/alternativePartmnetsRoutes', alternativePartmnetsRoutes);

// הגדרת פורט של השרת
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
