import React, { Component } from "react";

// reactstrap components
//import { Button } from "reactstrap";

class FixedPlugin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: "dropdown show-dropdown"
    };
  }
  handleClick = () => {
    if (this.state.classes === "dropdown show-dropdown") {
      this.setState({ classes: "dropdown show-dropdown show" });
    } else {
      this.setState({ classes: "dropdown show-dropdown" });
    }
  };
  activateMode = mode => {
    switch (mode) {
      case "light":
        document.body.classList.add("white-content");
        break;
      default:
        document.body.classList.remove("white-content");
        break;
    }
  };
  render() {
    return (
      <div className="fixed-plugin">
       
      </div>
    );
  }
}

export default FixedPlugin;
