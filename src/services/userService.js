import axios from "../axios";

const handleLoginAPI = (email, password) => {
  return axios.post("/api/login", { email: email, password: password });
};

const getAllUsers = (id) => {
  return axios.get(`/api/get-all-users?id=${id}`);
};

const createNewUserService = (data) => {
  return axios.post("/api/create-new-user", data);
};

const deleteUserService = (id) => {
  return axios.delete("/api/delete-user", { data: { id: id } });
};

const editUserService = (data) => {
  return axios.put("/api/edit-user", data);
};

export {
  handleLoginAPI,
  getAllUsers,
  createNewUserService,
  deleteUserService,
  editUserService,
};
