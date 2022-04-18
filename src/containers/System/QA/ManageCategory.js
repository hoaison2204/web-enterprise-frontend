import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { emitter } from "../../../utils/emitter";
import FileDownload from "js-file-download";
import b64ToBlob from "b64-to-blob";
import fileSaver from "file-saver";
import moment from "moment";
import "./ManageCategory.scss";

import {
  getAllCategoryById,
  createNewCategory,
  editCategoryService,
  deleteCategoryService,
  downloadCategoryZip,
  downloadCategoryCsv,
} from "../../../services/categoryService";
import { getAllDepartment } from "../../../services/departmentService";
import _ from "lodash";
import ReactPaginate from "react-paginate";
import ModalCategory from "./ModalCategory";

class ManageCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datetime: "",
      arrDepartment: [],
      arrCategoris: [],
      departmentId: "",
      newCategories: [],
      isOpenModalAdd: false,
      isOpenModalEdit: false,
      editCategory: {},
      pageCount: "",
    };
  }

  async componentDidMount() {
    this.getAllDepartment();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.arrDepartment !== this.state.arrDepartment) {
      this.setState({
        departmentId: this.state.arrDepartment[0].id,
      });
      this.getAllCategotyByDepartment(this.state.arrDepartment[0].id);
      this.getCurrentCategoryPage(1);
    }

    if (prevState.arrCategoris !== this.state.arrCategoris) {
      this.getCurrentCategoryPage(1);
    }
  }

  getAllCategotyByDepartment = async (id) => {
    if (id) {
      let res = await getAllCategoryById(id);
      this.setState({
        arrCategoris: res.data,
      });
      let pageCount = Math.ceil(res.data.length / 5);
      this.setState({
        pageCount: pageCount,
      });
    }
  };

  getAllDepartment = async () => {
    let res = await getAllDepartment();
    this.setState({
      arrDepartment: res.data,
    });
  };

  handleClickDepartment = (id) => {
    this.setState({
      departmentId: id,
    });
    this.getAllCategotyByDepartment(id);
  };

  handleCreateNewCategory = () => {
    this.setState({
      isOpenModalAdd: true,
    });
  };

  toggleModalAdd = () => {
    this.setState({
      isOpenModalAdd: !this.state.isOpenModalAdd,
    });
  };
  toggleModaEdit = () => {
    this.setState({
      isOpenModalEdit: !this.state.isOpenModalEdit,
    });
  };

  handleEditCategory = async (item) => {
    this.setState({
      isOpenModalEdit: true,
      editCategory: item,
    });
  };

  createNewCategory = async (data) => {
    data["id"] = this.state.departmentId;
    try {
      let response = await createNewCategory(data);
      console.log(response);
      if (response && response.errCode !== 0) {
        alert(response.message);
      } else {
        this.getAllCategotyByDepartment(this.state.departmentId);
        this.setState({
          isOpenModalAdd: false,
        });
        emitter.emit("EVENT_CLEAR_MODAL_DATA");
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleDeleteCategory = async (id) => {
    try {
      let check = window.confirm("You want to delete!");
      if (check) {
        let response = await deleteCategoryService(id);
        if (response && response.errCode !== 0) {
          alert(response.message);
        } else {
          this.getAllCategotyByDepartment(this.state.departmentId);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  DoEditCategory = async (data) => {
    try {
      let response = await editCategoryService(data);
      console.log(response);
      if (response && response.errCode !== 0) {
        alert(response.message);
      } else {
        this.getAllCategotyByDepartment(this.state.departmentId);
        this.setState({
          isOpenModalEdit: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  getCurrentCategoryPage = (currentPage) => {
    let arrCategoris = this.state.arrCategoris;
    let newCategories = [];
    for (let i = currentPage * 5 - 5; i < currentPage * 5; i++) {
      if (i >= arrCategoris.length) {
        break;
      } else {
        let obj = arrCategoris[i];
        newCategories.push(obj);
      }
    }
    this.setState({
      newCategories: newCategories,
    });
  };

  handleClickPage = (data) => {
    let currentPage = data.selected + 1;
    this.getCurrentCategoryPage(currentPage);
  };

  downloadCategory = async (id) => {
    let res = await downloadCategoryZip(id);
    console.log("check res", res)
    if (res.size < 50) {
      {
        console.log("Not data")
      }
    }
    else {
      FileDownload(res, "filename.zip");
    }

  };

  downloadCategoryByCsv = async (id) => {
    let res = await downloadCategoryCsv(id);
    console.log("check res", res)

    FileDownload(res, "filename.csv");
    if (!_.isEmpty(res)) {
      alert("Don't has data!");
    }

    console.log(_.isEmpty(res));
  };

  downloadCategoryCsv;

  render() {
    let arrTopics = this.state.newTopics;
    console.log("check state: ", this.state);
    let { arrDepartment, newCategories, pageCount } = this.state;

    return (
      <div className="category-container">
        <ModalCategory
          isOpenAdd={this.state.isOpenModalAdd}
          toggleModalAdd={this.toggleModalAdd}
          createNewCategory={this.createNewCategory}
        />
        {this.state.isOpenModalEdit === true && (
          <ModalCategory
            isOpenEdit={this.state.isOpenModalEdit}
            toggleModalEdit={this.toggleModaEdit}
            DoEditCategory={this.DoEditCategory}
            editCategory={this.state.editCategory}
          />
        )}

        <div className="title text-center">Manage Categories</div>
        <div className="department-content">
          <div className="content-left">
            <div className="Department-text">Departments</div>
            <div className="list-department ">
              {arrDepartment &&
                arrDepartment.length > 0 &&
                arrDepartment.map((item, index) => {
                  return (
                    <div className="department topic">
                      <label
                        onClick={() => {
                          this.handleClickDepartment(item.id);
                        }}
                      >
                        {item.department_name}
                      </label>

                    </div>
                  );
                })}
            </div>
          </div>
          <div className="content-right">
            <div className="mx-3">
              <button
                className="btn btn-primary px-3"
                onClick={() => {
                  this.handleCreateNewCategory();
                }}
              >
                <i className="fas fa-plus"></i> Create New Category
              </button>
            </div>
            <div className="user-table mt-3 mx-3">
              <table id="customers">
                <tbody>
                  <tr>
                    <th>Category Name</th>
                    <th>Description</th>
                    <th>Start date</th>
                    <th>First closure date</th>
                    <th>Final closure date</th>
                    <th>Actions</th>
                    <th>Download</th>
                  </tr>
                  {newCategories &&
                    newCategories.length > 0 &&
                    newCategories.map((item, indext) => {
                      return (
                        <>
                          <tr>
                            <td>{item.category_name}</td>
                            <td>{item.description}</td>
                            <td>
                              {moment(item.start_date).format(
                                "YYYY-MM-DD h:mm"
                              )}
                            </td>
                            <td>
                              {moment(item.first_closure_date).format(
                                "YYYY-MM-DD h:mm"
                              )}
                            </td>
                            <td>
                              {moment(item.final_closure_date).format(
                                "YYYY-MM-DD h:mm"
                              )}
                            </td>
                            <td className="text-center">
                              <button
                                className="btn-edit"
                                onClick={() => this.handleEditCategory(item)}
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn-delete"
                                onClick={() =>
                                  this.handleDeleteCategory(item.id)
                                }
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </td>
                            <td className="text-center">
                              <div>

                                <label htmlFor="downloadZip" className="fas fa-download" onClick={() => {
                                  this.downloadCategory(item.id);
                                }}> Zip</label>
                              </div>
                              <div>

                                <label htmlFor="downloadCSV" className="fas fa-download"
                                  onClick={() => {
                                    this.downloadCategoryByCsv(item.id);
                                  }}> CSV</label>
                              </div>
                            </td>
                          </tr>
                        </>
                      );
                    })}
                </tbody>
              </table>
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
            </div>
          </div>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageCategory);
