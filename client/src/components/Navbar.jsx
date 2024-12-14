import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { FaUserCircle } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

function NavbarComponent() {
  const { user, dispatch } = useContext(AuthContext);
  let navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      if (token) {
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Navbar
    expand="lg"
    className={`bg-body-tertiary`}
  >
    <Container>
      <Navbar.Brand href="/">TASK MANAGER HOME</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          {/* <Nav.Item>
            <Link
              to={"/"}
              className="nav-link text-decoration-none link-light"
              style={{ color: "white" }}
            >
              Home
            </Link>
          </Nav.Item> */}
 

        </Nav>
        {user && (
          <Nav>
            <NavDropdown
              title={
                <span style={{ fontWeight: "bold", color: "white", fontSize: "1.1rem", marginRight: "10px" }}>
                  <FaUserCircle style={{ fontSize: "1.5rem", marginRight: "5px" }} /> {user.firstName}
                </span>
              }
              id="basic-nav-dropdown"

            >
              <NavDropdown.Item onClick={handleLogout}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        )}

      </Navbar.Collapse>
    </Container>
  </Navbar>
  );
}

export default NavbarComponent;
