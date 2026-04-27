import { STEPS } from './constants'

export default function ProgressBar({ step }) {
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
