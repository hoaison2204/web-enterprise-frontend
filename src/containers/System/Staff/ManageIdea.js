import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { emitter } from "../../../utils/emitter";
import moment from "moment";
import "./ManageIdea.scss";
import ModalIdea from "./ModalIdea";
import FileDownload from "js-file-download";

import { getAllCategoryById } from "../../../services/categoryService";
import {
  createNewIdea,
  getIdeasByUserTopic,
  deleteIdeaByUser,
  deleteFileByIdea,
  updateFileIdea,
  deleteLikeDisLikeByIdea,
  downloadFile
} from "../../../services/topicService";
import _, { flatMap } from "lodash";
import ReactPaginate from "react-paginate";

class ManageIdea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datetime: "",
      arrCategoris: [],
      arrIdeas: [],
      pageCount: "",
      isOpenModalIdea: false,
      category: "",
      formData: "",
      checkbox: false,
    };
  }

  async componentDidMount() {
    this.getAllCategotyByDepartment(this.props.userInfo.departmentId);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.arrCategoris !== this.state.arrCategoris) {
      this.getAllIdeasByCategory();
    }
    if (prevState.category !== this.state.category) {
      this.getAllIdeasByCategory();
    }
  }
  handleDownloadFile = async (filename) => {
    await downloadFile(filename).then((res) => {
      FileDownload(res, filename);
    });
  };
  checkDateTime = () => {
    let currentDate = new Date().getTime();
    let firstDate = new Date(this.state.category.first_closure_date).getTime();
    if (currentDate < firstDate) return true;
    if (currentDate > firstDate) return false;
  };

  getAllCategotyByDepartment = async (id) => {
    if (id) {
      let res = await getAllCategoryById(id);
      this.setState({
        arrCategoris: res.data,
        category: res.data[0],
      });
    }
  };

  handleClickPage = (data) => {
    let currentPage = data.selected + 1;
    this.getCurrentCategoryPage(currentPage);
  };

  handleCreateNewIdea = () => {
    let check = this.checkDateTime();
    if (check) {
      this.setState({
        isOpenModalIdea: !this.state.isOpenModalIdea,
      });
    } else {
      alert("Time up!");
    }
  };

  toggleModaIdea = () => {
    this.setState({
      isOpenModalIdea: !this.state.isOpenModalIdea,
    });
  };

  getAllIdeasByCategory = async () => {
    let { category } = this.state;
    let userId = this.props.userInfo.id;
    let res = await getIdeasByUserTopic(userId, category.id);
    this.setState({
      arrIdeas: res.data,
    });
  };

  handleClickCategory = (category) => {
    this.setState({
      category: category,
    });
  };

  createNewIdea = async (data) => {
    let check = this.checkDateTime();
    if (check) {
      if (data) {
        let res = await createNewIdea(data);
        console.log(res);
        this.getAllIdeasByCategory();
      }
    } else {
      alert("Time up!");
    }
  };

  handleDeleteIdeaByUser = async (id, file_name) => {
    if (!id) {
      console.log("Missing parameter!");
    } else {
      let check = window.confirm("You want to delete!");
      if (check) {
        let res = await deleteIdeaByUser({ id: id, file_name: file_name });
        await deleteLikeDisLikeByIdea(id);
        console.log(res);
        this.getAllIdeasByCategory();
      }
    }
  };

  handleDeleteFile = async (ideaId, file_name) => {
    let check = window.confirm("You want to delete!");
    if (check) {
      let res = await deleteFileByIdea({
        ideaId: ideaId,
        file_name: file_name,
      });
      this.getAllIdeasByCategory();
    }
  };

  handleUpdateFileIdea = async (ideaId) => {
    let { formData, checkbox } = this.state;
    let check = this.checkDateTime();
    if (check) {
      if (checkbox) {
        if (!formData) {
          console.log("Not file");
        } else {
          formData.append("ideaId", ideaId);
          this.setState({
            loadPage: !this.state.loadPage,
          });
          let res = await updateFileIdea(formData);
          this.getAllIdeasByCategory();
        }
      } else {
        alert("You have not selected the terms");
      }
    } else {
      alert("Time up!");
    }
  };

  handleOnChangeCheckbox = (e) => {
    this.setState({
      checkbox: !this.state.checkbox,
    });
    console.log(this.state.checkbox);
  };
  handleOnChangeFile = (e) => {
    let file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    this.setState({
      formData: formData,
    });
  };

  render() {
    let userInfo = this.props.userInfo;
    let { isOpenModalIdea, arrCategoris, category, arrIdeas } = this.state;

    return (
      <div className="ideas-container">
        <div className="title text-center">Manage Idea</div>
        <div className="ideas-content">
          <div className="content-left">
            <div className="title">Categories</div>
            <div className="list-category">
              {arrCategoris &&
                arrCategoris.length > 0 &&
                arrCategoris.map((item, index) => {
                  return (
                    <div className="category">
                      <button
                        onClick={() => {
                          this.handleClickCategory(item);
                        }}
                      >
                        {item.category_name}
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="content-right">
            <div className="title">List idea</div>
            {arrIdeas && arrIdeas.length == 0 && <div style={{ textAlign: 'center', fontSize: '20px', color: 'red' }}>No idea</div>}
            <div className="add-new-idea">
              <button id="addNewIdea" hidden
                onClick={() => {
                  this.handleCreateNewIdea();
                }}
              >
              </button>
              <label htmlFor="addNewIdea" className="fas fa-plus-circle"> Add</label>
              <ModalIdea
                isOpenModalIdea={isOpenModalIdea}
                userId={userInfo.id}
                toggleModal={this.toggleModaIdea}
                category={category}
                createNewIdea={this.createNewIdea}
              />
            </div>
            {arrIdeas &&
              arrIdeas.length > 0 &&
              arrIdeas.map((item, index) => {
                let check = true;
                if (item.file_name == "") {
                  check = false;
                }

                return (
                  //div for an idea
                  <div>
                    <div className="an-idea">
                      <div className="title-idea">Title idea: {item.idea_name}</div>
                      <div className="day-post-delete">
                        <div className="day-post">
                          Day post:
                          {moment(item.createdAt).format("YYYY-MM-DD")}
                        </div>
                      </div>
                      <div className="description">Description: {item.description}</div>
                      <div className="file-box">
                        <div> File name: {item.file_name}</div>


                        {/* 3 buttons */}
                        <div className="button-customize">
                          {check && (
                            <div>
                              <button
                                onClick={() => {
                                  this.handleDeleteFile(item.id, item.file_name);
                                }}
                              >
                                Delete file
                              </button>
                            </div>
                          )}

                          {!check && (
                            <div>
                              <div>
                                <input
                                  type="checkbox"
                                  value={true}
                                  onClick={(e) => {
                                    this.handleOnChangeCheckbox(e);
                                  }}
                                />
                                Agree to the terms
                              </div>
                              <input
                                type="file"
                                name="file"
                                onChange={(e) => {
                                  this.handleOnChangeFile(e);
                                }}
                                style={{ border: "none" }}
                              />

                              <button
                                onClick={() => {
                                  this.handleUpdateFileIdea(item.id);
                                }}
                              >
                                Submit
                              </button>
                            </div>
                          )}
                          {/* download */}
                          <div>
                            <button id="downloadFile"
                              onClick={() => {
                                this.handleDownloadFile(item.file_name);
                              }}
                            >Download
                            </button>
                          </div>
                          <div className="delete-button">
                            <button
                              onClick={() => {
                                this.handleDeleteIdeaByUser(item.id, item.file_name);
                              }}
                            >Delete Idea
                            </button>
                          </div>
                        </div>
                      </div>
                      {/* button */}
                    </div>
                  </div>
                );
              })}
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageIdea);
