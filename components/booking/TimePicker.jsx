import { formatBookingDate, formatHHMM } from '@/lib/scheduling'
import FieldLabel from './FieldLabel'
import { todayISO } from './constants'

export default function TimePicker({ data, update }) {
  const minDate = todayISO()
  const isToday = data.date === minDate
  const minTime = isToday ? formatHHMM(new Date()) : undefined
  const setNow = () => update({ pickupMode: 'now', date: minDate, time: formatHHMM(new Date()), timeMode: 'depart' })
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
              <FieldLabel hint={formatBookingDate(data.date)}>Date</FieldLabel>
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
