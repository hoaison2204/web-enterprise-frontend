import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";

import * as actions from "../../store/actions";

import "./Login.scss";
import { handleLoginAPI } from "../../services/userService";
import { FormattedMessage } from "react-intl";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      isShowPass: false,
      errMessage: "",
    };
  }
  handleOnChangeUser = (e) => {
    this.setState({
      username: e.target.value,
    });
    console.log(e.target.value);
  };
  handleOnChangePass = (e) => {
    this.setState({
      password: e.target.value,
    });
    console.log(e.target.value);
  };

  handleLogin = async () => {
    this.setState({
      errMessage: "",
    });
    try {
      let data = await handleLoginAPI(this.state.username, this.state.password);
      if (data && data.errCode !== 0) {
        this.setState({
          errMessage: data.message,
        });
      }
      if (data && data.errCode == 0) {
        this.props.userloginSuccess(data.user);
        console.log("Login done");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.data) {
          this.setState({
            errMessage: error.response.data.message,
          });
        }
      }
    }
  };

  handleShowPass = () => {
    this.setState({
      isShowPass: !this.state.isShowPass,
    });
  };

  render() {
    return (
      <div className="login-background">
        <div className="login-container">
          <div className="login-content">
            <div className="col-12 login-text">Login</div>
            <div className="col-12 form-group login-input">
              <label>User Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your email"
                value={this.state.username}
                onChange={(e) => {
                  this.handleOnChangeUser(e);
                }}
              />
            </div>
            <div className="col-12 form-group login-input">
              <label>Password</label>
              <div className="custom-input-pass">
                <input
                  type={this.state.isShowPass ? "text" : "password"}
                  className="form-control"
                  placeholder="Enter your password"
                  value={this.state.password}
                  onChange={(e) => {
                    this.handleOnChangePass(e);
                  }}
                />
                <span
                  onClick={() => {
                    this.handleShowPass();
                  }}
                >
                  <i
                    className={
                      this.state.isShowPass ? "fas fa-eye" : "fas fa-eye-slash"
                    }
                  ></i>
                </span>
              </div>
            </div>
            <div className="col-12" style={{ color: "red" }}>
              {this.state.errMessage}
            </div>
            <div className="col-12">
              <button
                className="btn-login"
                onClick={() => {
                  this.handleLogin();
                }}
              >
                Login
              </button>
            </div>

            <div className="col-12">
              <span className="login-forgot">Forgot your password</span>
            </div>
            <div className="col-12 text-center">
              <span className="text-other-login">Or Login with:</span>
            </div>
            <div className="col-12 social-login">
              <i className="fab fa-google-plus-g google"></i>
              <i className="fab fa-facebook facebook"></i>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (path) => dispatch(push(path)),
    // userLoginFail: () => dispatch(actions.userLoginFail()),
    userloginSuccess: (userInfo) =>
      dispatch(actions.userloginSuccess(userInfo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
