import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { emitter } from "../../../utils/emitter";
import "./Usermanage.scss";
import {
  getAllUsers,
  createNewUserService,
  deleteUserService,
  editUserService,
} from "../../../services/userService";
import { getAllDepartment } from "../../../services/departmentService";
import ModalUser from "./ModalUser";
import _ from "lodash";
import ReactPaginate from "react-paginate";

class UserManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrUser: [],
      arrDepartment: [],
      newUsers: [],
      isOpenModalUser: false,
      isOpenModalEditUser: false,
      editUser: {},
      pageCount: "",
    };
  }

  async componentDidMount() {
    await this.getAllUserFromReact();
    this.getCurrentUserPage(1);
    this.getAllDepartment();
  }

  getAllDepartment = async () => {
    let res = await getAllDepartment();
    this.setState({
      arrDepartment: res.data,
    });
  };

  getAllUserFromReact = async () => {
    let response = await getAllUsers("ALL");
    if (response && response.errCode === 0) {
      let pageCount = Math.ceil(response.users.length / 5);
      this.setState({
        pageCount: pageCount,
        arrUser: response.users,
      });
    }
  };

  handleCreateNewUser = () => {
    this.setState({
      isOpenModalUser: true,
    });
  };

  toggleModalUser = () => {
    this.setState({
      isOpenModalUser: !this.state.isOpenModalUser,
    });
  };
  toggleModaEditlUser = () => {
    this.setState({
      isOpenModalEditUser: !this.state.isOpenModalEditUser,
    });
  };

  handleEditUser = async (item) => {
    let user = await getAllUsers(item.id);
    this.setState({
      isOpenModalEditUser: true,
      editUser: user.users,
    });
  };

  createNewUser = async (data) => {
    try {
      let response = await createNewUserService(data);
      if (response && response.errCode !== 0) {
        alert(response.message);
      } else {
        await this.getAllUserFromReact();
        this.getCurrentUserPage(1);
        this.setState({
          isOpenModalUser: false,
        });
        emitter.emit("EVENT_CLEAR_MODAL_DATA");
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleDeleteUser = async (id) => {
    try {
      let check = window.confirm("You want to delete!");
      if (check) {
        let response = await deleteUserService(id);
        if (response && response.errCode !== 0) {
          alert(response.message);
        } else {
          await this.getAllUserFromReact();
          this.getCurrentUserPage(1);
          this.setState({
            isOpenModalUser: false,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  DoEditUser = async (data) => {
    try {
      let response = await editUserService(data);
      if (response && response.errCode !== 0) {
        alert(response.message);
      } else {
        await this.getAllUserFromReact();
        this.getCurrentUserPage(1);
        this.setState({
          isOpenModalEditUser: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  getCurrentUserPage = (currentPage) => {
    let arrUser = this.state.arrUser;
    let newUsers = [];
    for (let i = currentPage * 5 - 5; i < currentPage * 5; i++) {
      if (i >= arrUser.length) {
        break;
      } else {
        let obj = arrUser[i];
        newUsers.push(obj);
      }
    }
    this.setState({
      newUsers: newUsers,
    });
  };

  handleClickPage = (data) => {
    let currentPage = data.selected + 1;
    this.getCurrentUserPage(currentPage);
  };

  render() {
    let { pageCount, newUsers, arrDepartment } = this.state;
    console.log("chek state: ", this.state);

    return (
      <div className="user-container">
        <ModalUser
          isOpenAdd={this.state.isOpenModalUser}
          toggleModalUser={this.toggleModalUser}
          createNewUser={this.createNewUser}
          arrDepartment={arrDepartment}
        />
        {this.state.isOpenModalEditUser === true && (
          <ModalUser
            isOpenEdit={this.state.isOpenModalEditUser}
            toggleModalUser={this.toggleModaEditlUser}
            DoEditUser={this.DoEditUser}
            editUser={this.state.editUser}
            arrDepartment={arrDepartment}
          />
        )}

        <div className="title text-center">Manage User</div>
        <div className="mx-3">
          <button
            className="btn btn-primary px-3"
            onClick={() => {
              this.handleCreateNewUser();
            }}
          >
            <i className="fas fa-plus"></i> Create New User
          </button>
        </div>
        <div className="user-table mt-3 mx-3">
          <table id="customers">
            <tbody>
              <tr>
                <th>Email</th>
                <th>First Name</th>
                <th>Last name</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
              {newUsers &&
                newUsers.length > 0 &&
                newUsers.map((item, indext) => {
                  return (
                    <>
                      <tr>
                        <td>{item.email}</td>
                        <td>{item.firstname}</td>
                        <td>{item.lastname}</td>
                        <td>{item.role}</td>
                        <td className="text-center">
                          <button
                            className="btn-edit"
                            onClick={() => this.handleEditUser(item)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => this.handleDeleteUser(item.id)}
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

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
