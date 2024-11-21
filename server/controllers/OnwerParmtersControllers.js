const WantedApartment = require('../models/OnwerPartments');
const User=require('../models/users')
// יצירת דירה חדשה
exports.createWantedApartment = async (req, res) => {
  const {
    userId, rooms, beds, mattresses, floor, city, address, notes
  } = req.body;

  console.log('Request Body:', req.body);

  try {
    const apartment = await WantedApartment.create({
      userId, rooms, beds, mattresses, floor, city, address, notes
    });
    res.status(201).json(apartment); // שליחת הדירה שנוצרה ישירות
  } catch (error) {
    console.error('Error creating apartment:', error);
    res.status(500).json({ error: 'Error creating wanted apartment', details: error.message });
  }
};

// קריאת כל הדירות המבוקשות
exports.getAllWantedApartments = async (req, res) => {
  try {
    const apartments = await WantedApartment.findAll();
    res.status(200).json(apartments); // שליחת כל הדירות
  } catch (error) {
    console.error('Error fetching apartments:', error);
    res.status(500).json({ error: 'Error fetching wanted apartments', details: error.message });
  }
};

// קריאת דירה מבוקשת לפי ID
exports.getWantedApartmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const apartment = await WantedApartment.findByPk(id);
    if (apartment) {
      res.status(200).json(apartment); // שליחת הדירה שנמצאה
    } else {
      res.status(404).json({ error: 'Wanted apartment not found' });
    }
  } catch (error) {
    console.error('Error fetching apartment by ID:', error);
    res.status(500).json({ error: 'Error fetching wanted apartment', details: error.message });
  }
};

// עדכון דירה מבוקשת לפי ID
exports.updateWantedApartment = async (req, res) => {
  const { id } = req.params;
  const {
    rooms, beds, mattresses, floor, city, address, notes
  } = req.body;

  try {
    const apartment = await WantedApartment.findByPk(id);
    if (apartment) {
      // עדכון הפרטים לפי הנתונים שהתקבלו בבקשה
      apartment.rooms = rooms ?? apartment.rooms;
      apartment.beds = beds ?? apartment.beds;
      apartment.mattresses = mattresses ?? apartment.mattresses;
      apartment.floor = floor ?? apartment.floor;
      apartment.city = city ?? apartment.city;
      apartment.address = address ?? apartment.address;
      apartment.notes = notes ?? apartment.notes;

      await apartment.save();

      res.status(200).json(apartment); // שליחת הדירה המעודכנת
    } else {
      res.status(404).json({ error: 'Wanted apartment not found' });
    }
  } catch (error) {
    console.error('Error updating apartment:', error);
    res.status(500).json({ error: 'Error updating wanted apartment', details: error.message });
  }
};

// מחיקת דירה מבוקשת לפי ID
exports.deleteWantedApartment = async (req, res) => {
  const { id } = req.params;

  try {
    const apartment = await WantedApartment.findByPk(id);
    if (apartment) {
      await apartment.destroy();
      res.status(200).json({ message: 'Wanted apartment deleted successfully' });
    } else {
      res.status(404).json({ error: 'Wanted apartment not found' });
    }
  } catch (error) {
    console.error('Error deleting apartment:', error);
    res.status(500).json({ error: 'Error deleting wanted apartment', details: error.message });
  }
};
