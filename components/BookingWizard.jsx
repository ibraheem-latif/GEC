'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { EMAIL } from '@/lib/seo'
import { calculateQuotes, findQuote } from '@/lib/pricing'
import { getRoute } from '@/lib/routing'
import { checkScheduleFreshness } from '@/lib/scheduling'
import ProgressBar from './booking/ProgressBar'
import Step1Service from './booking/Step1Service'
import Step2Trip from './booking/Step2Trip'
import Step3Quote from './booking/Step3Quote'
import Step4Details from './booking/Step4Details'
import { STEPS, STORAGE_KEY, STORAGE_VERSION, initialData } from './booking/constants'
import { buildSubmissionPayload } from './booking/payload'

export default function BookingWizard({ defaultService = '' }) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState(() => initialData(defaultService))
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [hydrated, setHydrated] = useState(false)

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
            service: defaultService || rest.service || '',
          }))
        } else {
          localStorage.removeItem(STORAGE_KEY)
        }
      }
    } catch {}
    setHydrated(true)
  }, [defaultService])

  useEffect(() => {
    if (!hydrated) return
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ __v: STORAGE_VERSION, ...data })) } catch {}
  }, [data, hydrated])

  const update = useCallback((patch) => {
    setData((prev) => ({ ...prev, ...patch }))
  }, [])

  const step2Valid = useMemo(() => {
    if (!data.date || !data.time) return false
    if (data.service === 'tour') return Boolean(data.tour && data.pickup)
    if (data.service === 'p2p') return Boolean(data.pickup && data.dropoff)
    if (data.service === 'hourly') return Boolean(data.pickup && data.hours >= 4)
    return false
  }, [data])

  // Tick once a minute so live-derived state (surcharge tier, freshness check)
  // reflects the wall clock if a tab has been left open.
  const [nowTs, setNowTs] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNowTs(Date.now()), 60_000)
    return () => clearInterval(id)
  }, [])

  const quotes = useMemo(() => calculateQuotes(data, new Date(nowTs)), [data, nowTs])
  const quote = useMemo(() => findQuote(quotes, data.vehicle), [quotes, data.vehicle])

  const [route, setRoute] = useState(null)
  const pickupCoordKey = data.pickup?.coords ? data.pickup.coords.join(',') : ''
  const dropoffCoordKey = data.dropoff?.coords ? data.dropoff.coords.join(',') : ''
  useEffect(() => {
    if (!pickupCoordKey || !dropoffCoordKey) { setRoute(null); return }
    const ctrl = new AbortController()
    const t = setTimeout(() => {
      getRoute(data.pickup.coords, data.dropoff.coords, { signal: ctrl.signal })
        .then((r) => {
          if (!r || ctrl.signal.aborted) return
          setRoute((prev) => (prev?.durationSeconds === r.durationSeconds ? prev : r))
        })
        .catch(() => {})
    }, 300)
    return () => { clearTimeout(t); ctrl.abort() }
  }, [pickupCoordKey, dropoffCoordKey])

  const step4Valid = useMemo(() => {
    return Boolean(data.name.trim() && data.email.trim() && data.phone.trim() &&
      /\S+@\S+\.\S+/.test(data.email))
  }, [data])

  const staleMsg = useMemo(() => checkScheduleFreshness(data, new Date(nowTs)), [data, nowTs])

  const handleSubmit = async () => {
    const stale = checkScheduleFreshness(data)
    if (stale) {
      setErrorMsg(stale)
      setNowTs(Date.now())
      return
    }
    setSubmitting(true)
    setErrorMsg('')
    try {
      const payload = buildSubmissionPayload(data, quote, route)
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
        {step === 1 && <Step1Service data={data} update={update} onPick={() => setStep(2)} />}
        {step === 2 && <Step2Trip data={data} update={update} />}
        {step === 3 && <Step3Quote data={data} update={update} quotes={quotes} route={route} />}
        {step === 4 && <Step4Details data={data} update={update} quote={quote} route={route} errorMsg={errorMsg || staleMsg} />}
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
              disabled={!step4Valid || submitting || !!staleMsg}
              style={{ opacity: step4Valid && !submitting && !staleMsg ? 1 : 0.5, cursor: step4Valid && !submitting && !staleMsg ? 'pointer' : 'not-allowed' }}
              onClick={handleSubmit}
            >
              {submitting ? 'Sending…' : staleMsg ? 'Update time to continue' : 'Submit booking request'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
