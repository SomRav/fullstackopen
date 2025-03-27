import React from "react";
import crudService from "../services/persons";

const Person = ({ persons, deleteDataOf }) => {
  return (
    <ul>
      {persons.map((person) => (
        <li key={person.id}>
          {person.name} : {person.number}{" "}
          <button onClick={() => deleteDataOf(person.id, person.name)}>
            delete
          </button>
        </li>
      ))}
    </ul>
  );
};

export default Person;
