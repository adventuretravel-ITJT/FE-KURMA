export interface PlaceSubspot {
  name: string
  note: string
  type: 'culture' | 'food' | 'shop'
}

export interface PlaceData {
  id: string
  name: string
  city: string
  cat: string
  photo: string
  drawerPhoto: string
  rating: number
  open: string
  visitTime: string
  price: string
  crowd: string
  reserv: boolean
  mapsUrl: string
  tip: string
  eyebrow: string
  desc: string
  subspots: PlaceSubspot[]
}

export const PLACES: PlaceData[] = [
  {
    id: 'sensoji',
    name: 'Senso-ji Temple',
    city: 'tokyo',
    cat: 'culture',
    photo: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&q=75',
    drawerPhoto: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=900&q=80',
    rating: 4.8,
    open: '06:00–17:00',
    visitTime: '1–2 hours',
    price: 'Free',
    crowd: 'Very busy after 9am',
    reserv: false,
    mapsUrl: 'https://maps.google.com/?q=Senso-ji',
    tip: 'Arrive before 7am for near-empty grounds.',
    eyebrow: 'Culture · Shinto Temple · Asakusa',
    desc: 'Senso-ji adalah kuil tertua di Tokyo, dibangun tahun 628 M. Gerbang Kaminarimon yang ikonik dan lorong Nakamise-dori dengan 50+ kios suvenir menjadikannya salah satu spot paling fotogenik di Jepang.',
    subspots: [
      { name: 'Kaminarimon Gate', note: 'Gerbang raksasa dengan lampion merah — foto terbaik dari arah selatan pagi hari', type: 'culture' },
      { name: 'Nakamise-dori Shopping Lane', note: '50+ kios ningyoyaki, sembei, dan souvenir tradisional. Toko buka pukul 10:00', type: 'shop' },
      { name: 'Senso-ji Main Hall', note: 'Asap dupa diyakini memiliki khasiat penyembuhan — usapkan ke bagian yang sakit', type: 'culture' },
      { name: 'Asakusa Imahan', note: 'Sukiyaki dan shabu-shabu legendaris, buka sejak 1895. ~¥4,000/orang', type: 'food' },
    ],
  },
  {
    id: 'fushimi',
    name: 'Fushimi Inari Taisha',
    city: 'kyoto',
    cat: 'culture',
    photo: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=600&q=75',
    drawerPhoto: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=900&q=80',
    rating: 4.9,
    open: '24 hours',
    visitTime: '2–3 hours',
    price: 'Free',
    crowd: 'Crowded 9am–4pm',
    reserv: false,
    mapsUrl: 'https://maps.google.com/?q=Fushimi+Inari',
    tip: 'Start at 5:30am — the upper trail is yours alone.',
    eyebrow: 'Culture · Shinto Shrine · Fushimi',
    desc: 'Ribuan gerbang torii oranye berjejer membentuk terowongan 4km yang naik ke puncak Gunung Inari (233m). Setiap torii disumbangkan oleh perusahaan atau individu — nama penyumbang terukir di bagian belakang.',
    subspots: [
      { name: 'Senbon Torii', note: 'Dua jalur paralel torii berdesakan — ambil jalur kanan saat naik untuk foto terbaik', type: 'culture' },
      { name: 'Yotsutsuji Intersection', note: 'Titik tengah pendakian (30 mnt dari bawah) — pemandangan seluruh Kyoto terbuka lebar', type: 'culture' },
      { name: 'Okamoto Soba', note: 'Mie soba dan inari-zushi di kaki gunung, buka pagi. ~¥900', type: 'food' },
    ],
  },
  {
    id: 'teamlab',
    name: 'TeamLab Planets',
    city: 'tokyo',
    cat: 'activity',
    photo: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=75',
    drawerPhoto: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=80',
    rating: 4.7,
    open: '10:00–21:00',
    visitTime: '1.5–2 hours',
    price: '¥3,200',
    crowd: 'Always busy — book ahead',
    reserv: true,
    mapsUrl: 'https://maps.google.com/?q=teamLab+Planets',
    tip: 'Book 2 weeks ahead. Tuesday mornings are least crowded.',
    eyebrow: 'Activity · Digital Art · Toyosu',
    desc: 'Instalasi seni digital immersive di 4 ruangan besar — termasuk kolam reflektif setinggi pinggang dengan proyeksi bunga yang bergerak mengikuti tubuhmu. Tidak ada batas antara seni dan pengunjung.',
    subspots: [
      { name: 'Water Area', note: 'Masuk ke kolam dangkal dengan proyeksi 3D — siapkan untuk basah sampai lutut', type: 'culture' },
      { name: 'Floating Flower Garden', note: '10.000 anggrek asli yang melayang — level turun saat kamu berdiri di bawahnya', type: 'culture' },
      { name: 'Soft Black Hole', note: 'Lantai lunak yang tenggelam saat diinjak — banyak yang rebahan di sini', type: 'culture' },
    ],
  },
  {
    id: 'arashiyama',
    name: 'Arashiyama Bamboo Grove',
    city: 'kyoto',
    cat: 'nature',
    photo: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=75',
    drawerPhoto: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=900&q=80',
    rating: 4.6,
    open: 'Always open',
    visitTime: '45–90 min',
    price: 'Free',
    crowd: 'Very crowded 9am–5pm',
    reserv: false,
    mapsUrl: 'https://maps.google.com/?q=Arashiyama',
    tip: 'Before 7am the grove is empty and otherworldly.',
    eyebrow: 'Nature · Bamboo Forest · Arashiyama',
    desc: 'Hutan bambu sepanjang 500m dengan batang menjulang sampai 30m. Suara gemerisik bambu saat angin bertiup masuk dalam daftar 100 Soundscapes of Japan yang harus dijaga.',
    subspots: [
      { name: 'Tenryu-ji Garden', note: 'Taman zen abad ke-14 di pintu masuk Arashiyama — tiket ¥500, worth it', type: 'culture' },
      { name: 'Togetsukyo Bridge', note: 'Jembatan ikonik di atas Sungai Oi — foto terbaik dari tepi timur saat golden hour', type: 'culture' },
      { name: 'Nishiki (Arashiyama)', note: 'Warung matcha latte dan mochi di sepanjang jalan menuju grove. ~¥400–700', type: 'food' },
    ],
  },
  {
    id: 'shibuya',
    name: 'Shibuya Scramble Crossing',
    city: 'tokyo',
    cat: 'activity',
    photo: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&q=75',
    drawerPhoto: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=900&q=80',
    rating: 4.5,
    open: 'Always open',
    visitTime: '30 min',
    price: 'Free',
    crowd: 'Peak at rush hours',
    reserv: false,
    mapsUrl: 'https://maps.google.com/?q=Shibuya',
    tip: "View from Mag's Park rooftop for the best angle.",
    eyebrow: 'Activity · Urban · Shibuya',
    desc: "Persimpangan paling sibuk di dunia — sampai 3.000 orang menyeberang sekaligus saat lampu hijau. Pengalaman kaotik tapi ikonik yang merangkum energi Tokyo dalam satu momen.",
    subspots: [
      { name: "Mag's Park (Shibuya Scramble Square)", note: 'Rooftop lantai 47 — bird-eye view terbaik dari persimpangan. Tiket ¥2,000', type: 'culture' },
      { name: 'Hachiko Statue', note: 'Patung anjia setia Hachiko — meeting point legendaris, selalu ramai. 2 mnt dari scramble', type: 'culture' },
      { name: 'Ichiran Ramen Shibuya', note: 'Makan sendirian di bilik privat — ramen tonkotsu terbaik untuk solo dining. ~¥980', type: 'food' },
    ],
  },
  {
    id: 'nishiki',
    name: 'Nishiki Market',
    city: 'kyoto',
    cat: 'food',
    photo: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=600&q=75',
    drawerPhoto: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=900&q=80',
    rating: 4.5,
    open: '09:00–18:00',
    visitTime: '1–2 hours',
    price: 'Free',
    crowd: 'Busy from 11am',
    reserv: false,
    mapsUrl: 'https://maps.google.com/?q=Nishiki+Market',
    tip: 'Try the dashimaki tamago — still warm from the pan.',
    eyebrow: 'Food · Street Market · Downtown Kyoto',
    desc: 'Pasar sempit sepanjang 400m dengan 100+ kios makanan — dijuluki "Dapur Kyoto" sejak abad ke-17. Dari yuba segar sampai tako-takoyaki, ini adalah tempat terbaik untuk mencicip kuliner lokal Kyoto.',
    subspots: [
      { name: 'Dashimaki Tamago (Fushimi)', note: 'Telur gulung dashi yang masih panas langsung dari pan — ¥200/tusuk', type: 'food' },
      { name: 'Kyoto Pickles (Tsukemono)', note: 'Berbagai acar sayuran khas Kyoto — miso eggplant dan shibazuke wajib dicoba', type: 'shop' },
      { name: 'Yuba Fresh Tofu', note: 'Kulit tahu segar yang dicelup ke dashi — tekstur lembut khas Kyoto. ¥400', type: 'food' },
    ],
  },
  {
    id: 'hakonemuseum',
    name: 'Hakone Open Air Museum',
    city: 'hakone',
    cat: 'culture',
    photo: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&q=75',
    drawerPhoto: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=900&q=80',
    rating: 4.7,
    open: '09:00–17:00',
    visitTime: '2–3 hours',
    price: '¥1,600',
    crowd: 'Moderate',
    reserv: false,
    mapsUrl: 'https://maps.google.com/?q=Hakone+Open+Air+Museum',
    tip: 'The Picasso Pavilion alone justifies the entry fee.',
    eyebrow: 'Culture · Outdoor Museum · Hakone',
    desc: 'Museum outdoor di lereng gunung dengan 120 patung besar dari Rodin, Calder, dan Giacometti tersebar di taman hijau berlatar Gunung Fuji. Satu-satunya museum Picasso di Asia dengan 300+ karya.',
    subspots: [
      { name: 'Picasso Pavilion', note: '300+ karya Picasso dalam satu gedung — koleksi terlengkap di Asia', type: 'culture' },
      { name: 'Symphonic Sculpture (Stained Glass Tower)', note: 'Menara 18m dari kaca patri warna-warni — naik ke puncak untuk efek cahaya yang menakjubkan', type: 'culture' },
      { name: 'Museum Cafe', note: 'Makan siang dengan pemandangan patung dan gunung. Set lunch ¥1,500', type: 'food' },
    ],
  },
  {
    id: 'todaiji',
    name: 'Todai-ji Temple',
    city: 'nara',
    cat: 'culture',
    photo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=75',
    drawerPhoto: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80',
    rating: 4.8,
    open: '07:30–17:30',
    visitTime: '1–2 hours',
    price: '¥600',
    crowd: 'Busy 10am–3pm',
    reserv: false,
    mapsUrl: 'https://maps.google.com/?q=Todai-ji',
    tip: 'The 15m bronze Buddha is awe-inspiring — go early.',
    eyebrow: 'Culture · Buddhist Temple · Nara',
    desc: 'Bangunan kayu terbesar di dunia menaungi Daibutsu — patung Buddha perunggu setinggi 15m yang dibangun tahun 752 M. Rusa jinak berkeliaran bebas di halaman kuil sejak 1.300 tahun lalu.',
    subspots: [
      { name: 'Daibutsuden (Great Hall)', note: 'Gedung kayu terbesar di dunia — Daibutsu di dalamnya terasa overwhelming in the best way', type: 'culture' },
      { name: 'Todai-ji Nandaimon Gate', note: 'Gerbang abad ke-12 dengan dua patung penjaga raksasa setinggi 8m', type: 'culture' },
      { name: 'Nara Park Deer', note: '1.200+ rusa liar berkeliaran bebas — beli shika-senbei (¥200) untuk memberi makan', type: 'culture' },
    ],
  },
  {
    id: 'tsukiji',
    name: 'Tsukiji Outer Market',
    city: 'tokyo',
    cat: 'food',
    photo: 'https://images.unsplash.com/photo-1535587378-f24f2cfce3cd?w=600&q=75',
    drawerPhoto: 'https://images.unsplash.com/photo-1535587378-f24f2cfce3cd?w=900&q=80',
    rating: 4.6,
    open: '05:00–14:00',
    visitTime: '1–2 hours',
    price: 'Free',
    crowd: 'Best before 9am',
    reserv: false,
    mapsUrl: 'https://maps.google.com/?q=Tsukiji',
    tip: 'Get there before 9am for the freshest cuts and no queue.',
    eyebrow: 'Food · Fish Market · Tsukiji',
    desc: 'Pasar seafood outdoor terbesar di Tokyo — meski pasar grosir sudah pindah ke Toyosu, outer market tetap hidup dengan 400+ kios yang menjual sashimi segar, tamagoyaki, dan peralatan masak.',
    subspots: [
      { name: 'Tuna Sashimi Breakfast', note: 'Maguro tebal dipotong langsung dari blok beku — fresh dan murah. ¥600–1,200', type: 'food' },
      { name: 'Tamagoyaki Kios', note: 'Telur gulung dashi manis panas langsung dari cetakan persegi. ¥200–400', type: 'food' },
      { name: 'Tsukiji Sushisei', note: 'Sushi set breakfast kelas atas, antri 30 mnt tapi worth it. ¥2,000–3,000', type: 'food' },
    ],
  },
  {
    id: 'owakudani',
    name: 'Owakudani (Black Eggs)',
    city: 'hakone',
    cat: 'nature',
    photo: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=75',
    drawerPhoto: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80',
    rating: 4.3,
    open: '09:00–17:00',
    visitTime: '1 hour',
    price: '¥1,000 ropeway',
    crowd: 'Check activity status',
    reserv: false,
    mapsUrl: 'https://maps.google.com/?q=Owakudani',
    tip: 'Check volcanic activity status the night before — sometimes closed.',
    eyebrow: 'Nature · Volcanic Valley · Hakone',
    desc: 'Lembah vulkanik aktif di kawah Gunung Hakone dengan asap belerang yang terus mengepul. Telur hitam yang direbus di sumber air panas belerang (kuro-tamago) dipercaya menambah 7 tahun umur per butir.',
    subspots: [
      { name: 'Hakone Ropeway', note: 'Gondola di atas lembah vulkanik — Gunung Fuji terlihat di hari cerah (cek webcam malam sebelumnya)', type: 'culture' },
      { name: 'Kuro-tamago (Black Eggs)', note: '5 butir telur hitam ¥500 — legenda lokal: setiap butir tambah 7 tahun umur', type: 'food' },
      { name: 'Owakudani Walking Trail', note: 'Trail 30 mnt melewati fumarole aktif — ikuti tanda keamanan', type: 'culture' },
    ],
  },
]

export function searchPlaces(query: string, limit = 5): PlaceData[] {
  if (!query.trim()) return []
  const q = query.toLowerCase()
  return PLACES.filter(
    (p) => p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q)
  ).slice(0, limit)
}

export function getPlace(id: string): PlaceData | undefined {
  return PLACES.find((p) => p.id === id)
}
