import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Table,
  Button,
  Row,
  Col,
  FormControl,
  Modal,
  Image,
} from "react-bootstrap";
import Loading from "./Loading";
import "./../css/Loading.css";

function Event() {
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [activeDelete, setActiveDelete] = useState(null);
  const [disable, setDisable] = useState(false);
  const [modalDelete, setModalDelete] = useState(null);
  const navigate = useNavigate();

  const goEdit = (data) => {
    navigate("/editEvent", { state: { id: data } });
  };

  const clickHandler = (e, index) => {
    setActiveModal(index);
  };

  const hideModal = () => {
    setActiveModal(null);
  };

  const deleteEventPin = async (index, id) => {
    hideModal2();
    setActiveDelete(index);
    setButtonLoading(true);
    setDisable(true);

    const response = await axios.post(
      "https://diown-app-server.herokuapp.com/putdown/deleteEventPin",
      { id },
      { "content-type": "application/json" }
    );
    const result = response.data;
    console.log(result);

    const findNumber = events.indexOf({ _id: id.toString() });
    events.splice(findNumber, 1);
    setActiveDelete(null);
    setButtonLoading(false);
    setDisable(false);
  };

  const clickHandler2 = (e, index) => {
    setModalDelete(index);
  };

  const hideModal2 = () => {
    setModalDelete(null);
  };

  const findAllEvent = async () => {
    const response = await axios.get(
      "https://diown-app-server.herokuapp.com/putdown/findAllEvent"
    );
    setEvents(response.data);
    setLoading(false);
  };

  const goAddEvent = () => {
    navigate("/addEvent");
  };

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (token !== null) {
      findAllEvent();
    } else {
      navigate("/");
    }
  }, [navigate]);
  return (
    <>
      {loading === false ? (
        <div className="p-5">
          <div className="d-flex flex-row justify-content-between">
            <div className="">
              <h1>Event</h1>
            </div>
            <div className=" justify-content-end">
              <Button onClick={goAddEvent}>Add Event</Button>
            </div>
          </div>

          <Row>
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
                <th>Marker_name</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Start date</th>
                <th>End date</th>
                <th>Topic</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {events
                .filter((e) => {
                  if (search === "") {
                    return e;
                  } else if (
                    (e.topic === undefined &&
                      e.marker_id
                        .toLowerCase()
                        .includes(search.toLowerCase())) ||
                    e.lag
                      .toString()
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    e.lng
                      .toString()
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  ) {
                    return e;
                  } else if (
                    (e.topic !== undefined &&
                      e.topic.toLowerCase().includes(search.toLowerCase())) ||
                    e.marker_id.toLowerCase().includes(search.toLowerCase()) ||
                    e.lag
                      .toString()
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    e.lng
                      .toString()
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  ) {
                    return e;
                  } else {
                    return null;
                  }
                })
                .map((e, i) => {
                  const url =
                    "https://storage.googleapis.com/noseason/" +
                    e.imageLocation;
                  return (
                    <tr key={e._id}>
                      <th className="text-center">#{i + 1}</th>
                      <td className="text-center">{e.marker_id}</td>
                      <td className="text-center">{e.lag}</td>
                      <td className="text-center">{e.lng}</td>
                      <td className="text-center">{e.start_date}</td>
                      <td className="text-center">{e.end_date}</td>
                      <td className="text-center">{e.topic}</td>
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
                        show={activeModal === i}
                        onHide={hideModal}
                        size="lg"
                        centered
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>Detail</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div className="p-5">
                            <Row className=" justify-content-md-center row">
                              <Col className="d-flex flex-column align-items-center justify-content-center">
                                <Image
                                  src={url}
                                  fluid
                                  width={500}
                                  rounded
                                  thumbnail
                                  screen_size={6}
                                />
                              </Col>
                            </Row>
                            <br></br>
                            <h3>
                              <b>Marker_name:</b> {e.marker_id}
                            </h3>
                            <p>
                              <b>Start_date:</b> {e.start_date}
                            </p>
                            <p>
                              <b>End_date:</b> {e.end_date}
                            </p>
                            <p>
                              <b>Topic:</b> {e.topic}
                            </p>
                            <p>{e.detail}</p>
                          </div>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button
                            variant="primary"
                            onClick={() => {
                              goEdit(e._id);
                            }}
                          >
                            Edit
                          </Button>
                          <Button variant="danger" onClick={hideModal}>
                            Close
                          </Button>
                        </Modal.Footer>
                      </Modal>
                      <Modal
                        id={e._id}
                        show={modalDelete === i}
                        onHide={hideModal2}
                        size="lg"
                        centered
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>
                            Do you want to delete this event?
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div className="p-5">
                            <Row className=" justify-content-md-center row">
                              <Col className="d-flex flex-column align-items-center justify-content-center">
                                <Image
                                  src={url}
                                  fluid
                                  width={500}
                                  rounded
                                  thumbnail
                                  screen_size={6}
                                />
                              </Col>
                            </Row>
                            <br></br>
                            <h3>
                              <b>Marker_name:</b> {e.marker_id}
                            </h3>
                            <br></br>
                            <p>
                              <b>Start_date:</b> {e.start_date}
                            </p>
                            <p>
                              <b>End_date:</b> {e.end_date}
                            </p>
                            <p>
                              <b>Topic:</b> {e.topic}
                            </p>
                            <p>{e.detail}</p>
                          </div>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="primary" onClick={hideModal2}>
                            Close
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => deleteEventPin(i, e._id)}
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
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default Event;
