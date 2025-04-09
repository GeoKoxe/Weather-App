"use client";

import { useState } from "react";

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fade, setFade] = useState(false);
  const [showWeather, setShowWeather] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city) return;

    setLoading(true);
    setError(null);
    setFade(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );

      if (!res.ok) {
        const errorMessage = await res.text();
        console.error("Error response:", errorMessage);
        throw new Error("Failed to fetch data");
      }

      const data = await res.json();
      console.log("Fetched data:", data);

      setTimeout(() => {
        setWeather(data);
        setShowWeather(true);
      }, 1000);
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError("Failed to fetch weather data. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setFade(false), 1000);
    }
  };

  const getBackgroundColor = (weatherDescription) => {
    if (!weatherDescription) return "bg-blue-500";

    if (
      weatherDescription.includes("clear") ||
      weatherDescription.includes("sun")
    ) {
      return "bg-yellow-400";
    }
    if (weatherDescription.includes("cloud")) {
      return "bg-gray-500";
    }
    if (
      weatherDescription.includes("rain") ||
      weatherDescription.includes("drizzle")
    ) {
      return "bg-blue-600";
    }
    if (weatherDescription.includes("snow")) {
      return "bg-white";
    }
    if (weatherDescription.includes("thunderstorm")) {
      return "bg-purple-600";
    }

    return "bg-blue-500";
  };

  const backgroundColor = weather
    ? getBackgroundColor(weather.weather[0].description)
    : "bg-blue-500";

  return (
    <div
      className={`min-h-screen ${backgroundColor} flex items-center justify-center p-4 transition-all duration-1000`}
    >
      <div
        className={`bg-white/20 backdrop-blur-lg rounded-2xl shadow-lg p-6 w-full max-w-md text-white transition-opacity duration-1000 ${
          fade ? "opacity-0" : "opacity-100"
        }`}
      >
        <form onSubmit={handleSearch} className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 p-2 rounded-lg bg-white/70 text-black placeholder-gray-500 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-white text-blue-600 font-bold px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </form>

        {error && <p className="text-red-500">{error}</p>}

        <div>
          {showWeather && weather && weather.main && (
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">{weather.name}</h2>
              <p className="text-lg capitalize">
                {weather.weather[0].description}
              </p>

              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
                className="mx-auto"
              />

              <p className="text-4xl font-semibold">
                {Math.round(weather.main.temp)}°C
              </p>
              <p className="text-lg">Wind Speed: {weather.wind.speed} m/s</p>
              <p className="text-lg">Humidity: {weather.main.humidity}%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
