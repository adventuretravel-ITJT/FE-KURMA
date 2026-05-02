export interface CityTip {
  icon: string
  title: string
  note: string
}

export interface CityEat {
  name: string
  price: string
}

export interface CityInfo {
  name: string
  kanji?: string
  country: string
  flag: string
  icon: string
  lat: number
  lon: number
  /** 0-indexed month numbers where 0=Jan. Best months = optimal travel. */
  bestMonths: number[]
  okMonths: number[]
  season: string
  desc: string
  checklist: string[]
  tips: CityTip[]
  eats: CityEat[]
}

export const CITY_DATA: Record<string, CityInfo> = {
  tokyo: {
    name: 'Tokyo', kanji: '東京', country: 'Japan', flag: '🗾',
    icon: '⛅', lat: 35.6762, lon: 139.6503,
    bestMonths: [2, 3, 9, 10],
    okMonths: [0, 1, 4, 11],
    season: 'Spring & Autumn',
    desc: 'Cherry blossoms peak late March–early April. Autumn colors in November. Crowds are dense but the city is electric.',
    checklist: ['JR Pass (printed / digital)', 'Suica IC Card topped up', 'Cash yen in wallet', 'Pocket WiFi / SIM active'],
    tips: [
      { icon: '🚇', title: 'Get a Suica Card', note: 'Works on metro, buses, and convenience stores.' },
      { icon: '🕗', title: 'Beat the Crowds', note: 'Senso-ji before 8am is a completely different experience.' },
      { icon: '🏪', title: '7-Eleven is Your Friend', note: 'Onigiri, egg salad sandos — all under 300 yen.' },
    ],
    eats: [
      { name: 'Ichiran Tonkotsu Ramen', price: '¥980' },
      { name: 'Tsukiji Tuna Sashimi', price: '¥600–1,200' },
      { name: 'Yakitori Izakaya', price: '¥2,000/head' },
      { name: 'Tamago Sando', price: '¥240' },
    ],
  },
  hakone: {
    name: 'Hakone', kanji: '箱根', country: 'Japan', flag: '🗾',
    icon: '🌤️', lat: 35.2328, lon: 139.1062,
    bestMonths: [2, 3, 9, 10],
    okMonths: [0, 1, 4, 5, 11],
    season: 'All year',
    desc: 'Mt. Fuji only visible on clear mornings. Book ryokan well in advance. Hot springs all year round.',
    checklist: ['Hakone Free Pass bought', 'Ryokan booked', 'Ropeway webcam checked', 'Onsen towel ready'],
    tips: [
      { icon: '🌄', title: 'Fuji Visibility', note: 'Check the ropeway webcam the night before.' },
      { icon: '♨️', title: 'Onsen Etiquette', note: 'No tattoos in most public baths.' },
      { icon: '🎟️', title: 'Hakone Free Pass', note: '¥6,500 from Shinjuku — covers ropeway, train, bus.' },
    ],
    eats: [
      { name: 'Black Egg (Owakudani)', price: '¥500/5' },
      { name: 'Kaiseki at Ryokan', price: 'Included' },
      { name: 'Yuba (tofu skin)', price: '¥1,200–1,800' },
    ],
  },
  kyoto: {
    name: 'Kyoto', kanji: '京都', country: 'Japan', flag: '🗾',
    icon: '🍂', lat: 35.0116, lon: 135.7681,
    bestMonths: [2, 3, 9, 10],
    okMonths: [0, 1, 4, 11],
    season: 'Spring & Autumn',
    desc: 'Stunning in peak season. Stay 4+ nights — Kyoto rewards slow exploration.',
    checklist: ['Bus Day Pass (¥700)', 'Kaiseki reservation', 'Tea ceremony booked', 'Fushimi alarm 5:30am', 'Return Shinkansen booked'],
    tips: [
      { icon: '📸', title: 'Fushimi at Dawn', note: "The torii trail at 5:30am is one of Japan's great experiences." },
      { icon: '🚌', title: 'Bus Day Pass', note: '¥700/day — covers Kinkaku-ji, Ryoan-ji, Nishiki, Gion.' },
      { icon: '🍵', title: 'Tea Ceremony', note: '45-min experience in Higashiyama for ~¥2,500.' },
    ],
    eats: [
      { name: 'Kaiseki (Pontocho)', price: '¥12,000+' },
      { name: 'Yudofu (tofu pot)', price: '¥2,500' },
      { name: 'Matcha soft serve', price: '¥400' },
      { name: 'Obanzai set lunch', price: '¥1,500' },
    ],
  },
  osaka: {
    name: 'Osaka', kanji: '大阪', country: 'Japan', flag: '🗾',
    icon: '🌆', lat: 34.6937, lon: 135.5023,
    bestMonths: [2, 3, 9, 10],
    okMonths: [0, 1, 4, 11],
    season: 'Spring & Autumn',
    desc: "Japan's kitchen — Osaka is all about food, fun, and nightlife.",
    checklist: ['Osaka Amazing Pass', 'Book Dotonbori table', 'Cash for street food'],
    tips: [
      { icon: '🦑', title: 'Takoyaki Everywhere', note: 'The best are from Wanaka in Dotonbori.' },
      { icon: '🏯', title: 'Osaka Castle', note: 'Free entry to grounds. Museum inside ¥600.' },
      { icon: '🎡', title: 'USJ', note: 'Book Harry Potter tickets well in advance.' },
    ],
    eats: [
      { name: 'Takoyaki (Wanaka)', price: '¥550/6' },
      { name: 'Kushikatsu (Daruma)', price: '¥1,200+' },
      { name: 'Okonomiyaki', price: '¥800–1,500' },
    ],
  },
  nara: {
    name: 'Nara', kanji: '奈良', country: 'Japan', flag: '🗾',
    icon: '🌸', lat: 34.6851, lon: 135.8048,
    bestMonths: [2, 3, 9, 10],
    okMonths: [0, 1, 4, 11],
    season: 'Spring & Autumn',
    desc: 'Comfortable year-round. November turns Nara Park into a golden carpet.',
    checklist: ['Todai-ji entry (¥600)', 'Shika-senbei crackers', 'Kintetsu ticket to Kyoto'],
    tips: [
      { icon: '🦌', title: 'Deer Boundaries', note: 'Bow and it bows back. Keep food hidden.' },
      { icon: '⏱️', title: 'Half-Day Is Enough', note: 'Todai-ji, Kasuga Taisha, park in 4–5 hrs.' },
      { icon: '🏮', title: 'Naramachi Quarter', note: 'Quiet merchant lanes with great matcha cafes.' },
    ],
    eats: [
      { name: 'Kakinoha-zushi', price: '¥800' },
      { name: 'Kuzumochi', price: '¥600' },
      { name: 'Miwa Somen noodles', price: '¥1,000' },
    ],
  },
  bangkok: {
    name: 'Bangkok', country: 'Thailand', flag: '🇹🇭',
    icon: '☀️', lat: 13.7563, lon: 100.5018,
    bestMonths: [10, 11, 0, 1],
    okMonths: [2, 3, 9],
    season: 'Cool & Dry Season',
    desc: 'Best Nov–Feb when it\'s cool and dry. Avoid May–Oct (rainy season).',
    checklist: ['Grab app installed', 'BTS Rabbit Card', 'Temple dress code (cover shoulders/knees)', 'Cash baht'],
    tips: [
      { icon: '🛺', title: 'Grab over Tuk-tuk', note: 'Use Grab app for metered, safe rides.' },
      { icon: '🕌', title: 'Temple Etiquette', note: 'Cover shoulders and knees. Remove shoes inside.' },
      { icon: '🌙', title: 'Night Markets', note: 'Chatuchak on weekends, Asiatique on the riverfront.' },
    ],
    eats: [
      { name: 'Pad Thai (street)', price: '฿60–120' },
      { name: 'Tom Yum Goong', price: '฿150–300' },
      { name: 'Mango Sticky Rice', price: '฿60–100' },
    ],
  },
  singapore: {
    name: 'Singapore', country: 'Singapore', flag: '🇸🇬',
    icon: '⛅', lat: 1.3521, lon: 103.8198,
    bestMonths: [1, 2, 6, 7],
    okMonths: [0, 3, 4, 5],
    season: 'Year-round',
    desc: 'Tropical city — warm year-round. Heaviest rain in Nov–Jan.',
    checklist: ['Ez-Link card for MRT', 'Hawker center cash', 'Grab app', 'Check heritage site hours'],
    tips: [
      { icon: '🍜', title: 'Hawker Centres', note: 'Lau Pa Sat, Maxwell, Old Airport Road — best cheap food.' },
      { icon: '🌿', title: 'Gardens by the Bay', note: 'Free outside. Supertree Show at 7:45pm & 8:45pm.' },
      { icon: '🚇', title: 'MRT is Excellent', note: 'Clean, air-conditioned, covers everywhere tourists go.' },
    ],
    eats: [
      { name: 'Chicken Rice (Tian Tian)', price: 'S$5–8' },
      { name: 'Laksa (328 Katong)', price: 'S$7–10' },
      { name: 'Chilli Crab', price: 'S$50–80/kg' },
    ],
  },
  bali: {
    name: 'Bali', country: 'Indonesia', flag: '🇮🇩',
    icon: '🌴', lat: -8.4095, lon: 115.1889,
    bestMonths: [4, 5, 6, 7, 8, 9],
    okMonths: [3, 10],
    season: 'Dry Season',
    desc: 'Dry season May–Oct is best. Dec–Mar is wet but lush and less crowded.',
    checklist: ['Driver pre-booked (GrabCar limited)', 'Cash rupiah for temples', 'Sarong for temple entry', 'Mosquito repellent'],
    tips: [
      { icon: '🏍️', title: 'Rent a Scooter', note: 'Best way to explore Ubud and rice terraces.' },
      { icon: '🌅', title: 'Sunrise at Agung', note: 'Start at 2am — worth every tired step.' },
      { icon: '💆', title: 'Massage Culture', note: 'Traditional Balinese massage for Rp80,000–150,000/hr.' },
    ],
    eats: [
      { name: 'Babi Guling (Ibu Oka)', price: 'Rp50,000–80,000' },
      { name: 'Nasi Campur', price: 'Rp30,000–60,000' },
      { name: 'Bebek Betutu', price: 'Rp80,000–150,000' },
    ],
  },
  seoul: {
    name: 'Seoul', country: 'South Korea', flag: '🇰🇷',
    icon: '🌤️', lat: 37.5665, lon: 126.9780,
    bestMonths: [3, 4, 9, 10],
    okMonths: [2, 5, 8, 11],
    season: 'Spring & Autumn',
    desc: 'Cherry blossoms in April, autumn foliage in October. Winters are very cold.',
    checklist: ['T-money card for subway', 'Naver Maps (better than Google)', 'Korean won cash', 'Power bank'],
    tips: [
      { icon: '🚇', title: 'Subway is Superb', note: 'Extensive, cheap, and has free WiFi onboard.' },
      { icon: '🛍️', title: 'Dongdaemun at Night', note: 'Fashion market open from midnight — unique experience.' },
      { icon: '🧖', title: 'Jimjilbang', note: '24h sauna-bathhouse for Rp60,000 — sleep there too.' },
    ],
    eats: [
      { name: 'Korean BBQ (Samgyeopsal)', price: '₩15,000–25,000/person' },
      { name: 'Bibimbap', price: '₩8,000–12,000' },
      { name: 'Tteokbokki (street)', price: '₩3,000–5,000' },
    ],
  },
  paris: {
    name: 'Paris', country: 'France', flag: '🇫🇷',
    icon: '🌸', lat: 48.8566, lon: 2.3522,
    bestMonths: [3, 4, 5, 8, 9],
    okMonths: [2, 6, 7, 10],
    season: 'Spring & Autumn',
    desc: 'Spring (Apr–Jun) and autumn (Sep–Oct) are ideal. July–Aug is touristy but pleasant.',
    checklist: ['Metro Navigo pass', 'Museum Pass (if doing many museums)', 'Book dinner reservations', 'Pocket picnic gear'],
    tips: [
      { icon: '🗼', title: 'Eiffel at Night', note: 'The light show at 10pm (every hour) is free and stunning.' },
      { icon: '🥐', title: 'Boulangerie Breakfast', note: 'Skip hotel breakfast — get a croissant for €1.20.' },
      { icon: '🎨', title: 'Musée d\'Orsay', note: 'Less crowded than Louvre, equally impressive Impressionism.' },
    ],
    eats: [
      { name: 'Croissant au beurre', price: '€1.20–2' },
      { name: 'Steak-frites (brasserie)', price: '€18–28' },
      { name: 'Crêpe (street)', price: '€3–6' },
    ],
  },
  london: {
    name: 'London', country: 'United Kingdom', flag: '🇬🇧',
    icon: '⛅', lat: 51.5074, lon: -0.1278,
    bestMonths: [4, 5, 6, 7],
    okMonths: [3, 8, 9],
    season: 'Summer',
    desc: 'Best Jun–Aug. Winter is cold and gray but very atmospheric.',
    checklist: ['Oyster card or contactless payment', 'Museum free entry (most are free!)', 'Umbrella always', 'Book Tower of London tickets online'],
    tips: [
      { icon: '🎭', title: 'Free Museums', note: 'British Museum, National Gallery, V&A — all free.' },
      { icon: '🚇', title: 'Contactless Works', note: 'Tap your bank card on the London Underground.' },
      { icon: '☕', title: 'Pub Culture', note: 'Have a Sunday roast at a real London pub — unmissable.' },
    ],
    eats: [
      { name: 'Fish & Chips', price: '£10–15' },
      { name: 'Sunday Roast (pub)', price: '£16–22' },
      { name: 'Borough Market lunch', price: '£8–15' },
    ],
  },
  rome: {
    name: 'Rome', country: 'Italy', flag: '🇮🇹',
    icon: '☀️', lat: 41.9028, lon: 12.4964,
    bestMonths: [3, 4, 9, 10],
    okMonths: [2, 5, 8],
    season: 'Spring & Autumn',
    desc: 'Apr–May and Sep–Oct are ideal. July–Aug is extremely hot and crowded.',
    checklist: ['Pre-book Vatican & Colosseum', 'Dress code for churches (cover shoulders)', 'Cash euros for small trattorias', 'Roma Pass (if doing many sites)'],
    tips: [
      { icon: '🏛️', title: 'Colosseum Early', note: 'Book the first entry slot (9am) to beat crowds.' },
      { icon: '🍕', title: 'Trastevere for Food', note: 'Best neighborhood for authentic Roman cuisine.' },
      { icon: '🚿', title: 'Drink the Nasoni', note: 'Street fountains (nasoni) have clean, cold drinking water.' },
    ],
    eats: [
      { name: 'Cacio e Pepe (Tonnarello)', price: '€12–16' },
      { name: 'Supplì (street)', price: '€1.50–2' },
      { name: 'Gelato (Giolitti)', price: '€2.50–4' },
    ],
  },
  dubai: {
    name: 'Dubai', country: 'UAE', flag: '🇦🇪',
    icon: '☀️', lat: 25.2048, lon: 55.2708,
    bestMonths: [10, 11, 0, 1, 2],
    okMonths: [3, 9],
    season: 'Winter (Oct–Mar)',
    desc: 'Oct–Mar is pleasant (20–28°C). Summer (Jun–Sep) is extreme heat (+45°C) — only for mall-hoppers.',
    checklist: ['Nol card for metro', 'Dress modestly in public', 'Dubai Frame / Burj tickets pre-booked', 'Desert safari pre-booked'],
    tips: [
      { icon: '🌇', title: 'Burj Khalifa At Sunrise', note: 'Sunrise slot (before 9am) is cheaper and less crowded.' },
      { icon: '🧕', title: 'Respect Local Culture', note: 'Cover up in malls, markets, and public areas.' },
      { icon: '🏖️', title: 'JBR Beach', note: 'Free public beach with skyline views. Best in the morning.' },
    ],
    eats: [
      { name: 'Shawarma (Ravi Restaurant)', price: 'AED 10–15' },
      { name: 'Luqaimat (street)', price: 'AED 5–10' },
      { name: 'Seafood (Deira Fish Market)', price: 'AED 40–80' },
    ],
  },
  istanbul: {
    name: 'Istanbul', country: 'Turkey', flag: '🇹🇷',
    icon: '⛅', lat: 41.0082, lon: 28.9784,
    bestMonths: [3, 4, 5, 8, 9],
    okMonths: [2, 6, 7, 10],
    season: 'Spring & Autumn',
    desc: 'Spring (Apr–Jun) and autumn (Sep–Oct) are best. Summers are busy and hot.',
    checklist: ['Istanbulkart for transport', 'Museum Pass (covers Topkapi, Hagia Sophia)', 'Cash lira for bazaars', 'Modest dress for mosques'],
    tips: [
      { icon: '🕌', title: 'Hagia Sophia at Opening', note: 'Arrive at 9am to avoid the midday rush.' },
      { icon: '☕', title: 'Turkish Tea Culture', note: 'Çay (tea) is served free everywhere — never refuse.' },
      { icon: '🛒', title: 'Grand Bazaar Haggling', note: 'First offer is always 3× the real price.' },
    ],
    eats: [
      { name: 'Balık Ekmek (fish sandwich)', price: '₺80–120' },
      { name: 'Simit (street pretzel)', price: '₺10–15' },
      { name: 'Iskender Kebab', price: '₺300–450' },
    ],
  },
  sydney: {
    name: 'Sydney', country: 'Australia', flag: '🇦🇺',
    icon: '☀️', lat: -33.8688, lon: 151.2093,
    bestMonths: [2, 3, 9, 10, 11],
    okMonths: [0, 1, 4, 8],
    season: 'Autumn & Spring',
    desc: 'Mar–May and Sep–Nov are ideal. Dec–Feb (summer) is hot and peak season.',
    checklist: ['Opal card for transport', 'Sunscreen always', 'Pre-book Blue Mountains tour', 'Ferry Hop-on to Manly'],
    tips: [
      { icon: '🚢', title: 'Manly Ferry', note: '30-min ferry from Circular Quay — best Sydney harbour view.' },
      { icon: '🏄', title: 'Bondi to Coogee Walk', note: '6km coastal walk with stunning clifftop views.' },
      { icon: '🦘', title: 'Wildlife Parks', note: 'Featherdale Wildlife Park is the best for kangaroos + koalas.' },
    ],
    eats: [
      { name: 'Flat White (coffee)', price: 'A$5–6' },
      { name: 'Fish & Chips (Doyles)', price: 'A$18–28' },
      { name: 'Brunch (any cafe)', price: 'A$15–25' },
    ],
  },
}

/** Map a trip destination name → default city slug */
export const DESTINATION_TO_CITY: Record<string, string> = {
  Japan: 'tokyo',
  Thailand: 'bangkok',
  Singapore: 'singapore',
  Indonesia: 'bali',
  'South Korea': 'seoul',
  France: 'paris',
  'United Kingdom': 'london',
  Italy: 'rome',
  UAE: 'dubai',
  Turkey: 'istanbul',
  Australia: 'sydney',
}

export function getCityInfo(citySlug: string): CityInfo | null {
  return CITY_DATA[citySlug] ?? null
}

export const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export type MonthRating = 'best' | 'ok' | 'avoid'

export function getMonthRating(city: CityInfo, monthIdx: number): MonthRating {
  if (city.bestMonths.includes(monthIdx)) return 'best'
  if (city.okMonths.includes(monthIdx)) return 'ok'
  return 'avoid'
}
