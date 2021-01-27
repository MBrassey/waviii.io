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
              <NavLink href="https://github.com/MBrassey/waviii.io#whitepaper" ><span class="waviii">Whitepaper</span></NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://github.com/MBrassey"><span class="waviii">Source Code</span></NavLink>
            </NavItem>
          </Nav>
          <div className="copyright">
          <p className="waviii">waviii  {new Date().getFullYear()} </p>
          </div>
        </Container>
      </footer>
    );
  }
}

export default Footer;
