const { Resend } = require('resend');

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CLINIC_EMAIL = process.env.CLINIC_EMAIL;

let resend = null;
if (RESEND_API_KEY) {
  try {
    resend = new Resend(RESEND_API_KEY);
  } catch (err) {
    console.error('Failed to initialize Resend client:', err);
  }
} else {
  console.warn('RESEND_API_KEY is not set. Emails will be skipped.');
}

async function sendClinicNotification(subject, html) {
  if (!resend) {
    console.warn('sendClinicNotification skipped: missing RESEND_API_KEY');
    return;
  }
  if (!CLINIC_EMAIL) {
    console.warn('sendClinicNotification skipped: CLINIC_EMAIL not configured');
    return;
  }
  try {
    const result = await resend.emails.send({
      from: `Clinic <${CLINIC_EMAIL}>`,
      to: CLINIC_EMAIL,
      subject,
      html,
    });
    console.log('Clinic notification sent', { to: CLINIC_EMAIL, id: result.id });
    return result;
  } catch (err) {
    console.error('Error sending clinic notification:', err);
    throw err;
  }
}

async function sendPatientEmail(email, name) {
  if (!resend) {
    console.warn('sendPatientEmail skipped: missing RESEND_API_KEY');
    return;
  }
  if (!email) {
    console.warn('sendPatientEmail skipped: patient email not provided');
    return;
  }
  try {
    const result = await resend.emails.send({
      from: `Clinic <${CLINIC_EMAIL || 'onboarding@resend.dev'}>` ,
      to: email,
      subject: 'Appointment Request Received',
      html: `<h2>Hello ${name}</h2><p>Your appointment request has been received. We will contact you to confirm the appointment.</p>`,
    });
    console.log('Patient email sent', { to: email, id: result.id });
    return result;
  } catch (err) {
    console.error('Error sending patient email:', err);
    throw err;
  }
}

module.exports = { sendClinicNotification, sendPatientEmail };
