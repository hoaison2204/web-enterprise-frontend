import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import UserManage from "../containers/System/Admin/UserManage";
import './System.scss';
import Header from "../containers/Header/Header";
import ManageCategory from "../containers/System/QA/ManageCategory";
import ViewIdeas from "../containers/System/ViewIdeas";
// import ViewStaff from "../containers/System/ViewStaff";
import ManageIdea from "../containers/System/Staff/ManageIdea";

import ManageDepartment from "../containers/System/QA/ManageDepartment";
import DashboardAdmin from "../containers/System/Admin/DashboardAdmin";

class System extends Component {
  render() {
    const { systemMenuPath, isLoggedIn, userInfo } = this.props;
    let role = this.props.userInfo.role;
    console.log("check prop: ", this.props.userInfo.role == "admin");
    return (
      <React.Fragment>
        {isLoggedIn && <Header />}
        <div className="system-container">
          <div className="system-list system-customize">
            <Switch>
              {/* admin */}
              <Route
                path="/system/dashnoard-admin"
                component={DashboardAdmin}
              />
              <Route
                path="/system/user-manage"
                component={() => {
                  if (role == "admin") return <UserManage />;
                  else return <Redirect to={"/system/dashnoard-admin"} />;
                }}
              />
              <Route
                path="/system/category-manage"
                component={() => {
                  if (role == "admin") {
                    return <ManageCategory />;
                  }
                  if (role == "manage") {
                    return <ManageCategory />;
                  }
                  if (role == "staff") {
                    return <Redirect to={"/system/dashnoard-admin"} />;
                  }
                  if (role == "coordinator") {
                    return <Redirect to={"/system/dashnoard-admin"} />;
                  }
                }}
              />
              <Route
                path="/system/department-manage"
                component={() => {
                  if (role == "admin") {
                    return <ManageDepartment />;
                  }
                  if (role == "manage") {
                    return <ManageDepartment />;
                  }
                  if (role == "staff") {
                    return <Redirect to={"/system/dashnoard-admin"} />;
                  }
                  if (role == "coordinator") {
                    return <Redirect to={"/system/dashnoard-admin"} />;
                  }
                }}
              />
              <Route
                path="/system/manage-idea"
                component={() => {
                  if (role == "staff") {
                    return <ManageIdea />;
                  } else {
                    return <Redirect to={"/system/dashnoard-admin"} />;
                  }
                }}
              />
            </Switch>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    systemMenuPath: state.app.systemMenuPath,
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
