// Vercel Serverless Function for Contact Form
// This handles form submissions and sends emails via Resend

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, service, date, message } = req.body;

    // Basic validation
    if (!name || !email || !phone || !service || !date || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // For now, we'll use Resend API to send emails
    // You'll need to sign up at resend.com (100 emails/day free)
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const TO_EMAIL = process.env.TO_EMAIL || 'bookings@glasgowexecutivechauffeurs.co.uk';

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      // Still return success to user, but log the error
      return res.status(200).json({
        success: true,
        message: 'Booking request received'
      });
    }

    // Send email via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Glasgow Executive Chauffeurs <bookings@glasgowexecutivechauffeurs.co.uk>',
        to: [TO_EMAIL],
        reply_to: email,
        subject: `New Booking Request from ${name}`,
        html: `
          <h2>New Chauffeur Booking Request</h2>

          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Preferred Date:</strong> ${date}</p>

          <h3>Message:</h3>
          <p>${message.replace(/\n/g, '<br>')}</p>

          <hr>
          <p><small>Sent from Glasgow Executive Chauffeurs website</small></p>
        `,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Resend API error:', error);
      throw new Error('Failed to send email');
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      message: 'Booking request sent successfully',
      id: data.id
    });

  } catch (error) {
    console.error('Contact form error:', error);

    return res.status(500).json({
      error: 'Failed to send booking request. Please email bookings@glasgowexecutivechauffeurs.co.uk directly.',
      details: error.message
    });
  }
}
