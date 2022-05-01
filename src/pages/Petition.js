import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Row, Col, FormControl, Modal } from "react-bootstrap";
import axios from "axios";
import Loading from "./Loading";
import "./../css/Loading.css";
function Petition() {
  const navigate = useNavigate();
  const [support, setSupport] = useState([]);
  const [search, setSearch] = useState("");
  const [activeModal, setActiveModal] = useState(null);
  const [loading, setLoading] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [activeDelete, setActiveDelete] = useState(null);
  const [disable, setDisable] = useState(false);
  const [modalDelete, setModalDelete] = useState(null);
  const findAllSupport = async () => {
    const response = await axios.get(
      "https://diown-app-server.herokuapp.com/support/findSup"
    );
    setSupport(response.data);
    setLoading(false);
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

  const deleteSupport = async (index, id) => {
    hideModal2();
    setActiveDelete(index);
    setButtonLoading(true);
    setDisable(true);
    const response = await axios.post(
      "https://diown-app-server.herokuapp.com/support/deleteSup",
      { id },
      { "content-type": "application/json" }
    );
    const result = response.data;
    console.log(result);
    const findNumber = support.indexOf({ _id: id.toString() });
    support.splice(findNumber, 1);
    setActiveDelete(null);
    setButtonLoading(false);
    setDisable(false);
  };

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (token !== null) {
      findAllSupport();
    } else {
      navigate("/");
    }
  }, [navigate]);
  return (
    <>
      {loading === false ? (
        <div className="p-5">
          <Row>
            <Col>
              <h1>Petition</h1>
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
                <th>Topic</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {support
                .filter((e) => {
                  if (search === "") {
                    return e;
                  } else if (
                    e.topic.toLowerCase().includes(search.toLowerCase())
                  ) {
                    return e;
                  } else {
                    return null;
                  }
                })
                .map((e, i) => (
                  <tr key={e._id}>
                    <th className="text-center">#{i + 1}</th>
                    <td className="text-center">{e.topic}</td>
                    <td className="text-center">{e.date}</td>

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
                        id={e._id}
                        onClick={(e) => clickHandler2(e, i)}
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
                        <center>
                          <h1>{e.topic}</h1>
                        </center>
                        <p>{e.detail}</p>
                      </Modal.Body>
                      <Modal.Footer>
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
                        <Modal.Title>Do you want to delete this?</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <center>
                          <h1>{e.topic}</h1>
                        </center>
                        <p>{e.detail}</p>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="primary" onClick={hideModal2}>
                          Close
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => deleteSupport(i, e._id)}
                        >
                          Delete
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default Petition;
