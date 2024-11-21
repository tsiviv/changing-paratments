const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./users'); // ייבוא מודל המשתמש

// יצירת המודל של דירות רצויות להחלפה
const WantedApartment = sequelize.define('WantedApartment', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
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
  timestamps: true,
  hooks: {
    afterUpdate: async (wantedApartment, options) => {
      // מציאת המשתמש שמקושר לדירה הרצויה להחלפה
      const user = await User.findByPk(wantedApartment.userId);
      if (user) {
        // עדכון ה-`updatedAt` של ה-User
        user.updatedAt = new Date();
        await user.save();
      }
    },
  },
});

module.exports = WantedApartment;
