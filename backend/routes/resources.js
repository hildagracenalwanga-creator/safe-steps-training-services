// Express router for managing resource downloads & requests
const express = require('express');
const router = express.Router();
const transporter = require('../config/mailer');

// Sample list of available downloadable resources
const availableResources = [
  { id: '1', title: 'Family Safety Checklist', type: 'PDF' },
  { id: '2', title: 'School Safeguarding Code of Conduct', type: 'DOCX' }
];

// GET /api/resources - Get list of downloadable resources
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    data: availableResources
  });
});

// POST /api/resources/request - Send resource download link via email
router.post('/request', async (req, res) => {
  const { name, email, resourceId } = req.body;

  if (!email || !resourceId) {
    return res.status(400).json({
      success: false,
      error: 'Email and resourceId are required.'
    });
  }

  const resource = availableResources.find(r => r.id === resourceId);
  const resourceTitle = resource ? resource.title : 'Requested Resource';

  try {
    // Notify admin or log the resource request
    await transporter.sendMail({
      from: `"Safe Steps Resource Hub" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `Resource Request: ${resourceTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #23227c;">Resource Download Request</h2>
          <p><strong>Requested Resource:</strong> ${resourceTitle}</p>
          <p><strong>User Name:</strong> ${name || 'N/A'}</p>
          <p><strong>User Email:</strong> ${email}</p>
        </div>
      `
    });

    return res.status(200).json({
      success: true,
      message: `Resource request for "${resourceTitle}" received. Check your email shortly!`
    });
  } catch (error) {
    console.error('📧 Resource Email Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Could not process resource request at this time.'
    });
  }
});

module.exports = router;