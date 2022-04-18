import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import {
  getAllDepartment,
  createNewDepartment,
  editDepartmentService,
  deleteDepartMentService,
} from "../../../services/departmentService";
import ReactPaginate from "react-paginate";
import "./ManageDepartment.scss";

class ManageDepartment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDepartment: [],
      newDepartments: [],
      pageCount: "",
      action: "Add",
      name: "",
      id: "",
    };
  }

  componentDidMount() {
    this.getAllDepartment();
  }

  getAllDepartment = async () => {
    let res = await getAllDepartment();
    this.setState({
      arrDepartment: res.data,
    });

    let pageCount = Math.ceil(res.data.length / 5);
    this.setState({
      pageCount: pageCount,
    });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.arrDepartment !== this.state.arrDepartment) {
      this.getCurrentDepartmentPage(1);
    }
  }

  getCurrentDepartmentPage = (currentPage) => {
    let arrDepartment = this.state.arrDepartment;
    let newDepartments = [];
    for (let i = currentPage * 5 - 5; i < currentPage * 5; i++) {
      if (i >= arrDepartment.length) {
        break;
      } else {
        let obj = arrDepartment[i];
        newDepartments.push(obj);
      }
    }
    this.setState({
      newDepartments: newDepartments,
    });
  };

  handleClickPage = (data) => {
    let currentPage = data.selected + 1;
    this.getCurrentDepartmentPage(currentPage);
  };

  handleSubmitDepartment = async () => {
    let { action, name, id } = this.state;
    if (!name) {
      alert("Missing departname");
      return;
    } else {
      if (action == "Add") {
        let res = await createNewDepartment({ name: name });
        if (res.errCode == 0) {
          toast.success("Create department successfully!");
        }
        this.getAllDepartment();
      } else {
        let res = await editDepartmentService({ id: id, name: name });
        if (res.errCode == 0) {
          toast.success("Update department successfully!");
        }
        toast.success("Update department successfully!");

        this.getAllDepartment();
      }
      this.setState({
        id: "",
        name: "",
        action: "Add",
      });
    }
  };

  handleOnChangeInput = (e) => {
    this.setState({
      name: e.target.value,
    });
  };

  handleEditDepartment = (item) => {
    this.setState({
      action: "Edit",
      name: item.department_name,
      id: item.id,
    });
  };

  handleDeleteDepartment = async (id) => {
    let check = window.confirm("You want to delete!");
    console.log(check);
    if (check) {
      let res = await deleteDepartMentService(id);
      console.log(res);
      this.getAllDepartment();
    }
  };

  render() {
    let { pageCount, newDepartments, action, name } = this.state;
    console.log("check state: ", this.state);
    return (
      <div className="department-container">
        <div className="title text-center">Manage Department</div>
        <div className="mx-3">
          <input
            type="text"
            placeholder="Enter department name"
            value={name}
            onChange={(e) => {
              this.handleOnChangeInput(e);
            }}
          />
          <button
            className={
              action == "Add"
                ? "btn btn-primary px-3 ml-9"
                : "btn btn-primary px-3 ml-9 btn-update"
            }
            onClick={() => {
              this.handleSubmitDepartment();
            }}
          >
            {action == "Add" ? "Save" : "Update"}
          </button>
        </div>
        <div className="user-table mt-3 mx-3">
          <table id="customers">
            <tbody>
              <tr>
                <th>ID</th>
                <th>Department Name</th>
                <th>Actions</th>
              </tr>
              {newDepartments &&
                newDepartments.length > 0 &&
                newDepartments.map((item, index) => {
                  return (
                    <>
                      <tr>
                        <td>{item.id}</td>
                        <td>{item.department_name}</td>
                        <td className="text-center">
                          <button
                            className="btn-edit"
                            onClick={() => {
                              this.handleEditDepartment(item);
                            }}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => {
                              this.handleDeleteDepartment(item.id);
                            }}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
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
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDepartment);
