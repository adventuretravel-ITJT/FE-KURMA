export interface ActivityFile {
  name: string
  type: string
  size: string
}

export interface Activity {
  id: string
  type: 'activity' | 'transport' | 'place' | 'hotel'
  name: string
  time?: string
  cost?: number
  costCurr?: string
  costFmt?: string
  cat?: string
  note?: string
  bookingRef?: string
  files?: ActivityFile[]
  rating?: string
  tip?: string
  // transport-specific
  mode?: string
  from?: string
  fromName?: string
  to?: string
  toName?: string
  departs?: string
  dur?: string
  // place-specific
  placeId?: string
}

export interface Day {
  id: string
  num: number
  label: string
  date?: string
  city: string
  acts: Activity[]
}

export interface ItineraryData {
  days: Day[]
  cities: string[]
  currency: string
}

export interface QuizData {
  activities: string[]
  pace: string
  budget: string
  special_needs: string[]
  adults: number
  kids: number
  littles: number
  links?: { url: string; title: string }[]
}

export interface Trip {
  id: number
  name: string
  destination: string
  destination_flag?: string
  travel_type: string
  status: string
  start_date?: string
  end_date?: string
  quiz_data?: QuizData
  itinerary_data?: ItineraryData
  created_at?: string
}

export interface WeatherData {
  city: string
  temp: number
  tempMax: number
  tempMin: number
  code: number
  emoji: string
  desc: string
  windspeed: number
}

export type CurrencyCode = 'IDR' | 'JPY' | 'USD' | 'EUR' | 'SGD' | 'MYR' | 'THB' | 'GBP' | 'AUD'

export const RATES_TO_IDR: Record<CurrencyCode, number> = {
  IDR: 1,
  JPY: 104,
  USD: 16400,
  EUR: 17800,
  SGD: 12200,
  MYR: 3500,
  THB: 470,
  GBP: 21000,
  AUD: 10500,
}

export const CURRENCIES: { code: CurrencyCode; symbol: string; name: string; flag: string }[] = [
  { code: 'IDR', symbol: 'Rp',  name: 'Indonesian Rupiah', flag: '🇮🇩' },
  { code: 'JPY', symbol: '¥',   name: 'Japanese Yen',      flag: '🇯🇵' },
  { code: 'USD', symbol: '$',   name: 'US Dollar',         flag: '🇺🇸' },
  { code: 'EUR', symbol: '€',   name: 'Euro',              flag: '🇪🇺' },
  { code: 'SGD', symbol: 'S$',  name: 'Singapore Dollar',  flag: '🇸🇬' },
  { code: 'MYR', symbol: 'RM',  name: 'Malaysian Ringgit', flag: '🇲🇾' },
  { code: 'THB', symbol: '฿',   name: 'Thai Baht',         flag: '🇹🇭' },
  { code: 'GBP', symbol: '£',   name: 'British Pound',     flag: '🇬🇧' },
  { code: 'AUD', symbol: 'A$',  name: 'Australian Dollar', flag: '🇦🇺' },
]
