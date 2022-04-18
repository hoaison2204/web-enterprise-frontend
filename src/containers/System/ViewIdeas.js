import React, { Component } from "react";
import { connect } from "react-redux";
import FileDownload from "js-file-download";
import moment from "moment";
import "./ViewIdeas.scss";
import * as actions from "../../store/actions";
import {
  getAllIdeasByCategory,
  handleLikeorDisLike,
  getStatusIsLike,
  getStatusByUserIdAndTopic,
  getAllLikeByTopic,
  getAllDisLikeByTopic,
  getAllCommentByIdea,
  handlePostComment,
  handleEditComment,
  deleteCommentService,
  downloadFile,
  createNewIdea,
} from "../../services/topicService";
import { getAllDepartment } from "../../services/departmentService";
import { getAllCategoryById } from "../../services/categoryService";
import ModalComment from "./ModalComment";
import ReactPaginate from "react-paginate";
import ModalIdea from "./Staff/ModalIdea";

class ViewIdeas extends Component {
  constructor(prop) {
    super(prop);
    this.state = {
      arrIdeas: [],
      newIdeas: [],
      userInfo: {},
      arrStatusByUser: [],

      status: true,
      arrAllLikeByTopic: [],
      arrAllDisLikeByTopic: [],
      isOpenModal: false,
      ideaId: "",
      allComment: [],
      newComments: [],
      categoryId: "",
      isOpenModalIdea: false,
      category: "",
      StartDate: "",
      FinalDate: "",
      arrDepartment: [],
      departmentId: "",
      arrCategoris: [],
      pageCount: "",
      pageCountComment: "",
    };
  }

  componentDidMount() {
    this.getAllDepartment();
    this.setState({
      userInfo: this.props.userInfo,
    });
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.arrCategoris !== this.state.arrCategoris) {
      console.log("check props: ", this.props);
      this.setState({
        categoryId: this.state.arrCategoris[0].id,
        category: this.state.arrCategoris[0],
        StartDate: this.state.arrCategoris[0].start_date,
        FinalDate: this.state.arrCategoris[0].final_closure_date,
      });
    }
    if (prevState.category !== this.state.category) {
      this.getAllIdeasByCategory(this.state.category);
    }
    if (prevState.departmentId !== this.state.departmentId) {
      this.getAllCategotyByDepartment(this.state.departmentId);
    }
    if (prevState.arrIdeas !== this.state.arrIdeas) {
      this.getCurrentIdeaPage(1);
    }

    if (prevState.status !== this.state.status) {
      let userId = this.props.userInfo.id;
      let categoryId = this.state.categoryId;

      let data = await getStatusByUserIdAndTopic(userId, categoryId);
      this.setState({
        arrStatusByUser: data.data,
      });

      let getAllLike = await getAllLikeByTopic(categoryId);
      console.log("check getAllLike: ", getAllLike);
      if (getAllLike) {
        this.setState({
          arrAllLikeByTopic: getAllLike.data,
        });
      }

      let getAllDisLike = await getAllDisLikeByTopic(categoryId);
      if (getAllDisLike) {
        this.setState({
          arrAllDisLikeByTopic: getAllDisLike.data,
        });
      }
    }
  }

  getAllDepartment = async () => {
    let res = await getAllDepartment();
    this.setState({
      arrDepartment: res.data,
      departmentId: res.data[0].id,
    });
  };

  getAllCategotyByDepartment = async (id) => {
    if (id) {
      let res = await getAllCategoryById(id);
      this.setState({
        arrCategoris: res.data,
      });
    }
  };

  getAllIdeasByCategory = async (category) => {
    this.setState({
      categoryId: category.id,
      category: category,
      StartDate: category.start_date,
      FinalDate: category.final_closure_date,
    });
    if (category) {
      let res = await getAllIdeasByCategory(category.id);
      this.setState({
        arrIdeas: res.data,
      });
      let pageCount = Math.ceil(res.data.length / 5);
      this.setState({
        pageCount: pageCount,
      });

      let userId = this.props.userInfo.id;
      let data = await getStatusByUserIdAndTopic(userId, category.id);
      this.setState({
        arrStatusByUser: data.data,
      });

      let getAllLike = await getAllLikeByTopic(category.id);
      console.log("check getAllLike: ", getAllLike);
      if (getAllLike) {
        this.setState({
          arrAllLikeByTopic: getAllLike.data,
        });
      }

      let getAllDisLike = await getAllDisLikeByTopic(category.id);
      if (getAllDisLike) {
        this.setState({
          arrAllDisLikeByTopic: getAllDisLike.data,
        });
      }
    }
  };

  handleLikeOrDisLike = async (data) => {
    let { userInfo } = this.props;

    data.userId = userInfo.id;
    let res = await handleLikeorDisLike(data);
    this.setState({
      status: !this.state.status,
    });
  };

  handleGetStatusIsLike = async (ideaId) => {
    if (ideaId) {
      let userId = this.props.userInfo.id;
      let res = await getStatusIsLike(userId, ideaId);
      if (res) {
        return res.status;
      } else {
        return 3;
      }
    } else {
      return 3;
    }
  };

  getCurrentLikeByIdea = (ideaId) => {
    let { arrAllLikeByTopic } = this.state;
    let current = 0;
    arrAllLikeByTopic.map((item, index) => {
      if (item.ideaId == ideaId) {
        current = current + 1;
      }
    });

    return current;
  };

  getCurrentDisLikeByIdea = (ideaId) => {
    let { arrAllDisLikeByTopic } = this.state;
    let current = 0;
    arrAllDisLikeByTopic.map((item, index) => {
      if (item.ideaId == ideaId) {
        current = current + 1;
      }
    });

    return current;
  };

  handleOpenModelComment = (ideaId) => {
    this.setState({
      isOpenModal: !this.state.isOpenModal,
      ideaId: ideaId,
    });
    this.handleGetAllComment(ideaId);
  };

  toggleModalComment = () => {
    this.setState({
      isOpenModal: !this.state.isOpenModal,
    });
  };

  handleGetAllComment = async (ideaId) => {
    if (ideaId) {
      let res = await getAllCommentByIdea(ideaId);
      this.setState({ allComment: res.data });
      this.getCurrentCommentPage(1);

      let pageCount = Math.ceil(res.data.length / 5);
      this.setState({
        pageCountComment: pageCount,
      });
    }
  };

  handlePostComment = async (userId, ideaId, comment) => {
    if (!userId || !ideaId || !comment) {
      console.log("Missing parameter");
    } else {
      let res = await handlePostComment({
        userId: userId,
        ideaId: ideaId,
        comment: comment,
      });
      this.handleGetAllComment(ideaId);
    }
  };

  handleEditComment = async (commentId, commentEdit) => {
    let { ideaId } = this.state;
    if (!commentId || !commentEdit) {
      console.log("Missing parameter");
    } else {
      let res = await handleEditComment({
        commentId: commentId,
        commentEdit: commentEdit,
      });
      this.handleGetAllComment(ideaId);
    }
  };

  handleDeleteComment = async (id) => {
    if (id) {
      let { ideaId } = this.state;
      await deleteCommentService(id);
      this.handleGetAllComment(ideaId);
    }
  };

  getCurrentCommentPage = (currentPage) => {
    let allComment = this.state.allComment;
    let newComments = [];
    for (let i = currentPage * 5 - 5; i < currentPage * 5; i++) {
      if (i >= allComment.length) {
        break;
      } else {
        let obj = allComment[i];
        newComments.push(obj);
      }
    }
    this.setState({
      newComments: newComments,
    });
  };

  handleDownloadFile = async (filename) => {
    await downloadFile(filename).then((res) => {
      FileDownload(res, filename);
    });
  };

  getCurrentIdeaPage = (currentPage) => {
    let arrIdeas = this.state.arrIdeas;
    let newIdeas = [];
    for (let i = currentPage * 5 - 5; i < currentPage * 5; i++) {
      if (i >= arrIdeas.length) {
        break;
      } else {
        let obj = arrIdeas[i];
        newIdeas.push(obj);
      }
    }
    this.setState({
      newIdeas: newIdeas,
    });
  };

  handleClickPage = (data) => {
    let currentPage = data.selected + 1;
    this.getCurrentIdeaPage(currentPage);
  };

  handleCreateNewIdea = () => {
    this.setState({
      isOpenModalIdea: true,
    });
  };

  toggleModaIdea = () => {
    this.setState({
      isOpenModalIdea: !this.state.isOpenModalIdea,
    });
  };

  createNewIdea = async (data) => {
    if (data) {
      let res = await createNewIdea(data);
      console.log(res);
      this.getAllIdeasByCategory(this.state.category);
    }
  };

  handleOnChangeDepartment = (e) => {
    console.log("check select: ", e.target.value);
    this.setState({
      departmentId: e.target.value,
    });
    this.getAllCategotyByDepartment(e.target.value);
  };

  render() {
    let userInfo = this.props.userInfo;
    let {
      arrDepartment,
      pageCountComment,
      arrCategoris,
      categoryId,
      newIdeas,
      pageCount,
      arrStatusByUser,
      isOpenModalIdea,
      category,
      StartDate,
      FinalDate,
      roleStaff,
    } = this.state;
    console.log("Check state: ", newIdeas);
    return (
      <div className="view-ideas-contaner container">
        <div className="content-left">
          <div className="list-department">
            <span>Choose department: </span>
            <select className="form-custom"
              onChange={(e) => {
                this.handleOnChangeDepartment(e);
              }}
            >
              {arrDepartment &&
                arrDepartment.length > 0 &&
                arrDepartment.map((item, index) => {
                  return (
                    <option value={item.id}>{item.department_name}</option>
                  );
                })}
            </select>
          </div>
          {arrCategoris &&
            arrCategoris.length > 0 &&
            arrCategoris.map((item, index) => {
              return (
                <div
                  className={categoryId == item.id ? "topic active" : "topic"}
                  onClick={() => this.getAllIdeasByCategory(item)}
                >
                  {item.category_name}
                </div>
              );
            })}
        </div>
        <div className="content-right">
          <div className="content-header">
            <div>
              <div className="start-end-date">
                <span className="start-date">
                  Start date: {moment(StartDate).format("YYYY-MM-DD")}
                </span>
                <span className="end-date">
                  Final date: {moment(FinalDate).format("YYYY-MM-DD")}
                </span>
              </div>
            </div>
            {roleStaff && (
              <div>
                <button
                  onClick={() => {
                    this.handleCreateNewIdea();
                  }}
                >
                  Add new Idea
                </button>
                <ModalIdea
                  isOpenModalIdea={isOpenModalIdea}
                  userId={userInfo.id}
                  toggleModal={this.toggleModaIdea}
                  topic={category}
                  createNewIdea={this.createNewIdea}
                />
              </div>
            )}
          </div>

          {newIdeas &&
            newIdeas.length > 0 &&
            newIdeas.map((item, index) => {
              let status = 3;
              arrStatusByUser.map((item2, index2) => {
                if (item2.ideaId == item.id) {
                  status = item2.isLike;
                }
              });

              let currentLike = this.getCurrentLikeByIdea(item.id);
              let currentDisLike = this.getCurrentDisLikeByIdea(item.id);
              console.log("check current : ", currentLike);

              return (
                <div className="ideas">
                  <div className="title">
                    Poster : {item.User.lastname + " " + item.User.firstname}
                  </div>
                  <div className="idea-title">{item.idea_name}</div>
                  <div className="idea-description">{item.description}</div>
                  <div>
                    Post day: {moment(item.createdAt).format("YYYY-MM-DD")}
                  </div>

                  <div className="reaction">
                    <div className="like">
                      <i
                        className={
                          status === 1
                            ? "fas fa-thumbs-up active"
                            : "fas fa-thumbs-up icon"
                        }
                        onClick={() => {
                          this.handleLikeOrDisLike({
                            ideaId: item.id,
                            action: 1,
                          });
                        }}
                      ></i>
                      <span>{currentLike}</span>
                    </div>
                    <div className="dislike">
                      <i
                        className={
                          status === 0
                            ? "fas fa-thumbs-down active"
                            : "fas fa-thumbs-down icon"
                        }
                        onClick={() => {
                          this.handleLikeOrDisLike({
                            ideaId: item.id,
                            action: 0,
                          });
                        }}
                      ></i>
                      <span>{currentDisLike}</span>
                    </div>
                    {/* </div> */}
                    <div className="comment-container">
                      <button id="comment-button" hidden
                        onClick={() => this.handleOpenModelComment(item.id)}
                      >
                      </button>
                      <label htmlFor="comment-button" className="fas fa-comments"></label>
                      <ModalComment
                        isOpen={this.state.isOpenModal}
                        topic={category}
                        ideaId={this.state.ideaId}
                        userId={userInfo.id}
                        allComment={this.state.newComments}
                        pageCount={pageCountComment}
                        toggleModal={this.toggleModalComment}
                        GetAllComment={this.handleGetAllComment}
                        postComment={this.handlePostComment}
                        EditComment={this.handleEditComment}
                        deleteComment={this.handleDeleteComment}
                        getCurrentCommentPage={this.getCurrentCommentPage}
                      />
                    </div>
                    <div>
                      <button id="downloadFile" hidden
                        onClick={() => {
                          this.handleDownloadFile(item.file_name);
                        }}
                      >
                      </button>
                      <label htmlFor="downloadFile" className="fas fa-download"></label>
                    </div>
                  </div>
                </div>
              );
            })}
          {pageCount && <>
            <ReactPaginate
              previousLabel="Previous"
              nextLabel="Next"
              breakLabel="..."
              pageCount={pageCount}
              marginPagesDisplayed={3}
              onPageChange={this.handleClickPage}
              containerClassName="pagination justify-content-center"
              pageClassName="page-item"
              previousClassName="page-item"
              nextClassName="page-item"
              pageLinkClassName="page-link"
              previousLinkClassName="page-link"
              nextLinkClassName="page-link"
              breakClassName="page-item"
              breakLinkClassName="page-link"
              activeClassName="active"
            />
          </>}

        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewIdeas);
