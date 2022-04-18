import axios from "../axios";

const getAllTopics = () => {
  return axios.get("/api/get-all-topics");
};

const createNewTopic = (data) => {
  return axios.post("/api/create-new-topic", data);
};

const editTopicService = (data) => {
  return axios.put("/api/edit-topic", data);
};

const deleteTopicService = (id) => {
  return axios.delete("/api/delete-topic", { data: { id: id } });
};

const getAllIdeasByCategory = (categoryId) => {
  return axios.get(`/api/get-all-ideas-by-category?categoryId=${categoryId}`);
};

const handleLikeorDisLike = (data) => {
  return axios.post("/api/like-dislike-ideas", data);
};

const getStatusIsLike = (userId, ideaId) => {
  return axios.get(`/api/status-islike?userId=${userId}&ideaId=${ideaId}`);
};

const getStatusByUserIdAndTopic = (userId, topicId) => {
  return axios.get(
    `/api/getAllStatusByUserAndTopic?userId=${userId}&topicId=${topicId}`
  );
};

const getAllLikeByTopic = (topicId) => {
  return axios.get(`/api/getAllLikeByTopic?topicId=${topicId}`);
};

const getAllDisLikeByTopic = (topicId) => {
  return axios.get(`/api/getAllDisLikeByTopic?topicId=${topicId}`);
};

const handlePostComment = (data) => {
  return axios.post("/api/handlePostComment", data);
};

const getAllCommentByIdea = (ideaId) => {
  return axios.get(`/api/getAllCommentByIdea?ideaId=${ideaId}`);
};

const handleEditComment = (data) => {
  return axios.post("/api/handleEditComment", data);
};

const deleteCommentService = (id) => {
  return axios.delete("/api/delete-comment", { data: { id: id } });
};

const createNewIdea = (data) => {
  return axios.post("/api/creat-new-idea", data);
};

const downloadFile = (id) => {
  return axios.get(`/api/download-idea?id=${id}`, { responseType: "blob" });
};

const getIdeasByUserTopic = (userId, topicId) => {
  return axios.get(
    `/api/get-all-idea-by-user-topic?userId=${userId}&topicId=${topicId}`
  );
};

const deleteFileByIdea = (data) => {
  return axios.delete("/api/delete-file-idea", { data: data });
};

const updateFileIdea = (data) => {
  return axios.post("/api/update-file-idea", data);
};

const deleteIdeaByUser = (data) => {
  return axios.delete("/api/delete-idea", { data: data });
};

const deleteLikeDisLikeByIdea = (id) => {
  return axios.delete("/api/delete-like-dislike-by-idea", { data: { id: id } });
};

const getAllIdea = () => {
  return axios.get("/api/get-all-ideas");
};

const getIdeaLikeMost = () => {
  return axios.get("/api/idea-like-most");
};

const getIdeaNewPost = () => {
  return axios.get("/api/get-idea-new");
};

export {
  getIdeaNewPost,
  getIdeaLikeMost,
  getAllIdea,
  getAllTopics,
  createNewTopic,
  editTopicService,
  deleteTopicService,
  getAllIdeasByCategory,
  handleLikeorDisLike,
  getStatusIsLike,
  getStatusByUserIdAndTopic,
  getAllLikeByTopic,
  getAllDisLikeByTopic,
  handlePostComment,
  getAllCommentByIdea,
  handleEditComment,
  deleteCommentService,
  createNewIdea,
  downloadFile,
  getIdeasByUserTopic,
  deleteFileByIdea,
  updateFileIdea,
  deleteIdeaByUser,
  deleteLikeDisLikeByIdea,
};
