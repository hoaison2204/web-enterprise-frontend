import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import _ from "lodash";
import "./ModalComment.scss";
import {
  getAllCommentByIdea,
  handlePostComment,
} from "../../services/topicService";
import moment from "moment";
import ReactPaginate from "react-paginate";

class ModalComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: "",
      commentId: "",
      allComment: [],
      commentEdit: "",
    };
  }

  componentDidMount() {
    // this.getCurrentCommentPage(2);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.allComment !== this.props.allComment) {
      // this.getCurrentCommentPage(1);
    }
  }

  handleOnChangeInput = (e, id) => {
    let copystate = { ...this.state };
    copystate[id] = e.target.value;
    this.setState({
      ...copystate,
    });
  };

  checkdatetime = () => {
    let currentDate = new Date().getTime();
    let finalDate = new Date(this.props.topic.final_closure_date).getTime();
    if (currentDate < finalDate) {
      return true;
    } else {
      return false;
    }
  };

  handlePostComment = (event) => {
    let check = this.checkdatetime();
    console.log(check);
    if (check) {
      if (event.key === "Enter") {
        let { userId, ideaId } = this.props;
        let { comment } = this.state;
        if (comment !== "") {
          this.props.postComment(userId, ideaId, comment);
          console.log("Check: ", userId, ideaId, comment);
          this.setState({
            comment: "",
          });
        }
      }
    } else {
      alert("Can't comment");
    }
  };

  handleEditComment = (event, id) => {
    let check = this.checkdatetime();
    if (check) {
      if (event.key === "Enter") {
        let { commentEdit } = this.state;
        if (commentEdit !== "") {
          this.props.EditComment(id, commentEdit);
          this.setState({
            commentEdit: "",
            commentId: "",
          });
        }
      }
    } else {
      this.setState({
        commentEdit: "",
        commentId: "",
      });
      alert("Can't edit comment");
      return;
    }
  };

  handleClickEditComment = (commentId, comment) => {
    this.setState({
      commentId: commentId,
      commentEdit: comment,
    });
  };

  handleShowDropDown = () => {};

  toggle = () => {
    this.props.toggleModal();
  };

  handleClickPage = (data) => {
    let allComment = this.props.allComment;
    let currentPage = data.selected + 1;
    console.log(data.selected);
    this.props.getCurrentCommentPage(currentPage);
  };

  handleDeleteComment = (id) => {
    let check = this.checkdatetime();
    if (check) {
      this.props.deleteComment(id);
    } else {
      alert("Can't delete comment");
    }
  };

  render() {
    let { allComment, userId } = this.props;
    console.log("CHeck props: ", this.props);
    let { commentId } = this.state;
    return (
      <div>
        <Modal
          id="AddUser"
          isOpen={this.props.isOpen}
          toggle={() => {
            this.toggle();
          }}
          size="lg"
          className="modal-user-container"
        >
          <ModalHeader
            toggle={() => {
              this.toggle();
            }}
          >
            <div className="header-comment">
              {" "}
              <i className="fas fa-comments" style={{ padding: "10px" }}></i>
              Comment
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="comment">
              <input
                className="form-control"
                placeholder="Enter comment"
                value={this.state.comment}
                onChange={(e) => {
                  this.handleOnChangeInput(e, "comment");
                }}
                onKeyDown={(e) => {
                  this.handlePostComment(e);
                }}
              />
            </div>

            {allComment &&
              allComment.length > 0 &&
              allComment.map((item, index) => {
                let check = false;
                if (item.userId == userId) {
                  check = true;
                }
                return (
                  <div className="list-comment">
                    <div className="avt-comment">
                      <i className="fas fa-user-circle"></i>
                    </div>
                    <div className="child-comment">
                      <div className="comment-title">
                        <div>Ẩn danh </div>
                        <div className="datetime">
                          {moment(item.createAt).format("YYYY-MM-DD h:mm")}
                        </div>

                        {check && (
                          <div className="edit-delete">
                            <i
                              className="fas fa-ellipsis-h"
                              onClick={() => {
                                this.handleShowDropDown();
                              }}
                            ></i>
                            <div class="dropdown-content">
                              <div>
                                <button
                                  onClick={() => {
                                    this.handleClickEditComment(
                                      item.id,
                                      item.comment
                                    );
                                  }}
                                >
                                  Edit
                                </button>
                              </div>
                              <div>
                                <button
                                  onClick={() => {
                                    this.handleDeleteComment(item.id);
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="content-comment">
                        <input
                          id="focus-input"
                          className={
                            commentId === item.id ? "active-block" : ""
                          }
                          value={this.state.commentEdit}
                          onChange={(e) => {
                            this.handleOnChangeInput(e, "commentEdit");
                          }}
                          onKeyDown={(e) => {
                            this.handleEditComment(e, item.id);
                          }}
                        />
                        <span
                          className={commentId === item.id ? "active-none" : ""}
                        >
                          {item.comment}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

            <ReactPaginate
              previousLabel="Previous"
              nextLabel="Next"
              breakLabel="..."
              pageCount={this.props.pageCount}
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
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                this.toggle();
              }}
              className="px-3"
            >
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalComment);
