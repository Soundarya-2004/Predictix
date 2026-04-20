const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // Or use your SMTP provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendAlertEmail = async (technicianEmail, alertData) => {
  const { machineName, severity, message, timestamp } = alertData;

  const mailOptions = {
    from: `"Predictix Alert System" <${process.env.EMAIL_USER}>`,
    to: technicianEmail,
    subject: `⚠️ [${severity}] Critical Maintenance Alert: ${machineName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #ddd; padding: 20px;">
        <h2 style="color: ${severity === 'Critical' ? '#ef4444' : '#f59e0b'};">
          ${severity} Alert Detected
        </h2>
        <p>A maintenance anomaly has been detected on <strong>${machineName}</strong>.</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Message:</strong> ${message}</p>
          <p><strong>Timestamp:</strong> ${new Date(timestamp).toLocaleString()}</p>
        </div>
        <p>Please log in to the Predictix Dashboard to acknowledge and resolve this issue.</p>
        <a href="http://localhost:5173/alerts" style="display: inline-block; padding: 10px 20px; background: #6366f1; color: white; text-decoration: none; border-radius: 5px;">
          View Alert Details
        </a>
        <hr style="margin: 30px 0; border: 0; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #999;">This is an automated notification from Predictix Predictive Maintenance System.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Alert Email Sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email Error:', error.message);
  }
};

module.exports = { sendAlertEmail };
