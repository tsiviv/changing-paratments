const WantedApartment = require('../models/alternativePartmnets');

// קבלת כל הדירות שהמשתמשים מעוניינים בהם
exports.getAllWantedApartments = async (req, res) => {
  try {
    const apartments = await WantedApartment.findAll({ include: 'requester' });
    res.status(200).json(apartments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching wanted apartments' });
  }
};
exports.getWantedApartmentById = async (req, res) => {
    try {
      const wantedApartment = await WantedApartment.findByPk(req.params.id);
      if (!wantedApartment) {
        return res.status(404).json({ message: 'Wanted apartment not found' });
      }
      res.json(wantedApartment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // עדכון דירה רצויה
  exports.updateWantedApartment = async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await WantedApartment.update(req.body, { where: { id } });
      if (updated[0] === 0) {
        return res.status(404).json({ message: 'Wanted apartment not found' });
      }
      const updatedWantedApartment = await WantedApartment.findByPk(id);
      res.json(updatedWantedApartment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // מחיקת דירה רצויה
  exports.deleteWantedApartment = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await WantedApartment.destroy({ where: { id } });
      if (deleted === 0) {
        return res.status(404).json({ message: 'Wanted apartment not found' });
      }
      res.json({ message: 'Wanted apartment deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
// הוספת דירה לרשימת הדירות הרצויות
exports.addWantedApartment = async (req, res) => {
  const { userId, address, city, rooms, size, floor, price, status, hasParking, hasBalcony, hasElevator } = req.body;
  try {
    const newWantedApartment = await WantedApartment.create({
      userId,
      address,
      city,
      rooms,
      size,
      floor,
      price,
      status,
      hasParking,
      hasBalcony,
      hasElevator
    });
    res.status(201).json(newWantedApartment);
  } catch (error) {
    res.status(500).json({ error: 'Error adding wanted apartment' });
  }
};
