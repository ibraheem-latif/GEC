'use client'

import { useEffect, useRef, useState } from 'react'
import { searchPlaces, reverseGeocode, getCurrentPosition } from '@/lib/geocode'
import FieldLabel from './FieldLabel'
import PinIcon from './PinIcon'

export default function LocationField({ label, hint, value, onChange, placeholder, allowMyLocation = false }) {
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
        <input
          type="text"
          value={value.details || ''}
          onChange={(e) => onChange({ ...value, details: e.target.value })}
          className="form-field"
          placeholder="House/flat number, gate code, or notes for driver"
          style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}
        />
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
