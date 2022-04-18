import React, { Component } from "react";
import { connect } from "react-redux";
import "./Widget.scss";

class Widget extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() { }

  render() {
    let { data } = this.props;
    return (
      <div className="widget">
        <div className="left">
          <span className="title">{data.title}</span>
          <span className="counter">{data.count}</span>
        </div>
        <div className="right"></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Widget);
