const express = require('express');
const ApartmentController = require('../controllers/OnwerParmtersControllers');

const router = express.Router();

// יצירת דירה חדשה
router.post('/', ApartmentController.createApartment);

// קריאת כל הדירות
router.get('/', ApartmentController.getAllApartments);

// קריאת דירה לפי ID
router.get('/:id', ApartmentController.getApartmentById);

// עדכון דירה לפי ID
router.put('/:id', ApartmentController.updateApartment);

// מחיקת דירה לפי ID
router.delete('/:id', ApartmentController.deleteApartment);

module.exports = router;
