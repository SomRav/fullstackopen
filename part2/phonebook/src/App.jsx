import { useEffect, useState } from "react";
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import crudService from "./services/persons";
import MyNotification from "./components/MyNotification";
const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
            setErrorMessage(`${newName}'s number was updated sucsessfully!`);
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
          });
      } else {
        setErrorMessage(`${newName} already exits in the phonebook!`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
      };
      crudService.create(newPerson).then((personData) => {
        setPersons(persons.concat(personData));
        setErrorMessage(`${newName} added to the phone book sucsessfully!`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
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
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id));
          setErrorMessage(`Data of ${name} sucessfully deleted!`);
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        })
        .catch((error) => {
          setErrorMessage(
            `Data of ${name} has already been removed from the server`
          );
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
          setPersons(persons.filter((p) => p.id !== id));
        });
    } else {
      console.log("delete cancelled by user");
    }
  };

  return (
    <div>
      <MyNotification errorMessage={errorMessage} />
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
