const WantedApartment = require('../models/alternativePartmnets');


// קבלת כל הדירות שהמשתמשים מעוניינים בהם
exports.getAllWantedApartments = async (req, res) => {
    try {
        const apartments = await WantedApartment.findAll();
        res.status(200).json(apartments); // נשלח ישירות את הנתונים
    } catch (error) {
        console.error('Error fetching apartments:', error);
        res.status(500).json({ error: 'Error fetching wanted apartments' });
    }
};

// קבלת דירה רצויה לפי ID של המשתמש
exports.getWantedApartmentByUserId = async (req, res) => {
    const userId = req.params.id;
    try {
        const wantedApartment = await WantedApartment.findOne({ where: { userId } });
        if (!wantedApartment) {
            return res.status(404).json({ message: 'Wanted apartment not found' });
        }
        res.status(200).json(wantedApartment);
    } catch (error) {
        console.error('Error fetching apartment by user ID:', error);
        res.status(500).json({ error: error.message });
    }
}; exports.updateWantedApartment = async (req, res) => {


    const { id } = req.params;
    const { preferredSwapDate, area, numberOfBeds, numberOfRooms, userId } = req.body
    // עדכון הדירה בתוך הטרנזקציה
    try {
        const apartment = await WantedApartment.findByPk(id);
        if (apartment) {
            // עדכון הפרטים לפי הנתונים שהתקבלו בבקשה
            apartment.preferredSwapDate = preferredSwapDate ?? apartment.preferredSwapDate;
            apartment.area = area ?? apartment.area;
            apartment.numberOfBeds = numberOfBeds ?? apartment.numberOfBeds;
            apartment.numberOfRooms = numberOfRooms ?? apartment.numberOfRooms;

            await apartment.save();

            res.status(200).json(apartment); // שליחת הדירה המעודכנת
        } else {
            res.status(404).json({ error: 'Wanted apartment not found' });
        }
    } catch (error) {
        console.error('Error updating apartment:', error);
        res.status(500).json({ error: 'Error updating wanted apartment', details: error.message });
    }
}
// מחיקת דירה רצויה
exports.deleteWantedApartment = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await WantedApartment.destroy({ where: { id } });

        if (deleted === 0) {
            return res.status(404).json({ message: 'Wanted apartment not found' });
        }

        res.status(200).json({ message: 'Wanted apartment deleted successfully' });
    } catch (error) {
        console.error('Error deleting apartment:', error);
        res.status(500).json({ error: error.message });
    }
};

// הוספת דירה לרשימת הדירות הרצויות
exports.addWantedApartment = async (req, res) => {
    const { userId, numberOfBeds, numberOfRooms, area, preferredSwapDate } = req.body;

    if (!userId || !numberOfBeds || !numberOfRooms || !area) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const newWantedApartment = await WantedApartment.create({
            userId,
            numberOfBeds,
            numberOfRooms,
            area,
            preferredSwapDate
        });
        res.status(201).json(newWantedApartment);
    } catch (error) {
        console.error('Error adding apartment:', error);
        res.status(500).json({ error: error.message });
    }
};
