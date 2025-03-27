import React from "react";

const Person = ({ persons }) => {
  console.log(persons);

  return (
    <ul>
      {persons.map((person) => (
        <li key={person.id}>
          {person.name} : {person.number}
        </li>
      ))}
    </ul>
  );
};

export default Person;
