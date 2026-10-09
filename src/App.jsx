
import { useState } from 'react'

function getWeatherDescription(code) {
  if (code === 0) return 'Clear sky'
  if (code === 1) return 'Mainly clear'
  if (code === 2) return 'Partly cloudy'
  if (code === 3) return 'Overcast'
  if ([45, 48].includes(code)) return 'Fog'
  if ([51, 53, 55, 56, 57].includes(code)) return 'Drizzle'
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Rain'
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Snow'
  if ([95, 96, 99].includes(code)) return 'Thunderstorm'

  return 'Unknown conditions'
}

function getWeatherIcon(code) {
  if (code === 0) return '☀️'
  if ([1, 2].includes(code)) return '🌤️'
  if (code === 3) return '☁️'
  if ([45, 48].includes(code)) return '🌫️'
  if ([51, 53, 55, 56, 57].includes(code)) return '🌦️'
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return '🌧️'
  if ([71, 73, 75, 77, 85, 86].includes(code)) return '❄️'
  if ([95, 96, 99].includes(code)) return '⛈️'

  return '🌡️'
}

function App() {
  const [city, setCity] = useState('Chennai')
const [weather, setWeather] = useState(null)
const [locationName, setLocationName] = useState('')
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')

async function handleSearch(event) {
  event.preventDefault()

  if (!city.trim()) {
    setError('Please enter a city name.')
    return
  }

  setLoading(true)
  setError('')

  try {
  const geoResponse = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
  )

  const geoData = await geoResponse.json()

if (!geoData.results || geoData.results.length === 0) {
  setError('City not found. Please try another city.')
  return
}

  const location = geoData.results[0]
setLocationName(`${location.name}, ${location.country}`)
  console.log('Selected location:', location.name)
  console.log('Latitude:', location.latitude)
  console.log('Longitude:', location.longitude)

  const weatherResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`
  )

const weatherData = await weatherResponse.json()

setWeather(weatherData)
} catch (error) {
  setError('Unable to fetch weather. Please try again.')
} finally {
  setLoading(false)
}
}


  return (
    
<div className="min-h-screen bg-slate-950 text-white p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-950 via-slate-950 to-slate-950">

      <div className="max-w-5xl mx-auto">

        <header className="mb-8">
          <h1 className="text-3xl font-bold">
            Atmos Weather
          </h1>

          <p className="text-slate-400 mt-2">
            Your weather, at a glance.
          </p>
        </header>

        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          <input
            type="text"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="Search a city..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-sky-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-6 py-3 rounded-xl transition"
          >
{loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && (
          <p className="text-red-400 bg-red-950/40 border border-red-900 rounded-xl p-3 mb-6">
            {error}
          </p>
        )}

        {weather && (
          <>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              
{locationName && (
  <p className="text-slate-300 text-lg font-medium mb-4">
    📍 {locationName}
  </p>
)}

{weather.timezone && (
  <p className="text-slate-400 text-sm mb-4">
    Time zone: {weather.timezone}
  </p>
)}

              <p className="text-slate-400 text-sm">
                Current Temperature
              </p>

<p className="text-6xl mt-4">
  {getWeatherIcon(weather.current.weather_code)}
</p>

              <p className="text-5xl font-bold mt-3">
                {weather.current.temperature_2m}°C
              </p>

<p className="text-sky-400 text-lg mt-2">
  {getWeatherDescription(weather.current.weather_code)}
</p>

              <p className="text-slate-400 mt-3">
                Feels like {weather.current.apparent_temperature}°C
              </p>

              <div className="flex flex-wrap gap-6 mt-5">
                <div>
                  <p className="text-slate-400 text-sm">Humidity</p>
                  <p className="text-lg font-semibold">
                    {weather.current.relative_humidity_2m}%
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm">Wind speed</p>
                  <p className="text-lg font-semibold">
                    {weather.current.wind_speed_10m} km/h
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4">
                5-Day Forecast
              </h2>

<div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-5 gap-3">
                {weather.daily.time.map((date, index) => (
                  <div
                    key={date}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-4"
                  >
                    <p className="text-slate-400 text-sm">
                      {new Date(date + 'T12:00:00').toLocaleDateString('en-IN', {
                        weekday: 'short',
                      })}
                    </p>

<p className="text-3xl mt-3">
  {getWeatherIcon(weather.daily.weather_code[index])}
</p>

                    <p className="text-lg font-semibold mt-3">
                      {Math.round(weather.daily.temperature_2m_max[index])}°C
                    </p>

                    <p className="text-slate-400 mt-1">
                      {Math.round(weather.daily.temperature_2m_min[index])}°C
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        
      </div>
    </div>
  )
}
export default App
