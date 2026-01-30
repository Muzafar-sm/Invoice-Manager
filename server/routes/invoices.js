import express from 'express';
import { body, validationResult } from 'express-validator';
import Invoice from '../models/Invoice.js';
import Client from '../models/Client.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Generate invoice number
const generateInvoiceNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `INV-${year}${month}-${random}`;
};

// Get all invoices
router.get('/', auth, async (req, res) => {
  try {
    const { status, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    let query = { userId: req.user.id };
    if (status && status !== 'all') {
      query.status = status;
    }

    const invoices = await Invoice.find(query)
      .populate('clientId', 'name email company')
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 });

    res.json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single invoice
router.get('/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, userId: req.user.id })
      .populate('clientId');
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    res.json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create invoice
router.post('/', [
  auth,
  body('clientId').notEmpty().withMessage('Client is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { clientId, items, dueDate, notes, tax = 0, status = 'draft', logo, currency = 'USD' } = req.body;

    // Verify client belongs to user
    const client = await Client.findOne({ _id: clientId, userId: req.user.id });
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const total = subtotal + tax;

    const invoice = new Invoice({
      invoiceNumber: generateInvoiceNumber(),
      clientId,
      userId: req.user.id,
      items,
      subtotal,
      tax,
      total,
      dueDate,
      notes,
      status,
      logo,
      currency: ['USD', 'JPY', 'AED', 'INR'].includes(currency) ? currency : 'USD',
    });

    await invoice.save();
    await invoice.populate('clientId', 'name email company');
    
    res.status(201).json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update invoice
router.put('/:id', [
  auth,
  body('clientId').notEmpty().withMessage('Client is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { clientId, items, dueDate, notes, tax = 0, status, logo, currency } = req.body;

    // Verify client belongs to user
    const client = await Client.findOne({ _id: clientId, userId: req.user.id });
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const total = subtotal + tax;

    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        clientId,
        items,
        subtotal,
        tax,
        total,
        dueDate,
        notes,
        ...(status && { status }),
        ...(logo !== undefined && { logo }),
        ...(currency && ['USD', 'JPY', 'AED', 'INR'].includes(currency) && { currency }),
      },
      { new: true }
    ).populate('clientId', 'name email company');

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update invoice status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['draft', 'sent', 'paid', 'overdue'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status },
      { new: true }
    ).populate('clientId', 'name email company');

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete invoice
router.delete('/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;