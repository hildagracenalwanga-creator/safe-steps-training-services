// Express router for processing store checkout orders
const express = require('express');
const router = express.Router();
const transporter = require('../config/mailer');

// POST /api/orders - Process checkout orders
router.post('/', async (req, res) => {
  const { name, phone, items } = req.body;

  // Basic validation
  if (!name || !phone || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid order request. Please supply name, phone number, and at least one item.'
    });
  }

  // Calculate order subtotal
  const totalAmount = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const orderId = `ORD-${Date.now()}`;

  // Format order list for email
  const itemListHtml = items
    .map(i => `<li><strong>${i.name}</strong> - UGX ${i.price.toLocaleString()}</li>`)
    .join('');

  try {
    // Send email notification to Admin for processing payment/delivery
    await transporter.sendMail({
      from: `"Safe Steps Store" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Store Order #${orderId} from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #111;">
          <h2 style="color: #23227c;">New Store Order Details</h2>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Customer Name:</strong> ${name}</p>
          <p><strong>Phone Number (MoMo/Airtel):</strong> ${phone}</p>
          <h3>Items Ordered:</h3>
          <ul>${itemListHtml}</ul>
          <p style="font-size: 1.2rem;"><strong>Total Amount:</strong> UGX ${totalAmount.toLocaleString()}</p>
        </div>
      `
    });

    return res.status(201).json({
      success: true,
      message: 'Order created successfully!',
      order: { orderId, totalAmount, itemCount: items.length }
    });
  } catch (error) {
    console.error('📧 Order Email Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Could not process order notification email.'
    });
  }
});

module.exports = router;