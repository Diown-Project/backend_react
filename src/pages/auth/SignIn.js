import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";
import { Form, Container, Row, Col, Button, Image } from "react-bootstrap";
import Logo from "../../images/logo.png";
import axios from "axios";
import Loading from "./../Loading";
import "./../../css/Loading.css";

function SignIn() {
  const [checked, setChecked] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getInputSignInUserName = (e) => {
    setUsername(e.target.value);
  };
  const getInputSignInPassword = (e) => {
    setPassword(e.target.value);
  };

  const login = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      "https://diown-app-server.herokuapp.com/auth/adminLogin",
      { username, password },
      { "Content-Type": "application/json" }
    );
    const user = await response.data;
    if (user.message === "success") {
      localStorage.setItem("token", user.token);
      navigate("/home");
    } else {
      alert("Your username or password is wrong. Please try again.");
    }
  };

  const RememberMe = useCallback(
    async (token) => {
      const response = await axios.post(
        "https://diown-app-server.herokuapp.com/auth/RememberMeAdmin",
        { token },
        { "Content-Type": "application/json" }
      );
      const user = await response.data;
      if (user != null) {
        navigate("/home");
      } else {
        localStorage.removeItem("token");
        setChecked(true);
        setLoading(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (token !== null) {
      RememberMe(token);
    } else {
      setChecked(true);
      setLoading(false);
    }
  }, [RememberMe]);
  return (
    <>
      {loading === false ? (
        <>
          {checked !== false ? (
            <Container>
              <h1 className=" shadow-sm text-success mt-5 p-3 text-center rounded">
                Admin Login
              </h1>
              <Row className="mt-5">
                <Col
                  lg={5}
                  md={6}
                  sm={12}
                  className="p-5 m-auto shadow-sm rounded-lg"
                >
                  <Form onSubmit={login}>
                    <Image
                      src={Logo}
                      alt=""
                      width="250"
                      className="img-fluid mx-auto d-block"
                    />
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Admin ID:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter ID"
                        onChange={getInputSignInUserName}
                        required
                      />
                      <Form.Text className="text-muted">
                        Only admin can access to this website.
                      </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label>Password:</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        onChange={getInputSignInPassword}
                        required
                      />
                    </Form.Group>
                    <div className="d-grid gap-2">
                      <Button variant="success btn-block" type="submit">
                        Submit
                      </Button>
                    </div>
                  </Form>
                </Col>
              </Row>
            </Container>
          ) : (
            <Container></Container>
          )}
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default SignIn;
