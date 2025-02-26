import React from 'react';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import '../../styles/PreMadeItinerary.css'; // Optional: Custom CSS for additional styling
import { BsBoundingBoxCircles, BsTaxiFrontFill } from "react-icons/bs";
import { GrSwim } from "react-icons/gr";
import ItineraryCarousel from './ItineraryCarousel';
const PreMadeItinerary = () => {
    return (
        <Container fluid className="py-5 pre-made-itinerary">
            <Row className="justify-content-center align-items-center">
                {/* Left Column: Text Content */}
                <Col md={6} lg={4} className="text-center text-md-start mb-4 mb-md-0">
                    <h6 className="text-muted">Easy and Fast</h6>
                    <h1 className="fw-bold text-custom-secondary">Save The Hassle With Pre-Made Itinerary</h1>
                    <ListGroup variant="flush" className="mt-4">
                        <ListGroup.Item className="border-0 p-2">
                            <BsBoundingBoxCircles style={{ width: "25px", height: "25px", padding: "4px", backgroundColor: "black", color: "white", borderRadius: "5px", marginRight: "10px" }} />
                            Choose Destination Lorem ipsum dolor sit amet, consectetur adipiscing elit. Uma, tortor tempus.
                        </ListGroup.Item>
                        <ListGroup.Item className="border-0 p-2">
                            <GrSwim style={{ width: "25px", height: "25px", padding: "4px", backgroundColor: "black", color: "white", borderRadius: "5px", marginRight: "10px" }} />
                            Explore Itinerary Lorem ipsum dolor sit amet, consectetur adipiscing elit. Uma, tortor tempus.
                        </ListGroup.Item>
                        <ListGroup.Item className="border-0 p-2">
                            <BsTaxiFrontFill style={{ width: "25px", height: "25px", padding: "4px", backgroundColor: "black", color: "white", borderRadius: "5px", marginRight: "10px" }} />
                            Customize it to your liking Lorem ipsum dolor sit amet, consectetur adipiscing elit. Uma, tortor tempus.
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={6} lg={8} className="d-flex flex-column flex-md-row gap-3 justify-content-center">
                    <ItineraryCarousel />
                </Col>


            </Row>
        </Container>
    );
};

export default PreMadeItinerary;