import { NextRequest, NextResponse } from 'next/server'

const WMO_CODES: Record<number, { desc: string; emoji: string }> = {
  0:  { desc: 'Clear sky',         emoji: '☀️'  },
  1:  { desc: 'Mainly clear',      emoji: '🌤️' },
  2:  { desc: 'Partly cloudy',     emoji: '⛅'  },
  3:  { desc: 'Overcast',          emoji: '☁️'  },
  45: { desc: 'Foggy',             emoji: '🌫️' },
  48: { desc: 'Depositing fog',    emoji: '🌫️' },
  51: { desc: 'Light drizzle',     emoji: '🌦️' },
  53: { desc: 'Drizzle',           emoji: '🌦️' },
  55: { desc: 'Heavy drizzle',     emoji: '🌧️' },
  61: { desc: 'Light rain',        emoji: '🌧️' },
  63: { desc: 'Rain',              emoji: '🌧️' },
  65: { desc: 'Heavy rain',        emoji: '🌧️' },
  71: { desc: 'Light snow',        emoji: '❄️'  },
  73: { desc: 'Snow',              emoji: '❄️'  },
  75: { desc: 'Heavy snow',        emoji: '🌨️' },
  80: { desc: 'Rain showers',      emoji: '🌦️' },
  81: { desc: 'Showers',           emoji: '🌦️' },
  82: { desc: 'Violent showers',   emoji: '⛈️'  },
  95: { desc: 'Thunderstorm',      emoji: '⛈️'  },
  99: { desc: 'Heavy thunderstorm',emoji: '⛈️'  },
}

function getWMO(code: number) {
  return WMO_CODES[code] ?? { desc: 'Unknown', emoji: '🌡️' }
}

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get('city')
  if (!city) return NextResponse.json({ error: 'city required' }, { status: 400 })

  try {
    // Step 1: geocode
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`,
      { next: { revalidate: 3600 } }
    )
    const geoData = await geoRes.json()
    const loc = geoData?.results?.[0]
    if (!loc) return NextResponse.json({ error: 'City not found' }, { status: 404 })

    const { latitude, longitude, name } = loc

    // Step 2: fetch weather
    const wxRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode,windspeed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=1`,
      { next: { revalidate: 1800 } }
    )
    const wx = await wxRes.json()

    const code      = wx.current?.weathercode ?? 0
    const wmo       = getWMO(code)
    const temp      = Math.round(wx.current?.temperature_2m ?? 0)
    const windspeed = Math.round(wx.current?.windspeed_10m ?? 0)
    const tempMax   = Math.round(wx.daily?.temperature_2m_max?.[0] ?? temp + 2)
    const tempMin   = Math.round(wx.daily?.temperature_2m_min?.[0] ?? temp - 3)

    return NextResponse.json({
      city: name,
      temp,
      tempMax,
      tempMin,
      code,
      emoji: wmo.emoji,
      desc:  wmo.desc,
      windspeed,
    })
  } catch {
    return NextResponse.json({ error: 'Weather fetch failed' }, { status: 500 })
  }
}
