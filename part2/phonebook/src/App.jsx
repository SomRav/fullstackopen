import { useEffect, useState } from "react";
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import crudService from "./services/persons";
const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNumber] = useState("");
  const [filter, setFilter] = useState("");

  // fetch the data from json server
  useEffect(() => {
    crudService.getAll().then((initPerson) => {
      setPersons(initPerson);
    });
  }, []);

  const addPerson = (e) => {
    e.preventDefault();

    const nameExist = persons.some((person) => person.name === newName);
    if (nameExist) {
      if (
        window.confirm(
          `${newName} is already exist in phonebook. Replace the old number with a new one?`
        )
      ) {
        const person = persons.find((p) => p.name === newName);
        crudService
          .update(person.id, { ...person, number: newNumber })
          .then((updatedData) => {
            setPersons(
              persons.map((p) => (p.id === person.id ? updatedData : p))
            );
          });
      } else {
        alert(`${newName} already exist in phonebook`);
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
      };
      crudService.create(newPerson).then((personData) => {
        setPersons(persons.concat(personData));
        setNewName("");
        setNumber("");
      });
    }
  };

  const handleNameChange = (e) => {
    console.log(e.target.value);
    setNewName(e.target.value);
  };
  const handleNumberChange = (e) => {
    setNumber(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filterdPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  const deleteDataOf = (id, name) => {
    console.log(`the data of ${id} and ${name} to be deleted...`);
    if (window.confirm(`Do you want to delete ${name}`)) {
      crudService
        .deletePerson(id)
        .then(() => setPersons(persons.filter((p) => p.id !== id)));
    } else {
      console.log("delete cancelled by user");
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter onChange={handleFilterChange} value={filter} />
      <h2>Add a new:</h2>
      <PersonForm
        onFormSubmit={addPerson}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
        newName={newName}
        newNumber={newNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={filterdPersons} deleteDataOf={deleteDataOf} />
    </div>
  );
};

export default App;
