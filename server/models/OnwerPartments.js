const { DataTypes } = require('sequelize');
const sequelize = require('./index');  // חיבור למסד הנתונים

// יצירת המודל של דירות
const Apartment = sequelize.define('Apartment', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',  // קשר לטבלת המשתמשים
      key: 'id',
    },
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  district: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rooms: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  size: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  floor: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalFloors: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  availableFrom: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  leaseTerm: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  hasParking: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  hasBalcony: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  hasElevator: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  tableName: 'apartments', // שם הטבלה במסד הנתונים
  timestamps: true,        // אם תרצה לכלול תאריכי יצירה ועדכון אוטומטיים
});

module.exports = Apartment;
