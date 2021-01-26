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
              <NavLink href="https://github.com/luc1dLife" ><span class="waviii3">Whitepaper</span></NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://github.com/luc1dLife"><span class="waviii3">Source Code</span></NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://github.com/luc1dLife"><span class="waviii3">About</span></NavLink>
            </NavItem>
          </Nav>
          <div className="copyright">
          waviii.io  {new Date().getFullYear()} 
          </div>
        </Container>
      </footer>
    );
  }
}

export default Footer;
