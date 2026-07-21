// Express router for managing contact inquiries
const express = require('express');
const router = express.Router();
const transporter = require('../config/mailer');

// POST /api/contact - Receive and process contact form submissions
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: name, email, and message are required.'
    });
  }

  try {
    // Send email notification to Admin
    await transporter.sendMail({
      from: `"Safe Steps Web" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Form Inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #111;">
          <h2 style="color: #23227c;">New Inquiry Received</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="background: #f4f5fa; padding: 15px; border-left: 4px solid #fbbf24;">${message}</blockquote>
        </div>
      `
    });

    return res.status(200).json({
      success: true,
      message: 'Thank you for reaching out! Your message has been sent.',
      data: { name, email }
    });
  } catch (error) {
    console.error('📧 Email Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to send email message. Please try again later.'
    });
  }
});

module.exports = router;