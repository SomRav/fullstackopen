import React from "react";

const Person = ({ persons }) => {
  let id = 1;
  return (
    <ul>
      {persons.map((person) => (
        <li key={Math.random()}>
          {person.name} : {person.number}
        </li>
      ))}
    </ul>
  );
};

export default Person;
