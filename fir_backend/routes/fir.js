const router = require('express').Router(); // 👈 THIS WAS MISSING
const FIR = require('../models/FIR');
const auth = require('../middleware/auth');

// @route   POST api/fir/create
// @desc    Create a new FIR (Protected Route)
router.post('/create', auth, async (req, res) => {
  try {
    const { complainantName, incidentType, location, incidentDate, incidentTime, description } = req.body;

    const newFIR = new FIR({
      userId: req.user.id, // Securely grabbed from the token
      complainantName,
      incidentType,
      location,
      incidentDate,
      incidentTime,
      description
    });

    const savedFIR = await newFIR.save();
    res.status(201).json({ message: 'FIR registered successfully', firId: savedFIR._id });
  } catch (err) {
    res.status(500).json({ message: 'Server Error saving comprehensive FIR' });
  }
});

// @route   GET api/fir/my-firs
// @desc    Get all FIRs filed by the logged-in user
router.get('/my-firs', auth, async (req, res) => {
  try {
    const firs = await FIR.find({ userId: req.user.id }).sort({ filedAt: -1 });
    res.json(firs);
  } catch (err) {
    res.status(500).json({ message: 'Server Error fetching records' });
  }
});

module.exports = router; // 👈 MAKE SURE THIS IS AT THE BOTTOM