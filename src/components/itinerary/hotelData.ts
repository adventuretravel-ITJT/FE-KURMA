export interface HotelData {
  name: string
  photo: string
  stars: number
  brief: string
  location: string
  distanceNote: string
  priceJPY: number
}

export const HOTELS: Record<string, HotelData> = {
  tokyo: {
    name: 'Shinjuku Granbell Hotel',
    photo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=75',
    stars: 4,
    brief: 'Boutique design hotel in the heart of Shinjuku. Walking distance to metro, Kabukicho, and major train lines. Compact rooms, great rooftop bar.',
    location: 'Shinjuku, Tokyo',
    distanceNote: '5 min walk to Shinjuku Station',
    priceJPY: 14800,
  },
  hakone: {
    name: 'Ryokan Tensui',
    photo: 'https://images.unsplash.com/photo-1540541338537-1220205f5f9e?w=600&q=75',
    stars: 4,
    brief: 'Traditional ryokan perched above Hakone-Yumoto hot spring valley. Includes kaiseki dinner and private onsen bath. Book 3 weeks in advance.',
    location: 'Hakone-Yumoto, Kanagawa',
    distanceNote: '7 min from Hakone-Yumoto Station',
    priceJPY: 28000,
  },
  kyoto: {
    name: 'Kyoto Granbell Hotel',
    photo: 'https://images.unsplash.com/photo-1605346576517-0e3d5eaf4db1?w=600&q=75',
    stars: 4,
    brief: 'Contemporary hotel steps from Kyoto Station. Sleek minimalist rooms, easy access to Fushimi Inari and Nishiki Market. Great rooftop views.',
    location: 'Shimogyo, Kyoto',
    distanceNote: '3 min walk to Kyoto Station',
    priceJPY: 13500,
  },
  osaka: {
    name: 'Cross Hotel Osaka',
    photo: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=600&q=75',
    stars: 4,
    brief: 'Hip boutique hotel in Namba, Osaka\'s entertainment district. Steps from Dotonbori, great local food scene, and easy rail connections.',
    location: 'Namba, Osaka',
    distanceNote: '5 min walk to Namba Station',
    priceJPY: 12000,
  },
  nara: {
    name: 'Nara Hotel',
    photo: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=600&q=75',
    stars: 4,
    brief: 'Historic landmark hotel built in 1909 overlooking Nara Park. Classic Western-Japanese architecture, deer may visit the garden.',
    location: 'Nara Park, Nara',
    distanceNote: '10 min walk to Todai-ji',
    priceJPY: 18000,
  },
}

export function getHotel(city: string): HotelData | null {
  return HOTELS[city.toLowerCase()] ?? null
}
