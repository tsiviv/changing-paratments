const express = require('express');
const sequelize = require('./models/index');
const userRoutes = require('./routes/UserRoute'); // ייבוא המודל של משתמשים
const OnwerParmtersRoutes = require('./routes/OnwerParmtersRoutes'); // ייבוא המודל של משתמשים
const alternativePartmnetsRoutes = require('./routes/alternativePartmnetsRoutes'); // ייבוא המודל של משתמשים
require('./models/associations'); // חשוב לייבא את ההגדרות לפני הסינכרון

const app = express();

// הגדרת פורמט JSON בגוף הבקשות
app.use(express.json());

// סנכרון עם מסד הנתונים (יצירת הטבלה אם היא לא קיימת)
sequelize.sync({ force: false })
  .then(() => {
    console.log('User table synced!');
  })
  .catch((err) => {
    console.error('Error syncing table:', err);
  });

// יצירת מסלול (route) בסיסי
app.get('/', (req, res) => {
  res.send('Hello World');
});

// יצירת משתמש חדש (לשלוח בקשה POST עם נתונים)
app.use('/api/users', userRoutes);
app.use('/api/OnwerParmters', OnwerParmtersRoutes);
app.use('/api/alternativePartmnetsRoutes', alternativePartmnetsRoutes);

// הגדרת פורט של השרת
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
