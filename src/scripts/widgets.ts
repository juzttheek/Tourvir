/**
 * widgets.ts
 * Fetches real-time weather and currency data for the TopBar
 */

const WEATHER_API = 'https://api.open-meteo.com/v1/forecast?latitude=6.9271&longitude=79.8612&current_weather=true';
const CURRENCY_API = 'https://open.er-api.com/v6/latest/USD';

interface WeatherData {
  current_weather: {
    temperature: number;
    weathercode: number;
  };
}

interface CurrencyData {
  rates: {
    LKR: number;
    EUR: number;
    GBP: number;
  };
}

// Simple weather code to emoji mapping (Open-Meteo WMO codes)
function getWeatherEmoji(code: number): string {
  if (code === 0) return '☀️'; // Clear sky
  if (code >= 1 && code <= 3) return '⛅'; // Partly cloudy
  if (code >= 45 && code <= 48) return '🌫️'; // Fog
  if (code >= 51 && code <= 67) return '🌧️'; // Rain/Drizzle
  if (code >= 71 && code <= 77) return '❄️'; // Snow
  if (code >= 80 && code <= 82) return '🌦️'; // Rain showers
  if (code >= 95 && code <= 99) return '⛈️'; // Thunderstorm
  return '☁️';
}

async function fetchWeather() {
  try {
    const cached = sessionStorage.getItem('tourvir_weather');
    if (cached) return JSON.parse(cached);

    const res = await fetch(WEATHER_API);
    if (!res.ok) throw new Error('Weather fetch failed');
    const data = await res.json() as WeatherData;
    
    sessionStorage.setItem('tourvir_weather', JSON.stringify(data));
    return data;
  } catch (err) {
    console.error('[TopBar] Weather error:', err);
    return null;
  }
}

async function fetchCurrency() {
  try {
    const cached = sessionStorage.getItem('tourvir_currency');
    if (cached) return JSON.parse(cached);

    const res = await fetch(CURRENCY_API);
    if (!res.ok) throw new Error('Currency fetch failed');
    const data = await res.json() as CurrencyData;
    
    sessionStorage.setItem('tourvir_currency', JSON.stringify(data));
    return data;
  } catch (err) {
    console.error('[TopBar] Currency error:', err);
    return null;
  }
}

export async function initTopBarWidgets() {
  const weatherEl = document.getElementById('topbar-weather');
  const currencyEl = document.getElementById('topbar-currency');

  if (weatherEl) {
    fetchWeather().then((data: WeatherData | null) => {
      if (data && data.current_weather) {
        const temp = Math.round(data.current_weather.temperature);
        const emoji = getWeatherEmoji(data.current_weather.weathercode);
        weatherEl.textContent = `Colombo: ${temp}°C ${emoji}`;
      } else {
        weatherEl.textContent = 'Colombo: 28°C ☀️'; // Fallback
      }
    });
  }

  if (currencyEl) {
    fetchCurrency().then((data: CurrencyData | null) => {
      if (data && data.rates && data.rates.LKR) {
        const lkrPerUsd = Math.round(data.rates.LKR);
        const lkrPerEur = Math.round(data.rates.LKR / data.rates.EUR);
        const lkrPerGbp = Math.round(data.rates.LKR / data.rates.GBP);
        
        // Use a span structure for responsive hiding
        currencyEl.innerHTML = `
          USD: Rs.${lkrPerUsd}
          <span class="hide-mobile"> | EUR: Rs.${lkrPerEur} | GBP: Rs.${lkrPerGbp}</span>
        `;
      } else {
        currencyEl.textContent = 'Currency rates unavailable';
      }
    });
  }
}
