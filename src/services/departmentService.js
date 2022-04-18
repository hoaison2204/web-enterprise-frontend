import axios from "../axios";

const getAllDepartment = () => {
  return axios.get("/api/get-all-departments");
};

const createNewDepartment = (data) => {
  return axios.post("/api/create-new-department", data);
};

const editDepartmentService = (data) => {
  return axios.put("/api/edit-department", data);
};

const deleteDepartMentService = (id) => {
  return axios.delete("/api/delete-department", { data: { id: id } });
};

export {
  getAllDepartment,
  createNewDepartment,
  editDepartmentService,
  deleteDepartMentService,
};
