const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendClinicNotification(subject, html) {
  await resend.emails.send({
    from: 'Clinic <onboarding@resend.dev>',
    to: process.env.CLINIC_EMAIL,
    subject,
    html
  });
}

async function sendPatientEmail(email, name) {
  await resend.emails.send({
    from: 'Clinic <onboarding@resend.dev>',
    to: email,
    subject: 'Appointment Request Received',
    html: `<h2>Hello ${name}</h2><p>Your appointment request has been received.</p>`
  });
}

module.exports = { sendClinicNotification, sendPatientEmail };
