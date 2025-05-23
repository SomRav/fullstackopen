import axios from "axios";
const baseUrl = "/api/persons";

const getAll = () => axios.get(baseUrl).then((response) => response.data);

const create = (newObject) =>
  axios
    .post(baseUrl, newObject)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });

const update = (id, newObject) =>
  axios.put(`${baseUrl}/${id}`, newObject).then((response) => response.data);

const deletePerson = (id) =>
  axios.delete(`${baseUrl}/${id}`).then((response) => {
    console.log(response);
    return response;
  });

export default { getAll, create, update, deletePerson };
