import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import Countries from "./components/Countries";

const App = () => {
  const [query, setQuery] = useState("");
  const [countries, setCountries] = useState(null);
  const [allCountries, setAllCountries] = useState(null);

  useEffect(() => {
    console.log("fetching all........");
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        setAllCountries(response.data);
        console.log("fetching completed");
      });
  }, []);
  // console.log("all country:", allCountries);

  useEffect(() => {
    if (allCountries) {
      const filterdCountry = allCountries.filter((c) =>
        c.name.common.toLowerCase().includes(query.toLowerCase())
      );
      if (filterdCountry.length > 10) {
        setCountries(null);
      } else {
        setCountries(filterdCountry);
        // console.log("country,", countries);
      }
    }
  }, [query]);

  const handleQueryChange = (e) => {
    // console.log(e.target.value);
    setQuery(e.target.value);
  };

  const handleShowOf = (name) => {
    console.log("showing a country", name);
    const country = countries.find((c) => c.name.common === name);
    setCountries([country]);
  };

  return (
    <div>
      <div>
        <label>Find Countries </label>
        <input type="text" value={query} onChange={handleQueryChange} />
      </div>
      <Countries countries={countries} handleShowOf={handleShowOf} />
    </div>
  );
};

export default App;
