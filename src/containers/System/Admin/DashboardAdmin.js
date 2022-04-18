import React, { Component } from "react";
import { connect } from "react-redux";
import "./DashboardAdmin.scss";
import Widget from "../Widget";
import { getAllUsers } from "../../../services/userService";
import { getAllDepartment } from "../../../services/departmentService";
import { getAllCategory } from "../../../services/categoryService";
import {
  getAllIdea,
  getIdeaLikeMost,
  getIdeaNewPost,
} from "../../../services/topicService";
import ViewIdeas from "../ViewIdeas";

class DashboardAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataUser: "",
      dataDepartment: "",
      dataCategory: "",
      dataIdea: "",
      IdeaMostLike: "",
      CountLikeMost: "",
      TopPoster: "",
      IdeaNewPost: "",
      NewPoster: "",
    };
  }

  componentDidMount() {
    this.getAllUserFromReact();
    this.getAllDepartment();
    this.getAllCategory();
    this.getAllIdea();
    this.getIdeaLikeMost();
    this.getIdeaNewPost();
  }
  componentDidUpdate(prevProps, prevState, snapshot) { }

  getAllUserFromReact = async () => {
    let response = await getAllUsers("ALL");

    let dataUser = { title: "Total Account", count: response.users.length };
    this.setState({
      dataUser: dataUser,
    });
  };

  getAllDepartment = async () => {
    let res = await getAllDepartment();
    let dataDepartment = { title: "Total Department", count: res.data.length };
    this.setState({
      dataDepartment: dataDepartment,
    });
  };

  getAllCategory = async () => {
    let res = await getAllCategory();
    let dataCategory = { title: "Total Category", count: res.data.length };
    this.setState({
      dataCategory: dataCategory,
    });
  };

  getAllIdea = async () => {
    let res = await getAllIdea();
    let dataIdea = { title: "Total Ideas", count: res.data.length };
    this.setState({
      dataIdea: dataIdea,
    });
  };

  getIdeaLikeMost = async () => {
    let res = await getIdeaLikeMost();
    if (res && res.errCode == 0) {
      this.setState({
        IdeaMostLike: res.data,
        CountLikeMost: res.count,
        TopPoster: res.data.User,
      });
    }

  };

  getIdeaNewPost = async () => {
    let res = await getIdeaNewPost();
    if (res.errCode == 0) {
      this.setState({
        IdeaNewPost: res.data,

        NewPoster: res.data.User,
      });
    };
    console.log(res)

  };

  render() {
    let {
      dataUser,
      dataDepartment,
      dataCategory,
      dataIdea,
      IdeaMostLike,
      CountLikeMost,
      TopPoster,
      IdeaNewPost,
      NewPoster,
    } = this.state;
    let role = this.props.userInfo.role;

    console.log("check state ok", this.state)

    return (
      <>
        <div className="w3-row">
          <div className="w3-quarter">
            {role == "admin" && <Widget data={dataUser} />}
          </div>
          <div className="w3-quarter">
            {role == "admin" && <Widget data={dataDepartment} />}
            {role == "manage" && <Widget data={dataDepartment} />}
          </div>
          <div className="w3-quarter">
            {role == "manage" && <Widget data={dataCategory} />}
            {role == "admin" && <Widget data={dataCategory} />}
          </div>
          <div className="w3-quarter">
            {role == "manage" && <Widget data={dataIdea} />}
            {role == "admin" && <Widget data={dataIdea} />}
          </div>
        </div>
        <div className="top-idea container">
          <div className="most-idea">
            <div className="title">Most liked idea</div>
            {IdeaMostLike && <>
              <div>
                <div>
                  Poster: {TopPoster.lastname + " " + TopPoster.firstname}
                </div>
                <div>{CountLikeMost}Like</div>
              </div>
              <div>Name: {IdeaMostLike.idea_name}</div>
              <div>Description: {IdeaMostLike.description}</div>
            </>}

          </div>
          <div className="most-idea">
            <div className="title">Latest idea</div>
            {IdeaNewPost && <>
              <div>
                <div>
                  Poster: {NewPoster.lastname + " " + NewPoster.firstname}
                </div>
              </div>
              <div>Name: {IdeaNewPost.idea_name}</div>
              <div>Description: {IdeaNewPost.description}</div>
            </>}

          </div>
        </div>
        <div className="all-ideas">
          <div className="title">All Ideas</div>
          <ViewIdeas />
        </div>
      </>
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

export default connect(mapStateToProps, mapDispatchToProps)(DashboardAdmin);
