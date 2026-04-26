'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { EMAIL } from '@/lib/seo'
import { searchPlaces, reverseGeocode, getCurrentPosition } from '@/lib/geocode'
import { TOUR_PACKAGES, VEHICLE_CLASSES, calculateQuotes, findQuote, formatCurrency, detectAirport } from '@/lib/pricing'
import { formatDuration } from '@/lib/routing'

const RouteMap = dynamic(() => import('./RouteMap'), { ssr: false })

const STORAGE_KEY = 'gec.booking.draft'
const STORAGE_VERSION = 5

const STEPS = [
  { id: 1, label: 'Service' },
  { id: 2, label: 'Trip' },
  { id: 3, label: 'Quote' },
  { id: 4, label: 'Details' },
]

const SERVICE_CARDS = [
  { id: 'p2p', title: 'Point-to-Point', subtitle: 'Airports, hotels, anywhere in Scotland.' },
  { id: 'hourly', title: 'By the Hour', subtitle: 'As-directed · 4hr minimum.' },
  { id: 'tour', title: 'Scotland Tour', subtitle: 'Highlands, Loch Lomond, beyond.' },
]

const SERVICE_LABEL = {
  p2p: 'Point-to-Point',
  hourly: 'By the Hour',
  tour: 'Scotland Tour',
}

const initialData = (defaultService) => ({
  service: defaultService || '',
  flightNumber: '',
  pickup: null,
  dropoff: null,
  tour: '',
  tourNotes: '',
  hours: 4,
  vehicle: 'business',
  pickupMode: 'schedule', // 'now' | 'schedule'
  timeMode: 'depart',     // 'depart' | 'arrive'  (only for schedule)
  date: '',
  time: '',
  name: '',
  email: '',
  phone: '',
  notes: '',
})

const formatDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

const todayISO = () => new Date().toISOString().split('T')[0]
const nowHHMM = () => {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const FieldLabel = ({ children, hint }) => (
  <div style={{ marginBottom: '0.625rem', display: 'flex', alignItems: 'baseline', gap: '0.5rem 0.75rem', flexWrap: 'wrap' }}>
    <label style={{
      display: 'block',
      fontFamily: 'var(--font-space-mono), monospace',
      fontSize: '0.575rem',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--gold)',
    }}>{children}</label>
    {hint && <span style={{ fontSize: '0.7rem', color: 'var(--white-dim)' }}>{hint}</span>}
  </div>
)

const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3" /><path d="M12 19v3" /><path d="M2 12h3" /><path d="M19 12h3" />
  </svg>
)

function LocationField({ label, hint, value, onChange, placeholder, allowMyLocation = false }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [geoBusy, setGeoBusy] = useState(false)
  const [geoError, setGeoError] = useState('')
  const abortRef = useRef(null)
  const wrapRef = useRef(null)

  useEffect(() => {
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  useEffect(() => {
    if (!query || query.length < 3) { setResults([]); return }
    const t = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort()
      const controller = new AbortController()
      abortRef.current = controller
      setLoading(true)
      try {
        const places = await searchPlaces(query, { signal: controller.signal })
        setResults(places)
      } catch {} finally { setLoading(false) }
    }, 220)
    return () => clearTimeout(t)
  }, [query])

  const useMyLocation = async () => {
    setGeoError('')
    setGeoBusy(true)
    try {
      const coords = await getCurrentPosition()
      const place = await reverseGeocode(coords)
      if (place) {
        onChange(place)
      } else {
        onChange({ id: 'current', name: 'Current location', short: 'Current location', context: '', coords })
      }
    } catch (e) {
      setGeoError(e?.code === 1 ? 'Permission denied — allow location in browser settings.' : 'Could not get location.')
    } finally {
      setGeoBusy(false)
    }
  }

  if (value) {
    return (
      <div>
        <FieldLabel hint={hint}>{label}</FieldLabel>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          padding: '0.75rem 1rem',
          border: '1px solid var(--gold-border)',
          background: 'var(--gold-glow)',
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: '0.9375rem',
              color: 'var(--white)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>{value.short || value.name}</div>
            {value.context && (
              <div style={{ fontSize: '0.7rem', color: 'var(--white-dim)', marginTop: '2px' }}>
                {value.context}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => { onChange(null); setQuery(''); setResults([]) }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--gold)',
              cursor: 'pointer',
              fontFamily: 'var(--font-space-mono), monospace',
              fontSize: '0.6rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
            }}
          >
            Change
          </button>
        </div>
      </div>
    )
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <FieldLabel hint={hint}>{label}</FieldLabel>
      <input
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        className="form-field"
        placeholder={placeholder}
        autoComplete="off"
      />
      {allowMyLocation && (
        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem 0.75rem', flexWrap: 'wrap' }}>
          <button type="button" className="gec-loc-action" onClick={useMyLocation} disabled={geoBusy}>
            <PinIcon />
            {geoBusy ? 'Locating…' : 'Use my location'}
          </button>
          {geoError && <span style={{ fontSize: '0.7rem', color: '#ec9090' }}>{geoError}</span>}
        </div>
      )}
      {open && (results.length > 0 || loading) && (
        <div className="gec-suggest" role="listbox">
          {loading && results.length === 0 && (
            <div style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'var(--white-dim)' }}>
              Searching…
            </div>
          )}
          {results.map((r) => (
            <button
              key={r.id}
              type="button"
              className="gec-suggest-item"
              onClick={() => { onChange(r); setQuery(''); setResults([]); setOpen(false) }}
            >
              <strong>{r.short}</strong>
              {r.context && <span className="ctx">{r.context}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function Stepper({ value, onChange, min = 1, max = 12, suffix }) {
  return (
    <div className="gec-stepper">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Decrease">−</button>
      <span className="gec-stepper-value">{value}{suffix ? ` ${suffix}` : ''}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Increase">+</button>
    </div>
  )
}

function ProgressBar({ step }) {
  return (
    <div className="gec-progress" aria-label={`Step ${step} of ${STEPS.length}`}>
      {STEPS.map((s) => (
        <div
          key={s.id}
          className="gec-progress-dot"
          data-state={s.id === step ? 'active' : s.id < step ? 'done' : ''}
        />
      ))}
    </div>
  )
}

/* Uber-style time picker: Now / Schedule. When scheduled: Pickup-by | Arrive-by toggle. */
function TimePicker({ data, update }) {
  const minDate = todayISO()
  const isToday = data.date === minDate
  const minTime = isToday ? nowHHMM() : undefined
  const setNow = () => update({ pickupMode: 'now', date: minDate, time: nowHHMM(), timeMode: 'depart' })
  const setSchedule = () => {
    const patch = { pickupMode: 'schedule' }
    if (!data.date) patch.date = minDate
    if (!data.time) patch.time = '12:00'
    update(patch)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="gec-time-toggle" role="tablist">
        <button type="button" role="tab" aria-pressed={data.pickupMode === 'now'} onClick={setNow}>Pick up now</button>
        <button type="button" role="tab" aria-pressed={data.pickupMode === 'schedule'} onClick={setSchedule}>Schedule</button>
      </div>

      {data.pickupMode === 'now' && (
        <p style={{
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontSize: '0.85rem',
          color: 'var(--white-dim)',
          margin: 0,
          lineHeight: 1.6,
        }}>
          We&apos;ll dispatch the nearest available driver. Allow ~20 min from confirmation in central Glasgow.
        </p>
      )}

      {data.pickupMode === 'schedule' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="gec-time-mode" role="tablist" aria-label="Schedule type">
            <button type="button" role="tab" aria-pressed={data.timeMode === 'depart'} onClick={() => update({ timeMode: 'depart' })}>
              Pickup at
            </button>
            <button type="button" role="tab" aria-pressed={data.timeMode === 'arrive'} onClick={() => update({ timeMode: 'arrive' })}>
              Arrive by
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="max-sm:!grid-cols-1">
            <div>
              <FieldLabel hint={data.date ? formatDate(data.date) : ''}>Date</FieldLabel>
              <input
                type="date"
                value={data.date}
                onChange={(e) => update({ date: e.target.value })}
                min={minDate}
                className="form-field"
              />
            </div>
            <div>
              <FieldLabel>{data.timeMode === 'arrive' ? 'Arrive by' : 'Pickup time'}</FieldLabel>
              <input
                type="time"
                value={data.time}
                onChange={(e) => update({ time: e.target.value })}
                min={minTime}
                className="form-field"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function BookingWizard({ defaultService = '' }) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState(() => initialData(defaultService))
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [hydrated, setHydrated] = useState(false)
  // True only after the user actively interacted with this wizard instance.
  const userTouchedRef = useRef(false)

  // Hydrate from localStorage. Wipe on version mismatch (schema bumps).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.__v === STORAGE_VERSION) {
          const { __v, ...rest } = parsed
          setData((prev) => ({
            ...prev,
            ...rest,
            // Page-level defaultService always wins over stored draft.
            service: defaultService || rest.service || '',
          }))
        } else {
          localStorage.removeItem(STORAGE_KEY)
        }
      }
    } catch {}
    setHydrated(true)
  }, [defaultService])

  // Persist
  useEffect(() => {
    if (!hydrated) return
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ __v: STORAGE_VERSION, ...data })) } catch {}
  }, [data, hydrated])

  // Step1 calls onPick() directly; no auto-advance effect needed.

  const update = useCallback((patch) => {
    userTouchedRef.current = true
    setData((prev) => ({ ...prev, ...patch }))
  }, [])

  // Step 2 validity per service
  const step2Valid = useMemo(() => {
    if (!data.date || !data.time) return false
    if (data.service === 'tour') return Boolean(data.tour && data.pickup)
    if (data.service === 'p2p') return Boolean(data.pickup && data.dropoff)
    if (data.service === 'hourly') return Boolean(data.pickup && data.hours >= 4)
    return false
  }, [data])

  const quotes = useMemo(() => calculateQuotes(data), [data])
  const quote = useMemo(() => findQuote(quotes, data.vehicle), [quotes, data.vehicle])

  const step4Valid = useMemo(() => {
    return Boolean(data.name.trim() && data.email.trim() && data.phone.trim() &&
      /\S+@\S+\.\S+/.test(data.email))
  }, [data])

  const handleSubmit = async () => {
    setSubmitting(true)
    setErrorMsg('')
    try {
      const payload = buildSubmissionPayload(data, quote)
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (res.ok && json.success) {
        setSuccess(true)
        try { localStorage.removeItem(STORAGE_KEY) } catch {}
      } else {
        setErrorMsg(json.error || `Something went wrong. Please email ${EMAIL}.`)
      }
    } catch (e) {
      setErrorMsg(`Could not send. Please email ${EMAIL} directly.`)
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div style={{
        padding: '2rem',
        border: '1px solid var(--gold-border)',
        background: 'var(--gold-glow)',
      }}>
        <div className="label" style={{ marginBottom: '1rem' }}>Booking received</div>
        <h3 style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: '1.75rem',
          fontWeight: 300,
          color: 'var(--white)',
          margin: '0 0 0.75rem',
        }}>
          Cheers, {data.name.split(' ')[0] || 'thanks'}.
        </h3>
        <p style={{
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontSize: '0.95rem',
          lineHeight: 1.6,
          color: 'var(--white-dim)',
          margin: 0,
        }}>
          We&apos;ve got your request. A driver will confirm by email and SMS within the hour.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div className="label">Step {step} of {STEPS.length} · {STEPS[step - 1].label}</div>
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--white-dim)',
                cursor: 'pointer',
                fontFamily: 'var(--font-space-mono), monospace',
                fontSize: '0.6rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
              }}
            >
              ← Back
            </button>
          )}
        </div>
        <ProgressBar step={step} />
      </div>

      <div key={step} className="gec-step-enter">
        {step === 1 && <Step1 data={data} update={update} onPick={() => setStep(2)} />}
        {step === 2 && <Step2 data={data} update={update} />}
        {step === 3 && <Step3 data={data} update={update} quotes={quotes} />}
        {step === 4 && <Step4 data={data} update={update} quote={quote} errorMsg={errorMsg} />}
      </div>

      {step > 1 && (
        <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          {step === 2 && (
            <button
              type="button"
              className="btn-gold"
              disabled={!step2Valid}
              style={{ opacity: step2Valid ? 1 : 0.4, cursor: step2Valid ? 'pointer' : 'not-allowed' }}
              onClick={() => setStep(3)}
            >
              See quote →
            </button>
          )}
          {step === 3 && (
            <button type="button" className="btn-gold" onClick={() => setStep(4)}>
              Continue →
            </button>
          )}
          {step === 4 && (
            <button
              type="button"
              className="btn-gold"
              disabled={!step4Valid || submitting}
              style={{ opacity: step4Valid && !submitting ? 1 : 0.5, cursor: step4Valid && !submitting ? 'pointer' : 'not-allowed' }}
              onClick={handleSubmit}
            >
              {submitting ? 'Sending…' : 'Submit booking request'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function Step1({ data, update, onPick }) {
  const handle = (id) => {
    update({ service: id })
    setTimeout(onPick, 200)
  }
  return (
    <div>
      <h3 style={{
        fontFamily: 'var(--font-playfair), Georgia, serif',
        fontSize: '1.5rem',
        fontWeight: 300,
        color: 'var(--white)',
        margin: '0 0 1.5rem',
      }}>
        What can we help with?
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '0.75rem',
      }}>
        {SERVICE_CARDS.map((s) => (
          <button
            key={s.id}
            type="button"
            className="gec-card"
            aria-pressed={data.service === s.id}
            onClick={() => handle(s.id)}
          >
            <div style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: '1.25rem',
              fontWeight: 400,
              color: data.service === s.id ? 'var(--gold)' : 'var(--white)',
            }}>
              {s.title}
            </div>
            <div style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: '0.875rem',
              color: 'var(--white-dim)',
              lineHeight: 1.5,
            }}>
              {s.subtitle}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function Step2({ data, update }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {data.service === 'tour' && <TourSection data={data} update={update} />}
      {data.service === 'p2p' && <PointToPointSection data={data} update={update} />}
      {data.service === 'hourly' && <HourlySection data={data} update={update} />}

      <div style={{ borderTop: '1px solid var(--line)', paddingTop: '1.5rem' }}>
        <FieldLabel>When do you need us?</FieldLabel>
        <TimePicker data={data} update={update} />
      </div>
    </div>
  )
}

function TourSection({ data, update }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <FieldLabel>Choose a tour</FieldLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
          {TOUR_PACKAGES.map((p) => (
            <button
              key={p.id}
              type="button"
              className="gec-card"
              aria-pressed={data.tour === p.id}
              onClick={() => update({ tour: p.id })}
              style={{ minHeight: '90px', padding: '1rem' }}
            >
              <div style={{
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: '0.95rem',
                fontWeight: 500,
                color: data.tour === p.id ? 'var(--gold)' : 'var(--white)',
              }}>
                {p.label}
              </div>
              <div style={{
                fontFamily: 'var(--font-space-mono), monospace',
                fontSize: '0.6rem',
                letterSpacing: '0.14em',
                color: 'var(--white-dim)',
                textTransform: 'uppercase',
              }}>
                {p.duration}{p.price ? ` · from ${formatCurrency(p.price)}` : ''}
              </div>
            </button>
          ))}
        </div>
      </div>
      <LocationField
        label="Pickup location"
        hint="Where shall we collect you?"
        value={data.pickup}
        onChange={(v) => update({ pickup: v })}
        placeholder="Hotel, address, or postcode"
        allowMyLocation
      />
      {data.tour === 'custom' && (
        <div>
          <FieldLabel>Where would you like to go?</FieldLabel>
          <textarea
            value={data.tourNotes}
            onChange={(e) => update({ tourNotes: e.target.value })}
            rows={3}
            className="form-field"
            style={{ resize: 'none' }}
            placeholder="Tell us the places you have in mind…"
          />
        </div>
      )}
    </div>
  )
}

function PointToPointSection({ data, update }) {
  const pickupApt = detectAirport(data.pickup)
  const dropoffApt = detectAirport(data.dropoff)
  const airportCode = pickupApt || dropoffApt
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <LocationField
        label="Pickup"
        value={data.pickup}
        onChange={(v) => update({ pickup: v })}
        placeholder="Hotel, airport, or postcode"
        allowMyLocation
      />
      <LocationField
        label="Drop-off"
        value={data.dropoff}
        onChange={(v) => update({ dropoff: v })}
        placeholder="Destination address"
      />
      {airportCode && (
        <div>
          <FieldLabel hint={`${airportCode} detected · we'll track delays`}>Flight number</FieldLabel>
          <input
            type="text"
            value={data.flightNumber}
            onChange={(e) => update({ flightNumber: e.target.value.toUpperCase() })}
            className="form-field"
            placeholder="e.g. BA1456"
          />
        </div>
      )}
      <RouteMap pickup={data.pickup} dropoff={data.dropoff} />
    </div>
  )
}

function HourlySection({ data, update }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <LocationField
        label="Pickup"
        hint="We'll wait, drive, and return on your schedule"
        value={data.pickup}
        onChange={(v) => update({ pickup: v })}
        placeholder="Hotel, address, or postcode"
        allowMyLocation
      />
      <div>
        <FieldLabel hint="4 hour minimum · £65/hr">Hours</FieldLabel>
        <Stepper value={data.hours} onChange={(v) => update({ hours: v })} min={4} max={12} suffix="hrs" />
      </div>
    </div>
  )
}

function Step3({ data, update, quotes }) {
  if (!quotes) {
    return (
      <div>
        <p style={{ color: 'var(--white-dim)', fontSize: '0.95rem' }}>
          We need a little more info to quote — please go back and complete the trip details.
        </p>
      </div>
    )
  }
  if (quotes.custom) {
    return (
      <div>
        <h3 style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: '2rem',
          fontWeight: 300,
          color: 'var(--white)',
          margin: '0 0 0.5rem',
        }}>
          Custom quote
        </h3>
        <p style={{ color: 'var(--white-dim)', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
          {quotes.note}
        </p>
        {data.service === 'p2p' && data.pickup && data.dropoff && (
          <div style={{ marginBottom: '1.5rem' }}>
            <RouteMap pickup={data.pickup} dropoff={data.dropoff} />
          </div>
        )}
        <TripSummary data={data} />
      </div>
    )
  }

  return (
    <div>
      {data.service === 'p2p' && data.pickup && data.dropoff && (
        <div style={{ marginBottom: '1.5rem' }}>
          <RouteMap pickup={data.pickup} dropoff={data.dropoff} />
        </div>
      )}

      <div className="label" style={{ marginBottom: '0.875rem' }}>Choose your vehicle</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
        {quotes.map((q) => {
          const selected = data.vehicle === q.vehicle.id
          return (
            <button
              key={q.vehicle.id}
              type="button"
              className="gec-card"
              aria-pressed={selected}
              onClick={() => update({ vehicle: q.vehicle.id })}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem 1.25rem',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <div>
                <div style={{
                  fontFamily: 'var(--font-playfair), Georgia, serif',
                  fontSize: '1.25rem',
                  fontWeight: 400,
                  color: selected ? 'var(--gold)' : 'var(--white)',
                  marginBottom: '2px',
                }}>
                  {q.vehicle.label}
                </div>
                <div style={{
                  fontFamily: 'var(--font-dm-sans), sans-serif',
                  fontSize: '0.85rem',
                  color: 'var(--white-dim)',
                  lineHeight: 1.5,
                }}>
                  {q.vehicle.vehicle} · {q.vehicle.capacity}
                </div>
              </div>
              <div style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: '1.5rem',
                fontWeight: 400,
                color: selected ? 'var(--gold)' : 'var(--white)',
                whiteSpace: 'nowrap',
              }}>
                {formatCurrency(q.low)}<span style={{ color: 'var(--white-dim)', fontSize: '0.7em', margin: '0 0.2em' }}>–</span>{formatCurrency(q.high)}
              </div>
            </button>
          )
        })}
      </div>

      <p style={{
        fontFamily: 'var(--font-dm-sans), sans-serif',
        fontSize: '0.85rem',
        color: 'var(--white-dim)',
        margin: '0 0 1.5rem',
        lineHeight: 1.6,
      }}>
        Final fixed price confirmed when we reply. No surge, no surprises.
      </p>

      <TripSummary data={data} />
    </div>
  )
}

function TripSummary({ data }) {
  const rows = []
  const p2pAirport = data.service === 'p2p' ? (detectAirport(data.pickup) || detectAirport(data.dropoff)) : null
  const serviceLabel = p2pAirport ? 'Airport Transfer' : SERVICE_LABEL[data.service]
  rows.push(['Service', serviceLabel])
  if (data.service === 'tour') {
    const pkg = TOUR_PACKAGES.find((p) => p.id === data.tour)
    if (pkg) rows.push(['Tour', `${pkg.label} · ${pkg.duration}`])
    if (data.pickup) rows.push(['Pickup', data.pickup.short])
  }
  if (data.service === 'p2p') {
    if (data.pickup) rows.push(['Pickup', data.pickup.short])
    if (data.dropoff) rows.push(['Drop-off', data.dropoff.short])
    if (p2pAirport && data.flightNumber) rows.push(['Flight', data.flightNumber])
  }
  if (data.service === 'hourly') {
    rows.push(['Style', `Hourly · ${data.hours} hrs`])
    if (data.pickup) rows.push(['Pickup', data.pickup.short])
  }

  const whenLabel = data.timeMode === 'arrive' ? 'Arrive by' : 'Pickup'
  if (data.pickupMode === 'now') {
    rows.push(['Pickup', 'As soon as possible'])
  } else if (data.date) {
    rows.push([whenLabel, `${formatDate(data.date)} · ${data.time}`])
  }

  return (
    <div style={{ border: '1px solid var(--line)', padding: '1.25rem' }}>
      {rows.map(([k, v], i) => (
        <div key={i} style={{
          display: 'grid',
          gridTemplateColumns: '5rem 1fr',
          gap: '1rem',
          padding: '0.5rem 0',
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontSize: '0.875rem',
        }}>
          <span style={{
            fontFamily: 'var(--font-space-mono), monospace',
            fontSize: '0.575rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--white-dim)',
          }}>{k}</span>
          <span style={{ color: 'var(--white)' }}>{v}</span>
        </div>
      ))}
    </div>
  )
}

function Step4({ data, update, quote, errorMsg }) {
  const p2pAirport = data.service === 'p2p' ? (detectAirport(data.pickup) || detectAirport(data.dropoff)) : null
  const serviceLabel = p2pAirport ? 'Airport Transfer' : SERVICE_LABEL[data.service]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {quote && !quote.custom && (
        <div style={{
          padding: '0.875rem 1rem',
          background: 'var(--gold-glow)',
          border: '1px solid var(--gold-border)',
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontSize: '0.875rem',
          color: 'var(--white)',
        }}>
          Estimated <strong>{formatCurrency(quote.low)}–{formatCurrency(quote.high)}</strong> · {quote.vehicle.label} · {serviceLabel}{data.pickupMode === 'now' ? ' · ASAP' : data.date ? ` · ${formatDate(data.date)} ${data.time}` : ''}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="max-sm:!grid-cols-1">
        <div>
          <FieldLabel>Full name *</FieldLabel>
          <input type="text" value={data.name} onChange={(e) => update({ name: e.target.value })} className="form-field" placeholder="John Smith" autoComplete="name" />
        </div>
        <div>
          <FieldLabel>Phone *</FieldLabel>
          <input type="tel" value={data.phone} onChange={(e) => update({ phone: e.target.value })} className="form-field" placeholder="+44 7XXX XXXXXX" autoComplete="tel" />
        </div>
      </div>
      <div>
        <FieldLabel>Email *</FieldLabel>
        <input type="email" value={data.email} onChange={(e) => update({ email: e.target.value })} className="form-field" placeholder="john@example.com" autoComplete="email" />
      </div>
      <div>
        <FieldLabel hint="Optional">Anything we should know?</FieldLabel>
        <textarea value={data.notes} onChange={(e) => update({ notes: e.target.value })} rows={3} className="form-field" style={{ resize: 'none' }} placeholder="Child seat, return trip, special requirements…" />
      </div>
      {errorMsg && (
        <div style={{
          padding: '0.875rem 1rem',
          border: '1px solid rgba(220,80,80,0.5)',
          background: 'rgba(220,80,80,0.08)',
          color: '#ec9090',
          fontSize: '0.875rem',
        }}>
          {errorMsg}
        </div>
      )}
    </div>
  )
}

function buildSubmissionPayload(data, quote) {
  const pickupApt = data.service === 'p2p' ? detectAirport(data.pickup) : null
  const dropoffApt = data.service === 'p2p' ? detectAirport(data.dropoff) : null
  const detectedAirport = pickupApt || dropoffApt
  const isAirport = data.service === 'p2p' && detectedAirport
  const airportDirection = pickupApt ? 'from' : 'to'
  const otherLocation = pickupApt ? data.dropoff : data.pickup

  const serviceLabel = isAirport ? 'Airport Transfer' : SERVICE_LABEL[data.service]
  const summary = []
  summary.push(`Service: ${serviceLabel}`)
  if (data.service === 'tour') {
    const pkg = TOUR_PACKAGES.find((p) => p.id === data.tour)
    if (pkg) summary.push(`Tour: ${pkg.label} · ${pkg.duration}`)
    if (data.pickup) summary.push(`Pickup: ${data.pickup.name}`)
    if (data.tourNotes) summary.push(`Tour notes: ${data.tourNotes}`)
  }
  if (data.service === 'p2p') {
    if (data.pickup) summary.push(`Pickup: ${data.pickup.name}`)
    if (data.dropoff) summary.push(`Drop-off: ${data.dropoff.name}`)
    if (isAirport && data.flightNumber) summary.push(`Flight: ${data.flightNumber}`)
  }
  if (data.service === 'hourly') {
    summary.push(`Hours: ${data.hours}`)
    if (data.pickup) summary.push(`Pickup: ${data.pickup.name}`)
  }
  if (data.pickupMode === 'now') {
    summary.push('When: As soon as possible')
  } else {
    const verb = data.timeMode === 'arrive' ? 'Arrive by' : 'Pickup at'
    summary.push(`${verb}: ${data.date} ${data.time}`)
  }
  if (quote && !quote.custom) {
    summary.push(`Vehicle: ${quote.vehicle.label} (${quote.vehicle.vehicle})`)
    summary.push(`Estimate: ${formatCurrency(quote.low)}–${formatCurrency(quote.high)}`)
  }
  if (data.notes) summary.push(`Notes: ${data.notes}`)

  return {
    name: data.name,
    email: data.email,
    phone: data.phone,
    service: serviceLabel,
    date: data.pickupMode === 'now' ? 'ASAP' : data.date,
    message: summary.join('\n'),
    booking: {
      service: isAirport ? 'airport' : data.service,
      airport: isAirport ? detectedAirport : null,
      airportDirection: isAirport ? airportDirection : null,
      otherLocation: isAirport ? otherLocation : null,
      flightNumber: isAirport ? (data.flightNumber || null) : null,
      tour: data.tour || null,
      tourNotes: data.tourNotes || null,
      pickup: data.pickup,
      dropoff: data.dropoff,
      hours: data.service === 'hourly' ? data.hours : null,
      vehicle: quote && !quote.custom ? { id: quote.vehicle.id, label: quote.vehicle.label, model: quote.vehicle.vehicle } : null,
      pickupMode: data.pickupMode,
      timeMode: data.timeMode,
      date: data.date,
      time: data.time,
      notes: data.notes,
      quote: quote && !quote.custom ? { low: quote.low, high: quote.high } : null,
    },
  }
}
