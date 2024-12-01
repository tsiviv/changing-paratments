const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./users'); // ייבוא מודל המשתמש

const WantedApartment = sequelize.define('WantedApartment', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // הקשר עם טבלת המשתמשים
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE', // עדכון אוטומטי בטבלה של המשתמש כאשר יש עדכון בטבלה הזו
  },
  numberOfRooms: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  numberOfBeds: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  area: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  preferredSwapDate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'wanted_apartments',
  timestamps: true, // מאפשר עדכון אוטומטי של תאריך יצירה ועריכה
});

WantedApartment.addHook('afterUpdate', async (apartment, options) => {
  console.log("Hook triggered before update");

  // מציאת המשתמש שקשור לדירה
  const user = await User.findByPk(apartment.userId);

  if (user) {
    // הגדלת מספר השינויים
    user.changeCount += 1; 

    try {
      // שמירה של המודל לאחר הגדלת ה-`changeCount`
      await user.save(); // אין צורך בשדה `updatedAt` - הוא יתעדכן אוטומטית
      console.log("User change count updated:", user.changeCount);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }
});

module.exports =WantedApartment 