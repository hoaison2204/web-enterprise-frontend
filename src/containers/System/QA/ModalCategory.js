import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import _ from "lodash";

class ModalCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      description: "",
      startdate: "",
      firstdate: "",
      finaldate: "",
    };
  }

  componentDidMount() {
    let editCategory = this.props.editCategory;
    if (editCategory && !_.isEmpty(editCategory)) {
      this.setState({
        id: editCategory.id,
        name: editCategory.category_name,
        description: editCategory.description,
        startdate: editCategory.start_date,
        firstdate: editCategory.first_closure_date,
        finaldate: editCategory.final_closure_date,
      });
    }

    console.log("check did mount: ", this.props.editUser);
  }

  toggleAdd = () => {
    this.setState({
      id: "",
      name: "",
      description: "",
      startdate: "",
      firstdate: "",
      finaldate: "",
    });
    this.props.toggleModalAdd();
  };

  toggleModalEdit = () => {
    this.setState({
      id: "",
      name: "",
      description: "",
      startdate: "",
      firstdate: "",
      finaldate: "",
    });
    this.props.toggleModalEdit();
  };

  handleOnChangeInput = (e, id) => {
    let copystate = { ...this.state };
    copystate[id] = e.target.value;
    console.log(e.target.value);
    this.setState({
      ...copystate,
    });
  };

  checkValideInput = () => {
    let arrInput = [
      "name",
      "description",
      "startdate",
      "firstdate",
      "finaldate",
    ];
    for (let i = 0; i < arrInput.length; i++) {
      if (!this.state[arrInput[i]]) {
        alert("Missing parameter " + arrInput[i]);
        return false;
      }
    }
    let { startdate, firstdate, finaldate } = this.state;
    startdate = new Date(startdate).getTime();
    firstdate = new Date(firstdate).getTime();
    finaldate = new Date(finaldate).getTime();

    if (startdate > firstdate) {
      alert("Start date must be smaller than first date");
      return false;
    }
    if (firstdate > finaldate) {
      alert("First date  must be smaller than Final date");
      return false;
    }

    return true;
  };

  handleAddNewCategory = () => {
    let check = this.checkValideInput();
    if (check) {
      this.props.createNewCategory(this.state);
      console.log("Done");
    }
    this.setState({
      id: "",
      name: "",
      description: "",
      startdate: "",
      firstdate: "",
      finaldate: "",
    });
  };

  handleEditCategory = () => {
    let check = this.checkValideInput();
    if (check) {
      this.props.DoEditCategory(this.state);

      console.log("Done");
    }
  };

  render() {
    // console.log("Check state model: ", this.state);
    return (
      <div>
        <Modal
          id="AddTopic"
          isOpen={this.props.isOpenAdd}
          toggle={() => {
            this.toggleAdd();
          }}
          size="lg"
          centered={true}
          className="modal-user-container"
        >
          <ModalHeader
            toggle={() => {
              this.toggleAdd();
            }}
          >
            Create New Category
          </ModalHeader>
          <ModalBody>
            <div className="modal-user-body">
              <div className="input-container">
                <label>Category Name</label>
                <input
                  type="text"
                  onChange={(e) => {
                    this.handleOnChangeInput(e, "name");
                  }}
                  value={this.state.name}
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
                <label>Start date</label>
                <input
                  type="datetime-local"
                  onChange={(e) => {
                    this.handleOnChangeInput(e, "startdate");
                  }}
                  value={this.state.startdate}
                />
              </div>
              <div className="input-container">
                <label>First closure date</label>
                <input
                  type="datetime-local"
                  onChange={(e) => {
                    this.handleOnChangeInput(e, "firstdate");
                  }}
                  value={this.state.firstdate}
                />
              </div>
              <div className="input-container">
                <label>Final closure date</label>
                <input
                  type="datetime-local"
                  onChange={(e) => {
                    this.handleOnChangeInput(e, "finaldate");
                  }}
                  value={this.state.finaldate}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => {
                this.handleAddNewCategory();
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

        <Modal
          id="EditUser"
          isOpen={this.props.isOpenEdit}
          toggle={() => {
            this.toggleModalEdit();
          }}
          size="lg"
          centered={true}
          className="modal-user-container"
        >
          <ModalHeader
            toggle={() => {
              this.toggleModalEdit();
            }}
          ></ModalHeader>
          <ModalBody>
            <div className="modal-user-body">
              <div className="input-container">
                <label>Topic Name</label>
                <input
                  type="text"
                  onChange={(e) => {
                    this.handleOnChangeInput(e, "name");
                  }}
                  value={this.state.name}
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
                <label>Start date</label>
                <input
                  type="datetime-local"
                  onChange={(e) => {
                    this.handleOnChangeInput(e, "startdate");
                  }}
                  value={this.state.startdate.split(".")[0]}
                />
              </div>
              <div className="input-container">
                <label>First closure date</label>
                <input
                  type="datetime-local"
                  onChange={(e) => {
                    this.handleOnChangeInput(e, "firstdate");
                  }}
                  value={this.state.firstdate.split(".")[0]}
                />
              </div>
              <div className="input-container">
                <label>Final closure date</label>
                <input
                  type="datetime-local"
                  onChange={(e) => {
                    this.handleOnChangeInput(e, "finaldate");
                  }}
                  value={this.state.finaldate.split(".")[0]}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => {
                this.handleEditCategory();
              }}
              className="px-3"
            >
              Save Change
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalCategory);
