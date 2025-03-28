import React from "react";
import Country from "./Country";

const Countries = ({ countries, handleShowOf }) => {
  if (!countries) {
    return <p>Too many matches specify another filter!</p>;
  }
  if (countries.length === 1) {
    return (
      <Country
        countryName={countries[0].name.common}
        capital={countries[0].capital}
        area={countries[0].area}
        languages={countries[0].languages}
        flag={countries[0].flags}
        capitalInfo={countries[0].capitalInfo}
      />
    );
  }
  return (
    <ul>
      {countries.map((c) => (
        <li key={c.ccn3}>
          {c.name.common}{" "}
          <button onClick={() => handleShowOf(c.name.common)}>Show</button>
        </li>
      ))}
    </ul>
  );
};

export default Countries;
