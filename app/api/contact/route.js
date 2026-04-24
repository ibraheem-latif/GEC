const FROM_ADDRESS = 'Glasgow Executive Chauffeurs <bookings@gec.limo>'
const DEFAULT_TO = 'bookings@gec.limo'

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(request) {
  try {
    const { name, email, phone, service, date, message } = await request.json()

    if (!name || !email || !phone || !service || !date || !message) {
      return Response.json({ error: 'All fields are required' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY
    const TO_EMAIL = process.env.TO_EMAIL || DEFAULT_TO

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured')
      return Response.json({ error: 'Email service is not configured' }, { status: 500 })
    }

    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>')
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [TO_EMAIL],
        reply_to: email,
        subject: `New Booking Request from ${escapeHtml(name)}`,
        html: `
          <h2>New Chauffeur Booking Request</h2>
          <p><strong>From:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
          <p><strong>Service:</strong> ${escapeHtml(service)}</p>
          <p><strong>Preferred Date:</strong> ${escapeHtml(date)}</p>
          <h3>Message:</h3>
          <p>${safeMessage}</p>
          <hr>
          <p><small>Sent from Glasgow Executive Chauffeurs website</small></p>
        `,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Resend API error:', error)
      throw new Error('Failed to send email')
    }

    const data = await response.json()
    return Response.json({ success: true, message: 'Booking request sent successfully', id: data.id })

  } catch (error) {
    console.error('Contact form error:', error)
    return Response.json({
      error: `Failed to send booking request. Please email ${DEFAULT_TO} directly.`,
    }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
