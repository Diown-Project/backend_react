import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Col, Row, FormControl, Modal } from "react-bootstrap";
import axios from "axios";
import Loading from "./Loading";
import "./../css/Loading.css";

function UserMarker() {
  const [allMarker, setAllMarker] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [activeDelete, setActiveDelete] = useState(null);
  const [disable, setDisable] = useState(false);
  const [modalDelete, setModalDelete] = useState(null);

  const navigate = useNavigate();
  const findAllMarker = async () => {
    const response = await axios.get(
      "https://diown-app-server.herokuapp.com/putdown/findAllMarker"
    );
    setAllMarker(response.data);
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

  const deleteUserMarker = async (index, id) => {
    hideModal2();
    setActiveDelete(index);
    setButtonLoading(true);
    setDisable(true);
    const response = await axios.post(
      "https://diown-app-server.herokuapp.com/putdown/deletePin",
      { id },
      { "content-type": "application/json" }
    );
    const result = response.data;
    console.log(result);
    const findNumber = allMarker.indexOf({ _id: id.toString() });
    allMarker.splice(findNumber, 1);
    setActiveDelete(null);
    setButtonLoading(false);
    setDisable(false);
  };

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (token !== null) {
      findAllMarker();
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
              <h1>user_marker</h1>
            </Col>
            <Col
              lg={{ span: 3, offset: 9 }}
              md={{ span: 3, offset: 9 }}
              sm={{ span: 3, offset: 9 }}
              className="mb-3"
            >
              <FormControl
                type="search"
                placeholder="Search"
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
                <th>marker_name</th>
                <th>latitude</th>
                <th>longitude</th>
                <th>create_by</th>
                <th>action</th>
              </tr>
            </thead>
            <tbody>
              {allMarker
                .filter((e) => {
                  if (search === "") {
                    return e;
                  } else if (
                    e.marker_id.toLowerCase().includes(search.toLowerCase()) ||
                    e.user_detail[0].username
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
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
                .map((e, i) => (
                  <tr key={e._id}>
                    <th className="text-center">#{i + 1}</th>
                    <td className="text-center">{e.marker_id}</td>
                    <td className="text-center">{e.lag}</td>
                    <td className="text-center">{e.lng}</td>
                    <td className="text-center">{e.user_detail[0].username}</td>
                    <td className="text-center">
                      <Button
                        variant="outline-info me-2 mb-1"
                        id={e._id}
                        onClick={(e) => clickHandler(e, i)}
                      >
                        detail
                      </Button>
                      <Button
                        variant="outline-danger mb-1"
                        onClick={(e) => clickHandler2(e, i)}
                        disabled={disable ? true : false}
                      >
                        {(buttonLoading !== false) & (activeDelete === i) ? (
                          <i className="fas fa-spinner fa-spin" />
                        ) : (
                          <></>
                        )}
                        <span>delete</span>
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
                          <h1>{e.marker_id}</h1>
                        </center>
                        <p>{e.user_detail[0].username}</p>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="danger" onClick={hideModal}>
                          close
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
                        <Modal.Title>Detail</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <center>
                          <h1>{e.marker_id}</h1>
                        </center>
                        <p>{e.user_detail[0].username}</p>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="primary" onClick={hideModal2}>
                          close
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => {
                            deleteUserMarker(i, e._id);
                          }}
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

export default UserMarker;
