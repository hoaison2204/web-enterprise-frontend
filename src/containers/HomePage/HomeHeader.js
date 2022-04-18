import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./HomeHeader.scss";
import { LANGUAGES } from "../../utils";
import { changeLanguageAPP } from "../../store/actions";

class HomeHeader extends Component {
  onChangeLanguage = (language) => {
    this.props.changeLanguage(language);
  };
  render() {
    let language = this.props.language;
    return (
      <React.Fragment>
        <div className="home-header-container">
          <div className="home-header-content">
            <div className="left-content">
              <i className="fas fa-bars"></i>
              <div className="header-logo"></div>
            </div>
            <div className="center-content">
              <div className="child-content">
                <div>
                  <b>
                    <FormattedMessage id="homeheader.speciality" />
                  </b>
                </div>
                <div className="sub-title">
                  <FormattedMessage id="homeheader.searchdoctor" />
                </div>
              </div>
              <div className="child-content">
                <div>
                  <b>
                    <FormattedMessage id="homeheader.health-facility" />
                  </b>
                </div>
                <div className="sub-title">
                  <FormattedMessage id="homeheader.select-room" />
                </div>
              </div>
              <div className="child-content">
                <div>
                  <b>
                    <FormattedMessage id="homeheader.doctor" />
                  </b>
                </div>
                <div className="sub-title">
                  <FormattedMessage id="homeheader.choose-doctor" />
                </div>
              </div>
              <div className="child-content">
                <div>
                  <b>
                    <FormattedMessage id="homeheader.packet" />
                  </b>
                </div>
                <div className="sub-title">
                  <b>
                    <FormattedMessage id="homeheader.general-health-check" />
                  </b>
                </div>
              </div>
            </div>
            <div className="right-content">
              <div className="support">
                <i className="fas fa-question-circle"></i>
                <span>
                  <FormattedMessage id="homeheader.support" />
                </span>
              </div>
              <div
                className={
                  language === LANGUAGES.VI
                    ? "language-vi active"
                    : "language-vi"
                }
              >
                <span
                  onClick={() => {
                    this.onChangeLanguage(LANGUAGES.VI);
                  }}
                >
                  VI
                </span>
              </div>
              <div
                className={
                  language === LANGUAGES.EN
                    ? "language-en active"
                    : "language-en"
                }
              >
                <span
                  onClick={() => {
                    this.onChangeLanguage(LANGUAGES.EN);
                  }}
                >
                  EN
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="home-header-banner">
          <div className="banner-up">
            <div className="title-1">
              <b>
                <FormattedMessage id="homeheader.medical-background" />
              </b>
            </div>
            <div className="title-2">
              <FormattedMessage id="homeheader.health-care" />
            </div>
            <div className="search">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Tìm chuyên khoa" />
            </div>
          </div>

          <div className="banner-down">
            <div className="opptions">
              <div className="opption-child">
                <div className="icon-child">
                  <i className="fas fa-hospital-alt"></i>
                </div>
                <div className="text-child">
                  <FormattedMessage id="homeheader.specialized-examination" />
                </div>
              </div>
              <div className="opption-child">
                <div className="icon-child">
                  <i className="fas fa-mobile-alt"></i>
                </div>
                <div className="text-child">
                  <FormattedMessage id="homeheader.remote-examination" />
                </div>
              </div>
              <div className="opption-child">
                <div className="icon-child">
                  <i className="fas fa-hospital"></i>
                </div>
                <div className="text-child">
                  <FormattedMessage id="homeheader.general-examination" />
                </div>
              </div>
              <div className="opption-child">
                <div className="icon-child">
                  <i className="fas fa-vials"></i>
                </div>
                <div className="text-child">
                  <FormattedMessage id="homeheader.medical-test" />
                </div>
              </div>
              <div className="opption-child">
                <div className="icon-child">
                  <i class="fas fa-user-md"></i>
                </div>
                <div className="text-child">
                  <FormattedMessage id="homeheader.mental-health" />
                </div>
              </div>
              <div className="opption-child">
                <div className="icon-child">
                  <i className="fas fa-hospital-alt"></i>
                </div>
                <div className="text-child">
                  <FormattedMessage id="homeheader.dental-examination" />
                </div>
              </div>
              <div className="opption-child">
                <div className="icon-child">
                  <i className="fas fa-procedures"></i>
                </div>
                <div className="text-child">
                  <FormattedMessage id="homeheader.surgery-pack" />
                </div>
              </div>
              <div className="opption-child">
                <div className="icon-child">
                  <i className="fas fa-ambulance"></i>
                </div>
                <div className="text-child">
                  <FormattedMessage id="homeheader.medical-products" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeLanguage: (language) => dispatch(changeLanguageAPP(language)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);
