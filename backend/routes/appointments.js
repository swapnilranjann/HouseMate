const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Property = require('../models/Property');
const Chat = require('../models/Chat');
const auth = require('../middleware/auth');
const response = require('../utils/response');

/**
 * @route   POST /api/appointments
 * @desc    Request Property Inspection (Customer Only)
 */
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
        return response.error(res, 'Security restriction: Only customers can request inspections.', 403);
    }

    const { propertyId } = req.body;
    if (!propertyId) return response.error(res, 'Property identification required.', 400);

    const property = await Property.findById(propertyId);
    if (!property) return response.error(res, 'Target asset not found in database.', 404);

    // Prevent duplicate active requests if pending
    const existing = await Appointment.findOne({ propertyId, customerId: req.user.id, status: 'pending' });
    if (existing) return response.error(res, 'An inspection inquiry is already active for this asset.', 400);

    const appointment = new Appointment({
      propertyId,
      customerId: req.user.id,
      tenantId: property.listerId,
      status: 'pending',
    });
    await appointment.save();

    // Establish secure communication hub immediately
    const newChat = new Chat({
      appointmentId: appointment._id,
      participants: [appointment.customerId, appointment.tenantId],
      messages: [],
    });
    await newChat.save();

    response.success(res, appointment, 'Inspection request transmitted. Secure channel established.', 201);
  } catch (err) {
    console.error('Inspection Request Error:', err.stack);
    response.error(res, 'Inspection pipeline failure.');
  }
});

/**
 * @route   PUT /api/appointments/:id
 * @desc    Approve/Reject Inspection Visit (Tenant Only)
 */
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'tenant') return response.error(res, 'Security restriction: Only owners can manage visits.', 403);

    const { status } = req.body; // 'approved' or 'rejected'
    if (!['approved', 'rejected'].includes(status)) return response.error(res, 'Invalid status update node.', 400);

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return response.error(res, 'Inquiry node not found.', 404);

    if (appointment.tenantId.toString() !== req.user.id) {
       return response.error(res, 'Security breach: Critical lack of node authority.', 403);
    }

    appointment.status = status;
    await appointment.save();

    response.success(res, appointment, `Inspection visit ${status.toUpperCase()} successfully.`);
  } catch (err) {
    console.error('Inspection Update Error:', err.stack);
    response.error(res, 'Inspection update failure.');
  }
});

/**
 * @route   GET /api/appointments/my
 * @desc    Find all inspection cycles for current identity
 */
router.get('/my', auth, async (req, res) => {
  try {
    const filter = req.user.role === 'customer' ? { customerId: req.user.id } : { tenantId: req.user.id };
    const appointments = await Appointment.find(filter)
      .populate('propertyId', 'name address images type price')
      .populate('customerId', 'name email phone')
      .populate('tenantId', 'name email phone');
    
    response.success(res, appointments, 'Identity inspection nodes synchronised.');
  } catch (err) {
    response.error(res, 'Inspection identification failure.');
  }
});

module.exports = router;
