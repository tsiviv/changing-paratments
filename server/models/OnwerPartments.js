const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./users'); // ייבוא מודל המשתמש
const Apartment = sequelize.define('Apartment', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE', // עדכון אוטומטי של ה- updatedAt בטבלת המשתמש
  },
  rooms: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  beds: { 
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  mattresses: { 
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  floor: { 
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  city: { 
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: { 
    type: DataTypes.STRING,
    allowNull: false,
  },
  notes: { 
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'apartments',
  timestamps: true,
});
Apartment.addHook('afterUpdate', async (apartment, options) => {
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




module.exports = Apartment;
