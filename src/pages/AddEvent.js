import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, Modal } from "react-bootstrap";
import axios from "axios";
import DateTimePicker from "react-datetime-picker";
import Loading from "./Loading";
import "./../css/Loading.css";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

function AddEvent() {
  const [images, setImages] = useState({ preview: "", data: "" });
  const [imageName, setImageName] = useState("");
  const [markerName, setMarkerName] = useState("");
  const [topic, setTopic] = useState("");
  const [eventDetail, setEventDetail] = useState("");
  const [value, onChange] = useState(new Date());
  const [value2, onChange2] = useState(new Date());
  const navigate = useNavigate();
  const [map, setMap] = useState(null);
  const [address, setAddress] = useState("");
  const [coordinates, setCodinates] = useState({ lat: null, lng: null });
  const [activeModal, setActiveModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [libraries] = useState(["places"]);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDmj-qVlSTLcr1v7JYH9YaUzDt-4GIDEW0",
    libraries,
  });
  const [center, setCenter] = useState({ lat: 48.8584, lng: 2.2945 });
  const containerStyle = {
    width: "1200px",
    height: "400px",
  };

  const hideModal = () => {
    setActiveModal(false);
  };

  const showModal = (e) => {
    e.preventDefault();
    setActiveModal(true);
  };

  const handleSelect = async (value) => {
    try {
      const results = await geocodeByAddress(value);
      const LatLng = await getLatLng(results[0]);
      setAddress(value);
      setCodinates(LatLng);
      setCenter(LatLng);
    } catch (e) {
      console.log(e);
    }
  };
  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== null) {
    } else {
      navigate("/");
    }
  }, [navigate]);

  const onMarkerNameChange = (e) => {
    setMarkerName(e.target.value);
  };

  const onTopicChange = (e) => {
    setTopic(e.target.value);
  };

  const onEventDetailChange = (e) => {
    setEventDetail(e.target.value);
  };

  const UploadImageToCloud = async (e) => {
    hideModal();
    e.preventDefault();
    const c1 = value.getTime() + 7 * (60 * 60 * 1000);
    const c2 = value2.getTime() + 7 * (60 * 60 * 1000);
    if (
      (images.preview === "" && images.data === "") ||
      c1 > c2 ||
      c1 === c2 ||
      images.preview === "" ||
      images.data === "" ||
      imageName === "" ||
      markerName === "" ||
      topic === "" ||
      eventDetail === "" ||
      coordinates.lat === null ||
      coordinates.lng === null
    ) {
      alert("error");
    } else {
      setLoading(true);
      e.preventDefault();
      const response3 = await axios.post(
        "https://diown-app-server.herokuapp.com/putdown/addEventMarker",
        {
          marker_id: markerName,
          imageLocation: imageName,
          lag: coordinates.lat,
          lng: coordinates.lng,
          start_date: c1,
          end_date: c2,
          detail: eventDetail,
          topic: topic,
        },
        { "content-type": "application/json" }
      );
      const result = response3.data;
      console.log(result.message);
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
      } else {
        alert("this location have pin now.");
      }
      // setImages({ preview: "", data: "" });
      // setImageName("");
      // setMarkerName("");
      // setTopic("");
      // setEventDetail("");
      // setAddress("");
      // setCodinates({ lat: null, lng: null });
      window.location.reload();
    }
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
  return (
    <>
      {loading === false ? (
        <div className="p-5">
          {images.preview && (
            <img
              src={images.preview}
              className="rounded mx-auto d-block"
              width="400"
              height="150"
              alt="diown-logo-index"
            />
          )}

          <Form onSubmit={showModal}>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Choose your image for this event.</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={onImageChange}
                required
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
                onChange={onMarkerNameChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Event_topic:</Form.Label>
              <Form.Control type="text" onChange={onTopicChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Event_Detail:</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                onChange={onEventDetailChange}
                required
              />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button type="submit" className="mb-3">
                {" "}
                save
              </Button>
            </div>
          </Form>
          <Modal show={activeModal} onHide={hideModal} size="lg" centered>
            <Modal.Header closeButton>
              <Modal.Title>Detail</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="p-5">
                <img
                  src={images.preview}
                  className="rounded mx-auto d-block"
                  width="400"
                  height="150"
                  alt="diown-logo-index"
                />
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
                <p>
                  <b>Latitude:</b> {coordinates.lat}
                </p>
                <p>
                  <b>Longitude:</b> {coordinates.lng}
                </p>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={hideModal}>
                Close
              </Button>
              <Button variant="primary" onClick={UploadImageToCloud}>
                Save
              </Button>
            </Modal.Footer>
          </Modal>
          {isLoaded ? (
            <PlacesAutocomplete
              value={address}
              onChange={setAddress}
              onSelect={handleSelect}
            >
              {({
                getInputProps,
                suggestions,
                getSuggestionItemProps,
                loading,
              }) => (
                <div>
                  <div>
                    <Row>
                      <Col>
                        <p>
                          <b>Lat:</b>&nbsp;
                          {coordinates.lat}
                        </p>
                      </Col>
                      <Col>
                        <p>
                          <b>Lng:</b>&nbsp;
                          {coordinates.lng}
                        </p>
                      </Col>
                    </Row>

                    <input
                      className="mb-3"
                      {...getInputProps({ placeholder: "Search Location" })}
                      size="50"
                    />
                    <div className="mb-3">
                      {loading ? <div>...loading</div> : null}
                      {suggestions.map((suggestion, index) => {
                        const style = {
                          backgroundColor: suggestion.active
                            ? "#41b6e6"
                            : "#fff",
                        };
                        return (
                          <div
                            key={index}
                            {...getSuggestionItemProps(suggestion, { style })}
                          >
                            {suggestion.description}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </PlacesAutocomplete>
          ) : (
            <></>
          )}
          {isLoaded ? (
            <div className="d-flex justify-content-center">
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={15}
                onUnmount={onUnmount}
                onLoad={(map) => setMap(map)}
                options={{
                  zoomControl: false,
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                }}
              >
                <Marker
                  position={center}
                  draggable
                  onDragEnd={(e) => {
                    setCenter({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                    setCodinates({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                  }}
                />
              </GoogleMap>
            </div>
          ) : (
            <></>
          )}
          {/* <input type="file" accept="image/*" onChange={onImageChange} /> */}
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default AddEvent;
