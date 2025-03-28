import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

const Country = ({
  countryName,
  capital,
  area,
  languages,
  flag,
  capitalInfo,
}) => {
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  console.log(capitalInfo);

  const [lat, lng] = capitalInfo.latlng;
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
      )
      .then((reponse) => {
        const temperature = reponse.data.main.temp;
        const windSpeed = reponse.data.wind.speed;
        setWeather({ temperature, windSpeed });
      });
  }, []);

  return (
    <div>
      <h1>{countryName}</h1>
      <p>
        Capital: {capital.join(", ")} <br /> Area: {area}
      </p>
      <h3>Languages:</h3>
      <ul>
        {Object.values(languages).map((lang, index) => (
          <li key={index}>{lang}</li>
        ))}
      </ul>
      <img src={flag.png} alt={flag.alt} />
      <h3>Weather in {countryName}</h3>
      <p>
        Temperature: {weather ? `${weather.temperature}*C` : "no data"} <br />{" "}
        Wind speed: {weather ? `${weather.windSpeed}m/s` : "no data"}
      </p>
    </div>
  );
};

export default Country;
