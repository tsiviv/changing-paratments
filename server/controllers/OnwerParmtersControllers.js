const Apartment = require('../models/OnwerPartments');

// יצירת דירה חדשה
exports.createApartment = async (req, res) => {
  const {
    userId, address, city, district, type, rooms, size, floor,
    totalFloors, price, status, availableFrom, description,
    imageUrl, leaseTerm, hasParking, hasBalcony, hasElevator
  } = req.body;

  try {
    const apartment = await Apartment.create({
      userId, address, city, district, type, rooms, size, floor,
      totalFloors, price, status, availableFrom, description,
      imageUrl, leaseTerm, hasParking, hasBalcony, hasElevator
    });
    res.status(201).json(apartment);
  } catch (error) {
    res.status(500).json({ error: 'Error creating apartment', details: error });
  }
};

// קריאת כל הדירות
exports.getAllApartments = async (req, res) => {
  try {
    const apartments = await Apartment.findAll();
    res.status(200).json(apartments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching apartments', details: error });
  }
};

// קריאת דירה לפי ID
exports.getApartmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const apartment = await Apartment.findByPk(id);
    if (apartment) {
      res.status(200).json(apartment);
    } else {
      res.status(404).json({ error: 'Apartment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching apartment', details: error });
  }
};

// עדכון דירה לפי ID
exports.updateApartment = async (req, res) => {
  const { id } = req.params;
  const {
    address, city, district, type, rooms, size, floor,
    totalFloors, price, status, availableFrom, description,
    imageUrl, leaseTerm, hasParking, hasBalcony, hasElevator
  } = req.body;

  try {
    const apartment = await Apartment.findByPk(id);
    if (apartment) {
      apartment.address = address || apartment.address;
      apartment.city = city || apartment.city;
      apartment.district = district || apartment.district;
      apartment.type = type || apartment.type;
      apartment.rooms = rooms || apartment.rooms;
      apartment.size = size || apartment.size;
      apartment.floor = floor || apartment.floor;
      apartment.totalFloors = totalFloors || apartment.totalFloors;
      apartment.price = price || apartment.price;
      apartment.status = status || apartment.status;
      apartment.availableFrom = availableFrom || apartment.availableFrom;
      apartment.description = description || apartment.description;
      apartment.imageUrl = imageUrl || apartment.imageUrl;
      apartment.leaseTerm = leaseTerm || apartment.leaseTerm;
      apartment.hasParking = hasParking || apartment.hasParking;
      apartment.hasBalcony = hasBalcony || apartment.hasBalcony;
      apartment.hasElevator = hasElevator || apartment.hasElevator;

      await apartment.save();
      res.status(200).json(apartment);
    } else {
      res.status(404).json({ error: 'Apartment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating apartment', details: error });
  }
};

// מחיקת דירה לפי ID
exports.deleteApartment = async (req, res) => {
  const { id } = req.params;
  try {
    const apartment = await Apartment.findByPk(id);
    if (apartment) {
      await apartment.destroy();
      res.status(200).json({ message: 'Apartment deleted successfully' });
    } else {
      res.status(404).json({ error: 'Apartment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting apartment', details: error });
  }
};
