import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom"; //useLocation
import {
  Button,
  Table,
  Modal,
  FormControl,
  Col,
  Row,
  Image,
} from "react-bootstrap";
import axios from "axios";
import Loading from "./Loading";
import "./../css/Loading.css";

function Home() {
  const [user, setUser] = useState({});
  const [allUser, setAllUser] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [activeDelete, setActiveDelete] = useState(null);
  const [disable, setDisable] = useState(false);
  const [modalDelete, setModalDelete] = useState(null);
  // const [show, setShow] = useState(false);
  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);
  // const location = useLocation();
  const navigate = useNavigate();
  // const {_id,username} = location.state.user

  const findAllUser = async () => {
    const response = await axios.get(
      "https://diown-app-server.herokuapp.com/auth/allUser"
    );
    setAllUser(response.data);
  };

  const clickHandler = (e, index) => {
    setActiveModal(index);
  };

  const hideModal = () => {
    setActiveModal(null);
  };

  const clickHandler2 = (e, index) => {
    setModalDelete(index);
  };

  const hideModal2 = () => {
    setModalDelete(null);
  };

  const deleteUser = async (index, id) => {
    hideModal2();
    setActiveDelete(index);
    setButtonLoading(true);
    setDisable(true);
    const response = await axios.post(
      "https://diown-app-server.herokuapp.com/auth/deleteUser",
      { id },
      { "content-type": "application/json" }
    );
    const result = response.data;
    console.log(result);
    const findNumber = allUser.indexOf({ _id: id.toString() });
    allUser.splice(findNumber, 1);
    setActiveDelete(null);
    setButtonLoading(false);
    setDisable(false);
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
        setUser(user);
        setLoading(false);
      } else {
        localStorage.removeItem("token");
        navigate("/");
      }
    },
    [navigate]
  );

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (token !== null) {
      RememberMe(token);
      findAllUser();
    } else {
      navigate("/");
    }
  }, [navigate, RememberMe]);

  return (
    <>
      {loading === false ? (
        <div className="p-5">
          <Row>
            <Col>
              <h1>User Management</h1>
            </Col>
            <Col
              lg={{ span: 3, offset: 9 }}
              md={{ span: 3, offset: 9 }}
              sm={{ span: 3, offset: 9 }}
              className="mb-3"
            >
              <FormControl
                type="search"
                placeholder="Search.."
                className=""
                aria-label="Search"
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>
          </Row>

          <Table responsive="sm" className="table table-bordered ">
            <thead className="text-center bg-dark text-light">
              <tr>
                <th>Number</th>
                <th>Username</th>
                <th>Email</th>
                <th>Following</th>
                <th>Follower</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allUser
                .filter((e) => {
                  if (search === "") {
                    return e;
                  } else if (
                    e.username.toLowerCase().includes(search.toLowerCase()) ||
                    e.email.toLowerCase().includes(search.toLowerCase())
                  ) {
                    return e;
                  } else {
                    return null;
                  }
                })
                .map((e, i) => {
                  const url =
                    "https://storage.googleapis.com/noseason/" +
                    e.profile_image;
                  return (
                    <tr key={e._id}>
                      <th className="text-center">#{i + 1}</th>
                      <td className="text-center">{e.username}</td>
                      <td className="text-center">{e.email}</td>
                      <td className="text-center">{e.following_num}</td>
                      <td className="text-center">{e.follower_num}</td>
                      <td className="text-center">
                        <Button
                          variant="outline-info me-2 mb-1"
                          id={e._id}
                          onClick={(e) => clickHandler(e, i)}
                        >
                          Detail
                        </Button>
                        <Button
                          variant="outline-danger mb-1"
                          onClick={(e) => {
                            clickHandler2(e, i);
                          }}
                          id={e._id}
                          disabled={disable ? true : false}
                        >
                          {(buttonLoading !== false) & (activeDelete === i) ? (
                            <i className="fas fa-spinner fa-spin" />
                          ) : (
                            <></>
                          )}
                          <span>Delete</span>
                        </Button>
                      </td>
                      <Modal
                        id={e._id}
                        size="lg"
                        show={activeModal === i}
                        onHide={hideModal}
                        centered
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>Detail</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="p-5">
                          <Row className=" justify-content-md-center row">
                            <Col className="d-flex flex-column align-items-center justify-content-center">
                              <Image
                                src={url}
                                fluid
                                width={250}
                                rounded
                                thumbnail
                                screen_size={6}
                              />
                            </Col>
                          </Row>
                          <br></br>
                          <h4>Username: {e.username}</h4>
                          <p>
                            <b>Email:</b> {e.email}
                          </p>
                          <p>
                            <b>Bio:</b> {e.bio}
                          </p>
                          <p>
                            <b>Following:</b> {e.following_num}
                          </p>
                          <p>
                            <b>Follower:</b> {e.follower_num}
                          </p>
                          <p>
                            <b>Putdown Diary: </b>
                            {e.putdown_num}
                          </p>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="danger" onClick={hideModal}>
                            Close
                          </Button>
                        </Modal.Footer>
                      </Modal>
                      <Modal
                        id={e._id}
                        size="lg"
                        show={modalDelete === i}
                        onHide={hideModal2}
                        centered
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>
                            Are you sure to delete this account?
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="p-5">
                          <Row className=" justify-content-md-center row">
                            <Col className="d-flex flex-column align-items-center justify-content-center">
                              <Image
                                src={url}
                                fluid
                                width={250}
                                rounded
                                thumbnail
                                screen_size={6}
                              />
                            </Col>
                          </Row>
                          <br></br>
                          <h4>Username: {e.username}</h4>
                          <p>
                            <b>Email:</b> {e.email}
                          </p>
                          <p>
                            <b>Bio:</b> {e.bio}
                          </p>
                          <p>
                            <b>Following:</b> {e.following_num}
                          </p>
                          <p>
                            <b>Follower:</b> {e.follower_num}
                          </p>
                          <p>
                            <b>Putdown Diary: </b>
                            {e.putdown_num}
                          </p>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="primary" onClick={hideModal2}>
                            Close
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => deleteUser(i, e._id)}
                          >
                            Delete
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
          {/* {allUser.map((e) => (
          <Modal
            key={e._id}
            show={show}
            onHide={handleClose}
            size="lg"
            centered
          >
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
              <Button variant="danger" onClick={handleClose}>
                ok
              </Button>
            </Modal.Footer>
          </Modal>
        ))} */}
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default Home;
