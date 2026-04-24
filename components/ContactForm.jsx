'use client'

import { useState, useMemo } from 'react'
import { EMAIL } from '@/lib/seo'

const FieldLabel = ({ children }) => (
  <label style={{
    display: 'block',
    fontFamily: 'var(--font-space-mono), monospace',
    fontSize: '0.575rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--gold)',
    marginBottom: '0.625rem',
  }}>
    {children}
  </label>
)

export default function ContactForm({ defaultService = '' }) {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', service: defaultService, date: '', message: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const minDate = useMemo(() => new Date().toISOString().split('T')[0], [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    else if (!/^[\d\s+()-]+$/.test(formData.phone)) newErrors.phone = 'Phone number is invalid'
    if (!formData.service) newErrors.service = 'Please select a service'
    if (!formData.date) newErrors.date = 'Date is required'
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true)
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        const data = await response.json()
        if (response.ok && data.success) {
          setSubmitSuccess(true)
          setFormData({ name: '', email: '', phone: '', service: defaultService, date: '', message: '' })
          setTimeout(() => setSubmitSuccess(false), 5000)
        } else {
          alert(data.error || `Something went wrong. Please email ${EMAIL}`)
        }
      } catch (error) {
        console.error('Form submission error:', error)
        alert(`Could not send message. Please email ${EMAIL} directly.`)
      } finally {
        setIsSubmitting(false)
      }
    } else {
      setErrors(newErrors)
    }
  }

  const errorTextStyle = { color: '#e07070', fontSize: '0.8rem', marginTop: '0.375rem', fontFamily: 'var(--font-dm-sans), sans-serif' }

  return (
    <div>
      {submitSuccess && (
        <div style={{
          marginBottom: '1.5rem',
          padding: '1rem 1.25rem',
          border: '1px solid rgba(100, 200, 100, 0.3)',
          background: 'rgba(100, 200, 100, 0.05)',
          color: '#7ccd7c',
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontSize: '0.9rem',
          lineHeight: 1.5,
        }}>
          Cheers! We&apos;ve got your message. We&apos;ll be in touch within the hour.
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="max-sm:!grid-cols-1">
          <div>
            <FieldLabel>Full Name *</FieldLabel>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-field"
              placeholder="John Smith"
              style={{ borderColor: errors.name ? 'rgba(220,80,80,0.6)' : '' }}
            />
            {errors.name && <p style={errorTextStyle}>{errors.name}</p>}
          </div>
          <div>
            <FieldLabel>Email Address *</FieldLabel>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-field"
              placeholder="john@example.com"
              style={{ borderColor: errors.email ? 'rgba(220,80,80,0.6)' : '' }}
            />
            {errors.email && <p style={errorTextStyle}>{errors.email}</p>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="max-sm:!grid-cols-1">
          <div>
            <FieldLabel>Phone Number *</FieldLabel>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-field"
              placeholder="+44 7XXX XXXXXX"
              style={{ borderColor: errors.phone ? 'rgba(220,80,80,0.6)' : '' }}
            />
            {errors.phone && <p style={errorTextStyle}>{errors.phone}</p>}
          </div>
          <div>
            <FieldLabel>Service Type *</FieldLabel>
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="form-field"
              style={{ borderColor: errors.service ? 'rgba(220,80,80,0.6)' : '' }}
            >
              <option value="">Select a service</option>
              <option value="airport">Airport Transfer</option>
              <option value="tour">Scotland Tour</option>
              <option value="executive">Executive Travel</option>
              <option value="other">Other</option>
            </select>
            {errors.service && <p style={errorTextStyle}>{errors.service}</p>}
          </div>
        </div>

        <div>
          <FieldLabel>Preferred Date *</FieldLabel>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={minDate}
            className="form-field"
            style={{ borderColor: errors.date ? 'rgba(220,80,80,0.6)' : '' }}
          />
          {errors.date && <p style={errorTextStyle}>{errors.date}</p>}
        </div>

        <div>
          <FieldLabel>Additional Details *</FieldLabel>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="form-field"
            placeholder="Tell us about your journey — pick-up location, destination, number of passengers..."
            style={{ resize: 'none', borderColor: errors.message ? 'rgba(220,80,80,0.6)' : '' }}
          />
          {errors.message && <p style={errorTextStyle}>{errors.message}</p>}
        </div>

        <div>
          <button
            type="submit"
            className="btn-gold"
            disabled={isSubmitting}
            style={{ opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
          >
            {isSubmitting ? 'Sending...' : 'Submit Booking Request'}
          </button>
        </div>
      </form>
    </div>
  )
}
