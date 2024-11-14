const express = require('express');
const { getAllWantedApartments, addWantedApartment,getWantedApartmentById,updateWantedApartment,deleteWantedApartment } = require('../controllers/alternativePartmnetsControllers');
const router = express.Router();

router.get('/', getAllWantedApartments);
router.post('/', addWantedApartment);
router.get('/:id', getWantedApartmentById);
router.put('/:id', updateWantedApartment);
router.delete('/:id', deleteWantedApartment);
module.exports = router;
