import mongoose from 'mongoose';

const invoiceItemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  rate: {
    type: Number,
    required: true,
    min: 0,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  logo:{
    type: String,
    required: false,
    min: 0,
  }
});

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [invoiceItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
  tax: {
    type: Number,
    default: 0,
    min: 0,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'overdue'],
    default: 'draft',
  },
  issueDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  logo: {
    type: String, // Data URL or image path
  },
  currency: {
    type: String,
    enum: ['USD', 'JPY', 'AED', 'INR'],
    default: 'USD',
  },
}, {
  timestamps: true,
});

export default mongoose.model('Invoice', invoiceSchema);