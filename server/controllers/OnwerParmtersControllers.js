const WantedApartment = require('../models/OnwerPartments');
const User = require('../models/users')

const { Resend } = require('resend');
const resend = new Resend(process.env.SEND_API_KEY);

exports.createWantedApartment = async (req, res) => {
    const {
        userId, rooms, beds, mattresses, floor, city, address, notes, preferredSwapDate
    } = req.body;

    console.log('Request Body:', req.body);

    try {
        const apartment = await WantedApartment.create({
            userId, rooms, beds, mattresses, floor, city, address, notes, preferredSwapDate
        });

        res.status(201).json(apartment);

        
        // setImmediate(async () => {
        //     try {
        //         const users = await User.findAll({
        //             where: { notifaction: true },
        //             attributes: ['email']
        //         });

        //         const emails = users.map(u => u.email);

        //         if (emails.length > 0) {
        //             const mailOptions = {
        //                 from: 'onboarding@resend.dev', // Resend דורש שכתובת ה-from תהיה בדומיין שלהם או בדומיין שאומת על ידכם
        //                 to: emails,
        //                 subject: 'דירה חדשה נוספה לאתר',
        //                 html: `
        //                     <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6;">
        //                         <p>שלום,</p>
        //                         <p>דירה חדשה נוספה למאגר באתר.</p>
        //                         <p>ניתן להיכנס לאתר כדי לצפות בפרטים.</p>
        //                         <p><a href="https://changing-paratments-production.up.railway.app" style="color: #1a73e8;">
        //                             לחץ כאן כדי להיכנס לאתר
        //                         </a></p>
        //                     </div>
        //                 `
        //             };

        //             const { data, error } = await resend.emails.send(mailOptions);

        //             if (error) {
        //                 console.error('❌ שגיאה בשליחת מיילים:', error);
        //             } else {
        //                 console.log(`נשלחו מיילים ל-${emails.length} משתמשים. פרטי שליחה:`, data);
        //             }
        //         }
        //     } catch (mailError) {
        //         console.error('שגיאה בשליחת מיילים:', mailError);
        //     }
        // });

    } catch (error) {
        console.error('Error creating apartment:', error);
        res.status(500).json({ error: 'Error creating wanted apartment', details: error.message });
    }
};


exports.getAllApartmentCities = async (req, res) => {
  try {
    const apartments = await WantedApartment.findAll({
      attributes: ['city'], // רק השדה city
      raw: true,            // יחזיר אובייקטים פשוטים בלי עטיפות של Sequelize
    });

    const uniqueCities = [...new Set(apartments.map(a => a.city))];

    res.status(200).json(uniqueCities);
  } catch (error) {
    console.error('Error fetching apartment cities:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

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
  console.log(req.body)
  const {
    rooms, beds, mattresses, floor, city, address, notes, preferredSwapDate
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
      apartment.preferredSwapDate = preferredSwapDate ?? apartment.preferredSwapDate;

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
      console.log("delete")
      res.status(200).json({ message: 'Wanted apartment deleted successfully' });
    } else {
      res.status(404).json({ error: 'Wanted apartment not found' });
    }
  } catch (error) {
    console.error('Error deleting apartment:', error);
    res.status(500).json({ error: 'Error deleting wanted apartment', details: error.message });
  }
};
