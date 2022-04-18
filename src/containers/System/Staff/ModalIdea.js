import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import _ from "lodash";

class ModalIdea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      categoryId: "",
      startdate: "",
      firstdate: "",
      finaldate: "",
      checkbox: false,

      formData: "",
    };
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.category !== this.props.category) {
      let category = this.props.category;
      if (category && !_.isEmpty(category)) {
        this.setState({
          categoryId: category.id,
          startdate: category.start_date,
          firstdate: category.first_closure_date,
          finaldate: category.final_closure_date,
        });
      }
    }
  }

  toggle = () => {
    this.setState({
      name: "",
      description: "",
      startdate: "",
      firstdate: "",
      finaldate: "",
    });
    this.props.toggleModal();
  };

  handleOnChangeInput = (e, id) => {
    let copystate = { ...this.state };
    copystate[id] = e.target.value;
    this.setState({
      ...copystate,
    });
  };

  checkValideInput = () => {
    let isValide = false;

    let { name, description, formData } = this.state;
    if (!name || !description || !formData) {
      alert("Missing parameter ");
    } else {
      isValide = true;
    }
    return isValide;
  };

  handleAddNewIdea = () => {
    let check = this.checkValideInput();
    if (check) {
      if (!this.state.checkbox) {
        alert("You have not selected the terms");
      } else {
        let { name, description, categoryId, formData } = this.state;
        formData.append("name", name);
        formData.append("description", description);
        formData.append("categoryId", categoryId);
        formData.append("userId", this.props.userId);
        this.setState({
          formData: formData,
        });
        this.props.createNewIdea(formData);
        console.log("Done");
        this.props.toggleModal();
      }
    }
  };

  handleOnChangeFile = (e) => {
    let file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    this.setState({
      formData: formData,
    });
  };

  handleOnChangeCheckbox = (e) => {
    this.setState({
      checkbox: !this.state.checkbox,
    });
    console.log(this.state.checkbox);
  };

  render() {
    console.log("Check state model: ", this.state);
    return (
      <div>
        <Modal
          isOpen={this.props.isOpenModalIdea}
          toggle={() => {
            this.toggle();
          }}
          size="lg"
          centered={true}
          className="modal-user-container"
        >
          <ModalHeader
            toggle={() => {
              this.toggle();
            }}
          >
            Create New User
          </ModalHeader>
          <ModalBody>
            <div className="modal-user-body">
              <div className="col-12">
                <span>
                  <b>Start date:</b>
                </span>
                <span style={{ marginLeft: "40%" }}>
                  <b>End date:</b>
                </span>
              </div>
              <div className="input-container">
                <label>Idea Name</label>
                <input
                  type="text"
                  onChange={(e) => {
                    this.handleOnChangeInput(e, "name");
                  }}
                  value={this.state.name}
                />
              </div>
              <div className="input-container">
                <label>Topic Name</label>
                <input
                  type="text"
                  onChange={(e) => {
                    this.handleOnChangeInput(e, "topic");
                  }}
                  value={this.props.category.category_name}
                  disabled
                />
              </div>
              <div className="input-container">
                <label>Description</label>
                <input
                  type="text"
                  onChange={(e) => {
                    this.handleOnChangeInput(e, "description");
                  }}
                  value={this.state.description}
                />
              </div>
              <div className="input-container">
                <label>Document</label>
                <input
                  type="file"
                  name="file"
                  onChange={(e) => {
                    this.handleOnChangeFile(e);
                  }}
                  style={{ border: "none" }}
                />
              </div>
              <div>
                <input
                  type="checkbox"
                  value={true}
                  onClick={(e) => {
                    this.handleOnChangeCheckbox(e);
                  }}
                />
                Đồng ý với các điều khoản
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => {
                this.handleAddNewIdea();
              }}
              className="px-3"
            >
              Save
            </Button>{" "}
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalIdea);
