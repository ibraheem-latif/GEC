export async function onRequestPost(context) {
  const { request, env } = context

  try {
    const { name, email, phone, service, date, message } = await request.json()

    if (!name || !email || !phone || !service || !date || !message) {
      return Response.json({ error: 'All fields are required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const RESEND_API_KEY = env.RESEND_API_KEY
    const TO_EMAIL = env.TO_EMAIL || 'bookings@glasgowexecutivechauffeurs.co.uk'

    if (!RESEND_API_KEY) {
      return Response.json({ success: true, message: 'Booking request received' })
    }

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
      error: 'Failed to send booking request. Please email bookings@glasgowexecutivechauffeurs.co.uk directly.',
      details: error.message
    }, { status: 500 })
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
