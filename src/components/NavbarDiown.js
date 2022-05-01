import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Navbar, Container, Image, Modal, Button } from "react-bootstrap";
import "./Navbar.css";
import Logo from "../images/logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function NavbarDiown() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({});
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const RememberMe = useCallback(
    async (token) => {
      const response = await axios.post(
        "https://diown-app-server.herokuapp.com/auth/RememberMeAdmin",
        { token },
        { "Content-Type": "application/json" }
      );
      const user = await response.data;
      if (user != null) {
        setAdmin(user);
      } else {
        localStorage.removeItem("token");
        navigate("/");
      }
    },
    [navigate]
  );

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== null) {
      RememberMe(token);
    } else {
      navigate("/");
    }
  }, [RememberMe, navigate]);

  return (
    <>
      {admin !== {} ? (
        <>
          <Navbar variant="light" bg="light" expand="lg">
            <Container fluid>
              <Navbar.Brand href="">
                <Image src={Logo} width="120" />
              </Navbar.Brand>
              <Navbar.Toggle />

              <Navbar.Collapse>
                <ul className="navbar-nav mr-auto">
                  <li className="nav-item">
                    <Link className="nav-link" to="/home">
                      User Management
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/event">
                      Event
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/petition">
                      Petition
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/UserMarker">
                      Marker
                    </Link>
                  </li>
                </ul>

                <div className="my-2 ms-lg-auto">
                  <Navbar.Text>
                    Signed in as: <a href="#a">{admin.username}</a>
                  </Navbar.Text>
                  <button
                    className="btn btn-danger my-2 my-sm-0 ms-lg-3 ms-md-3 ms-sm-3"
                    onClick={handleShow}
                  >
                    Logout
                  </button>
                </div>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <Modal size="lg" show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>Exit of BackEnd.</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Do you want to logout of BackEnd, Please confirm it to logout!
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="danger" onClick={logout}>
                ok
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <Container></Container>
      )}
    </>
  );
}

export default NavbarDiown;
