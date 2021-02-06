/*eslint-disable*/
import React from "react";
// used for making the prop types of this component
import PropTypes from "prop-types";

// reactstrap components
import { Container, Row, Nav, NavItem, NavLink } from "reactstrap";

class Footer extends React.Component {
  render() {
    return (
      <footer className="footer">
        <Container fluid>
          <Nav>
            <NavItem>
              <NavLink href="https://github.com/MBrassey/waviii-token" ><span className="waviii3">Whitepaper</span></NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://github.com/MBrassey/waviii.io"><span className="waviii3">Source Code</span></NavLink>
            </NavItem>
          </Nav>
          <div className="copyright">
          <a href="https://waviii.io/"><p className="waviii3">waviii  {new Date().getFullYear()} </p></a>
          </div>
        </Container>
      </footer>
    );
  }
}

export default Footer;
