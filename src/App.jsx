import "./App.css";
import PropTypes from "prop-types";
// Images
import searchIcon from "./assets/images/search-icon.png";
import snowIcon from "./assets/gif/snow.gif";
import clearIcon from "./assets/gif/clear.gif";
import cloudIcon from "./assets/gif/cloud.gif";
import dizzleIcon from "./assets/gif/dizzle.gif";
import rainIcon from "./assets/gif/rain.gif";
import windIcon from "./assets/gif/wind.gif";
import humidityIcon from "./assets/gif/humidity2.gif";

import { useEffect, useState } from "react";
const apikey = import.meta.env.VITE_API_KEY;

const WeatherDetails = ({
  icon,
  temp,
  city,
  country,
  lat,
  long,
  windSpeed,
  humidity,
}) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="image" />
      </div>
      <div className="temp">{temp}℃</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className="lat">latitude </span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="long">longitude </span>
          <span>{long}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img
            src={humidityIcon}
            alt="humidity-icon"
            className="icon"
            width={100}
          />
          <div className="data">
            <div className="humidity-percent">{humidity} %</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="wind-icon" className="icon" width={100} />
          <div className="data">
            <div className="wind-percent"> {windSpeed} km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
};

function App() {
  const [icon, setIcon] = useState(snowIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [windSpeed, setWindSpeed] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [text, setText] = useState("Salem");
  const [error, setError] = useState("");

  const weatherIconMap = {
    "01n": clearIcon,
    "01d": cloudIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03n": dizzleIcon,
    "03d": dizzleIcon,
    "04d": dizzleIcon,
    "04n": dizzleIcon,
    "09n": rainIcon,
    "09d": rainIcon,
    "10n": rainIcon,
    "10d": rainIcon,
    "13n": snowIcon,
    "13d": snowIcon,
  };

  const Search = async () => {
    try {
      setLoading(true);
      setError("");
      setCityNotFound(false);

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${apikey}&units=metric`;

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        if (data.cod === 404 || data.cod === "404") {
          setCityNotFound(true);
        } else {
          setError("Failed to fetch weather data.");
        }
        return;
      }

      setLat(data.coord.lat);
      setLong(data.coord.lon);
      setHumidity(data.main.humidity);
      setWindSpeed(data.wind.speed);
      setCountry(data.sys.country);
      setTemp(data.main.temp);
      setIcon(weatherIconMap[data.weather[0].icon] || clearIcon);
      setCity(data.name);
    } catch (error) {
      console.error(error);
      setError("Error occurred while fetching weather data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await Search();
    })();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key == "Enter") {
      Search();
    }
  };

  return (
    <>
      <div>
        <div className="container">
          <div className="input-container">
            <input
              type="text"
              className="cityInput"
              placeholder="Search City"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
              }}
              onKeyDown={handleKeyDown}
            />
            <div className="search-icon" onClick={Search}>
              <img src={searchIcon} alt="search-icon" width={20} />
            </div>
          </div>

          {loading ? (
            <div className="loading">Please wait loading...</div>
          ) : error.length != 0 ? (
            <div className="error-message">{error}</div>
          ) : cityNotFound ? (
            <>
              <div className="notFound">City Not Found</div>{" "}
            </>
          ) : (
            <WeatherDetails
              icon={icon}
              temp={temp}
              city={city}
              country={country}
              lat={lat}
              long={long}
              humidity={humidity}
              windSpeed={windSpeed}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default App;

WeatherDetails.prototype = {
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  lat: PropTypes.number.isRequired,
  long: PropTypes.number.isRequired,
  windSpeed: PropTypes.number.isRequired,
  humidity: PropTypes.number.isRequired,
};
