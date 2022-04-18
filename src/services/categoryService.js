import axios from "../axios";

const getAllCategoryById = (id) => {
  return axios.get(`/api/get-all-category-by-department?id=${id}`);
};

const createNewCategory = (data) => {
  return axios.post("/api/create-new-category", data);
};

const editCategoryService = (data) => {
  return axios.put("/api/edit-category", data);
};

const deleteCategoryService = (id) => {
  return axios.delete("/api/delete-category", { data: { id: id } });
};

const getAllCategory = () => {
  return axios.get("/api/get-all-category");
};

const downloadCategoryZip = (id) => {
  return axios.get(`/api/download-zip?id=${id}`, { responseType: "blob" });
};

const downloadCategoryCsv = (id) => {
  return axios.get(`/api/download-csv?id=${id}`, { responseType: "blob" });
};

export {
  downloadCategoryCsv,
  downloadCategoryZip,
  getAllCategory,
  getAllCategoryById,
  createNewCategory,
  editCategoryService,
  deleteCategoryService,
};
