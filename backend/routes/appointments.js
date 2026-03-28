const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Property = require('../models/Property');
const Chat = require('../models/Chat');
const auth = require('../middleware/auth');

// Request Appointment (Customer Only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'customer') return res.status(403).json({ message: 'Only customers can request appointments' });

    const property = await Property.findById(req.body.propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    const appointment = new Appointment({
      propertyId: req.body.propertyId,
      customerId: req.user.id,
      tenantId: property.listerId,
      status: 'pending',
    });
    await appointment.save();

    // Create a skeleton chat IMMEDIATELY
    const newChat = new Chat({
      appointmentId: appointment._id,
      participants: [appointment.customerId, appointment.tenantId],
      messages: [],
    });
    await newChat.save();

    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve/Reject Appointment (Tenant Only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'tenant') return res.status(403).json({ message: 'Only tenants can manage appointments' });

    const { status } = req.body; // 'approved' or 'rejected'
    const appointment = await Appointment.findById(req.params.id);

    if (appointment.tenantId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    appointment.status = status;
    await appointment.save();

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get My Appointments
router.get('/my', auth, async (req, res) => {
  try {
    const filter = req.user.role === 'customer' ? { customerId: req.user.id } : { tenantId: req.user.id };
    const appointments = await Appointment.find(filter)
      .populate('propertyId', 'name address')
      .populate('customerId', 'name email')
      .populate('tenantId', 'name email');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
