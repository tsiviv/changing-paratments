const express = require('express');
const { getAllWantedApartments, addWantedApartment,getWantedApartmentByUserId,updateWantedApartment,deleteWantedApartment } = require('../controllers/alternativePartmnetsControllers');
const router = express.Router();
const {verifyToken} = require('../middleware/authMiddleware')
router.get('/', getAllWantedApartments);
router.post('/',verifyToken, addWantedApartment);
router.get('/:id', getWantedApartmentByUserId);
router.put('/:id',verifyToken, updateWantedApartment);
router.delete('/:id', deleteWantedApartment);

module.exports = router;
