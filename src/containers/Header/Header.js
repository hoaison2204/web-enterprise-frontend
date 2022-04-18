import React, { Component } from "react";
import { connect } from "react-redux";

import * as actions from "../../store/actions";
import Navigator from "../../components/Navigator";
import { adminMenu, QAManage, StaffMenu, QACoordinator } from "./menuApp";
import "./Header.scss";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: [],
    };
  }

  componentDidMount() {
    this.checkmenu(this.props.userInfo.role);
  }

  checkmenu = (role) => {
    if (role == "admin") {
      this.setState({
        menu: adminMenu,
      });
    }
    if (role == "staff") {
      this.setState({
        menu: StaffMenu,
      });
    }
    if (role == "manage") {
      this.setState({
        menu: QAManage,
      });
    }
    if (role == "coordinator") {
      this.setState({
        menu: QACoordinator,
      });
    }
  };
  render() {
    const { processLogout } = this.props;
    const { menu } = this.state;

    return (
      <div className="header-container">
        {/* thanh navigator */}
        <div className="header-tabs-container">
          <Navigator menus={menu} />
        </div>

        {/* nút logout */}
        <div className="btn btn-logout" onClick={processLogout}>
          <i className="fas fa-sign-out-alt"></i>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    processLogout: () => dispatch(actions.processLogout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
