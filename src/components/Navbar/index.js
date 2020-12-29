import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Link } from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import Logo  from '../../styles/icons/smooches-inc-logo.png';


export default function MyNavbar(props) {
  const logMeOut = e => {
    e.preventDefault();
    firebase.auth().signOut();
  };
  const { user } = props;
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  return (
    <div>
      <Navbar color="dark" dark expand="md" className="justify-content-between">
      <Link className="navbar-brand" to="/">
      <img src={ Logo } alt={'Smooches Inc logo'} className="logo" />
        </Link>
        
        <Link className="navbar-brand" to="/">
          
        </Link>
        <NavbarToggler onClick={toggle} />
        
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
          <NavItem className="d-flex justify-content-center">
              <Link className="nav-link" to="/">
                Dashboard
              </Link>
            </NavItem>
            <NavItem className="d-flex justify-content-center">
              <Link className="nav-link" to="/create-service">
                Create Service
              </Link>
            </NavItem>
            <NavItem className="d-flex justify-content-center">
              <Link className="nav-link" to="/request-service">
                Request Service
              </Link>
            </NavItem>
            <NavItem className="d-flex justify-content-center">
              <Link className="nav-link" to="/leave-review">
                Leave Review
              </Link>
            </NavItem>
            <NavItem className="d-flex justify-content-center">
              <Link className="nav-link" to="/user-connect">
              Link Accounts 
              </Link>
            </NavItem>
          </Nav>
          {/* "Optional chaining operator: (?.)" gives the prop time to load without throwing errors. 
        Only use this if you know your props are correct and need time to load. 
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining */}
          {user && (
            <>
              <img
                className="userInfo"
                src={user?.photoURL}
                alt={user?.displayName}
              />
              <UncontrolledDropdown>
                <DropdownToggle nav caret></DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>{user?.displayName}</DropdownItem>
                  <DropdownItem>
                    <div
                      className="nav-link btn btn-danger"
                      onClick={e => logMeOut(e)}
                    >
                      Logout
                    </div>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </>
          )}
        </Collapse>
      </Navbar>
    </div>
  );
}
