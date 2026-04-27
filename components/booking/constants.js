export const STORAGE_KEY = 'gec.booking.draft'
export const STORAGE_VERSION = 5

export const STEPS = [
  { id: 1, label: 'Service' },
  { id: 2, label: 'Trip' },
  { id: 3, label: 'Quote' },
  { id: 4, label: 'Details' },
]

export const SERVICE_CARDS = [
  { id: 'p2p', title: 'Point-to-Point', subtitle: 'Airports, hotels, anywhere in Scotland.' },
  { id: 'hourly', title: 'By the Hour', subtitle: 'As-directed · 4hr minimum.' },
  { id: 'tour', title: 'Scotland Tour', subtitle: 'Highlands, Loch Lomond, beyond.' },
]

export const SERVICE_LABEL = {
  p2p: 'Point-to-Point',
  hourly: 'By the Hour',
  tour: 'Scotland Tour',
}

export const initialData = (defaultService) => ({
  service: defaultService || '',
  flightNumber: '',
  pickup: null,
  dropoff: null,
  tour: '',
  tourNotes: '',
  hours: 4,
  vehicle: 'business',
  pickupMode: 'schedule',
  timeMode: 'depart',
  date: '',
  time: '',
  name: '',
  email: '',
  phone: '',
  notes: '',
})

export const todayISO = () => new Date().toISOString().split('T')[0]
