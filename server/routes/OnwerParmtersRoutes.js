const express = require('express');
const ApartmentController = require('../controllers/OnwerParmtersControllers');
const {verifyToken} = require('../middleware/authMiddleware')

const router = express.Router();

// יצירת דירה חדשה
router.post('/',verifyToken, ApartmentController.createWantedApartment);
router.delete('/:id',verifyToken, ApartmentController.deleteWantedApartment);

// קריאת כל הדירות
router.get('/', ApartmentController.getAllWantedApartments);

// קריאת דירה לפי ID
router.get('/:id', ApartmentController.getWantedApartmentById);

// עדכון דירה לפי ID
router.put('/:id',verifyToken, ApartmentController.updateWantedApartment);

// מחיקת דירה לפי ID

module.exports = router;
