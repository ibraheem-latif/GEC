'use client'

import dynamic from 'next/dynamic'
import { formatCurrency } from '@/lib/pricing'
import TripSummary from './TripSummary'

const RouteMap = dynamic(() => import('../RouteMap'), { ssr: false })

export default function Step3Quote({ data, update, quotes, route }) {
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
        <TripSummary data={data} route={route} />
      </div>
    )
  }

  const surcharge = quotes[0]?.breakdown?.find((b) => b.label?.startsWith('Short notice'))

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

      {surcharge && (
        <p style={{
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontSize: '0.85rem',
          color: 'var(--gold)',
          margin: '0 0 0.75rem',
          lineHeight: 1.6,
        }}>
          Includes {surcharge.label.toLowerCase()}: +{formatCurrency(surcharge.amount)}
        </p>
      )}

      <p style={{
        fontFamily: 'var(--font-dm-sans), sans-serif',
        fontSize: '0.85rem',
        color: 'var(--white-dim)',
        margin: '0 0 1.5rem',
        lineHeight: 1.6,
      }}>
        Final fixed price confirmed when we reply. No surge, no surprises.
      </p>

      <TripSummary data={data} route={route} />
    </div>
  )
}
