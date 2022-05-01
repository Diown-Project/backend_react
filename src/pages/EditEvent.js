import React, { useState, useEffect } from "react";
import Loading from "./Loading";
import DateTimePicker from "react-datetime-picker";
import axios from "axios";
import { Form, Button, Row, Col, Modal } from "react-bootstrap";
import "./../css/Loading.css";
import { useNavigate, useLocation } from "react-router-dom";

function EditEvent() {
  const [images, setImages] = useState({ preview: "", data: "" });
  const [imageName, setImageName] = useState("");
  const [markerName, setMarkerName] = useState("");
  const [topic, setTopic] = useState("");
  const [eventDetail, setEventDetail] = useState("");
  const [value, onChange] = useState(new Date());
  const [value2, onChange2] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [activeModal, setActiveModal] = useState(false);
  const [imageFirst, setImageFirst] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state;

  const hideModal = () => {
    setActiveModal(false);
  };

  const showModal = (e) => {
    e.preventDefault();
    setActiveModal(true);
  };

  const onMarkerNameChange = (e) => {
    setMarkerName(e.target.value);
  };

  const onTopicChange = (e) => {
    setTopic(e.target.value);
  };

  const onEventDetailChange = (e) => {
    setEventDetail(e.target.value);
  };

  const onImageChange = (e) => {
    if (e.target.files.length === 0) {
      setImages({ preview: "", data: "" });
      setImageName("");
    } else {
      const img = {
        preview: URL.createObjectURL(e.target.files[0]),
        data: e.target.files[0],
      };
      setImages(img);
      setImageName(e.target.files[0].name);
    }
  };

  const findDetailEvent = async (id) => {
    const response = await axios.post(
      "https://diown-app-server.herokuapp.com/putdown/findEventDetail",
      { id },
      { "content-type": "application/json" }
    );
    const result = response.data;
    setImageFirst(result.imageLocation);
    setMarkerName(result.marker_id);
    const c1 = Date.parse(result.start_date) - 7 * (60 * 60 * 1000);
    const c2 = Date.parse(result.end_date) - 7 * (60 * 60 * 1000);
    onChange(new Date(c1));
    onChange2(new Date(c2));

    setTopic(result.topic);
    setEventDetail(result.detail);
    setLoading(false);
  };

  const updateEvent = async (e) => {
    setLoading(true);
    e.preventDefault();
    const c1 = value.getTime() + 7 * (60 * 60 * 1000);
    const c2 = value2.getTime() + 7 * (60 * 60 * 1000);
    console.log(images.preview === "" && images.data === "" && c1 < c2);
    if (images.preview === "" && images.data === "" && c1 < c2) {
      const response = await axios.post(
        "https://diown-app-server.herokuapp.com/putdown/upDateEvent",
        {
          id,
          imageName,
          markerName,
          topic,
          detail: eventDetail,
          start_date: c1,
          end_date: c2,
        },
        { "content-type": "application/json" }
      );
      if (response.data.message === "success") {
        alert("update was success.");
        navigate("/event");
      } else {
        alert("this update don't success.");
        setLoading(false);
      }
    } else if (c1 < c2) {
      const response3 = await axios.post(
        "https://diown-app-server.herokuapp.com/putdown/upDateEvent",
        {
          id,
          imageName,
          markerName,
          topic,
          detail: eventDetail,
          start_date: c1,
          end_date: c2,
        },
        { "content-type": "application/json" }
      );
      const result = response3.data;
      if (result.message === "success") {
        let formData = new FormData();
        formData.append("file", images.data);
        const response = await axios.post(
          "https://diown-app-server.herokuapp.com/putdown/testAddImage",
          formData,
          {
            headers: {
              "content-type": "multipart/form-data",
            },
          }
        );
        console.log(response.data);
        const response2 = await axios.post(
          "https://diown-app-server.herokuapp.com/putdown/deleteImageLocal",
          { imageName },
          { "content-type": "application/json" }
        );
        console.log(response2.data);
        alert("Add event success.");
        navigate("/event");
      } else {
        alert("this location have pin now.");
        setLoading(false);
      }
    } else {
    }
  };

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (token !== null) {
      findDetailEvent(id);
    } else {
      navigate("/");
    }
  }, [navigate, id]);
  return (
    <>
      {loading === false ? (
        <div className="p-5">
          {images.preview !== "" ? (
            <img
              src={images.preview}
              className="rounded mx-auto d-block"
              width="400"
              height="150"
              alt="diown-logo-index"
            />
          ) : imageFirst !== "" ? (
            <img
              src={`https://storage.googleapis.com/noseason/${imageFirst.toString()}`}
              className="rounded mx-auto d-block"
              width="400"
              height="150"
              alt="diown-logo-index"
            />
          ) : (
            <></>
          )}
          <Form onSubmit={showModal}>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Choose your image for this event.</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={onImageChange}
              />
            </Form.Group>
            <Row>
              <Col lg={3} className="mb-3">
                <h5>Start_date:</h5>
                <DateTimePicker onChange={onChange} value={value} />
              </Col>
              <Col className="mb-3">
                <h5>End_date:</h5>
                <DateTimePicker onChange={onChange2} value={value2} />
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Marker_name:</Form.Label>
              <Form.Control
                type="text"
                value={markerName}
                onChange={onMarkerNameChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Event_topic:</Form.Label>
              <Form.Control
                type="text"
                onChange={onTopicChange}
                required
                value={topic}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Event_Detail:</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                onChange={onEventDetailChange}
                value={eventDetail}
                required
              />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button type="submit"> save</Button>
            </div>
          </Form>
          <Modal show={activeModal} onHide={hideModal} size="lg" centered>
            <Modal.Header closeButton>
              <Modal.Title>Detail</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="p-5">
                {images.preview !== "" ? (
                  <img
                    src={images.preview}
                    className="rounded mx-auto d-block"
                    width="400"
                    height="150"
                    alt="diown-logo-index"
                  />
                ) : imageFirst !== "" ? (
                  <img
                    src={`https://storage.googleapis.com/noseason/${imageFirst.toString()}`}
                    className="rounded mx-auto d-block"
                    width="400"
                    height="150"
                    alt="diown-logo-index"
                  />
                ) : (
                  <></>
                )}
                <br></br>
                <p>
                  <b>Marker_name:</b> {markerName}
                </p>
                <p>
                  <b>Topic:</b> {topic}
                </p>
                <p>
                  <b>Start_date:</b>{" "}
                  {Date(parseInt(value.getTime() + 7 * (60 * 60 * 1000)))}
                </p>
                <p>
                  <b>End_date:</b>{" "}
                  {Date(parseInt(value2.getTime() + 7 * (60 * 60 * 1000)))}
                </p>
                <p>
                  <b>Event_detail:</b> {eventDetail}
                </p>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={hideModal}>
                Close
              </Button>
              <Button variant="primary" onClick={updateEvent}>
                Save
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default EditEvent;
