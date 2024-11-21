const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./users'); // ייבוא מודל המשתמש

// יצירת המודל של דירות קיימות
const Apartment = sequelize.define('Apartment', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // שם הטבלה במודל המשתמשים
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
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
  hooks: {
    beforeUpdate: async (apartment, options) => {
      // מציאת המשתמש שמקושר לדירה
      const user = await User.findByPk(apartment.userId);
      if (user) {
        // עדכון ה-`updatedAt` של ה-User
        user.updatedAt = new Date();
        await user.save();
      }
    },
  },
});

module.exports = Apartment;
