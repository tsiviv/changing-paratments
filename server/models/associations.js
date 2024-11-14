// models/associations.js
const User = require('./users');
const Apartment = require('./OnwerPartments');
const WantedApartment = require('./alternativePartmnets');

// קשר של משתמש אחד -> מספר דירות קיימות
User.hasMany(Apartment, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Apartment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'owner'
});

// קשר של משתמש אחד -> מספר דירות שרוצה להחליף אליהם
User.hasMany(WantedApartment, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

WantedApartment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'requester'
});
