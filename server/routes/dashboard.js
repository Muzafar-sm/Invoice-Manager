import express from 'express';
import Invoice from '../models/Invoice.js';
import Client from '../models/Client.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get dashboard stats
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const currentDate = new Date();
    const thirtyDaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get total earnings (paid invoices) - grouped by currency
    const paidInvoices = await Invoice.find({ userId, status: 'paid' });
    const totalEarnings = paidInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
    const earningsByCurrency = paidInvoices.reduce((acc, inv) => {
      const curr = inv.currency || 'USD';
      acc[curr] = (acc[curr] || 0) + inv.total;
      return acc;
    }, {});
    const paidCountByCurrency = paidInvoices.reduce((acc, inv) => {
      const curr = inv.currency || 'USD';
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});

    // Get unpaid invoices - grouped by currency
    const unpaidInvoices = await Invoice.find({ 
      userId, 
      status: { $in: ['sent', 'overdue'] } 
    });
    const unpaidAmount = unpaidInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
    const unpaidByCurrency = unpaidInvoices.reduce((acc, inv) => {
      const curr = inv.currency || 'USD';
      acc[curr] = (acc[curr] || 0) + inv.total;
      return acc;
    }, {});
    const unpaidCountByCurrency = unpaidInvoices.reduce((acc, inv) => {
      const curr = inv.currency || 'USD';
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});

    // Get recent invoices (include currency)
    const recentInvoices = await Invoice.find({ userId })
      .populate('clientId', 'name company')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Get overdue invoices
    const overdueInvoices = await Invoice.find({
      userId,
      status: { $ne: 'paid' },
      dueDate: { $lt: currentDate },
    }).populate('clientId', 'name company').lean();

    // Get upcoming due dates (next 7 days)
    const nextWeek = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcomingInvoices = await Invoice.find({
      userId,
      status: { $ne: 'paid' },
      dueDate: { $gte: currentDate},
    }).populate('clientId', 'name company').lean();

    // Get total clients
    const totalClients = await Client.countDocuments({ userId });

    // Get monthly earnings (grouped by month for growth rate - sums all currencies)
    const monthlyEarnings = await Invoice.aggregate([
      {
        $match: {
          userId: req.user._id,
          status: 'paid',
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          total: { $sum: '$total' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({
      totalEarnings,
      unpaidAmount,
      earningsByCurrency,
      unpaidByCurrency,
      paidCountByCurrency,
      unpaidCountByCurrency,
      totalClients,
      recentInvoices,
      overdueInvoices,
      upcomingInvoices,
      monthlyEarnings,
      stats: {
        totalInvoices: await Invoice.countDocuments({ userId }),
        paidInvoices: paidInvoices.length,
        unpaidInvoices: unpaidInvoices.length,
        overdueCount: overdueInvoices.length,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;