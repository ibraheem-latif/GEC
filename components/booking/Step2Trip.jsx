'use client'

import dynamic from 'next/dynamic'
import { TOUR_PACKAGES, detectAirport, formatCurrency } from '@/lib/pricing'
import FieldLabel from './FieldLabel'
import LocationField from './LocationField'
import Stepper from './Stepper'
import TimePicker from './TimePicker'

const TripMap = dynamic(() => import('../TripMap'), { ssr: false })

export default function Step2Trip({ data, update }) {
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
      {data.pickup?.coords && (
        <TripMap
          points={[
            { key: 'pickup', label: 'A', color: '#C4A55A', value: data.pickup, onChange: (v) => update({ pickup: v }) },
          ]}
        />
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
      {(data.pickup?.coords || data.dropoff?.coords) && (
        <TripMap
          points={[
            { key: 'pickup', label: 'A', color: '#C4A55A', value: data.pickup, onChange: (v) => update({ pickup: v }) },
            { key: 'dropoff', label: 'B', color: '#F0EDE6', value: data.dropoff, onChange: (v) => update({ dropoff: v }) },
          ]}
        />
      )}
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
      {data.pickup?.coords && (
        <TripMap
          points={[
            { key: 'pickup', label: 'A', color: '#C4A55A', value: data.pickup, onChange: (v) => update({ pickup: v }) },
          ]}
        />
      )}
    </div>
  )
}
