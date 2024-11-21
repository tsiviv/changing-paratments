const User = require('./users'); // וודא שהמודל נקרא 'users'
const Apartment = require('./OnwerPartments'); // שים לב לאיות הנכון של שם הקובץ והמודל
const WantedApartment = require('./alternativePartmnets'); // שים לב לאיות הנכון של שם הקובץ והמודל

// קשר של משתמש -> דירות קיימות
User.hasMany(Apartment, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  as: 'Apartments', // Alias מעודכן
});

Apartment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'owner',
});

// קשר של משתמש -> דירות שהוא רוצה
User.hasMany(WantedApartment, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  as: 'WantedApartments', // Alias מעודכן
});

WantedApartment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'requester',
});
