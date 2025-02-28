import React from 'react';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import '../../styles/PreMadeItinerary.css'; // Optional: Custom CSS for additional styling
import { BsBoundingBoxCircles, BsTaxiFrontFill } from "react-icons/bs";
import { GrSwim } from "react-icons/gr";
import ItineraryCarousel from './ItineraryCarousel';
const PreMadeItinerary = () => {
    const iconStyle = {
        width: "100px",
        height: "40px",
        padding: "8px",
        backgroundColor: 'black',
        color: 'white',
        borderRadius: '5px',
        marginRight: '10px',
    };
    const features = [
        {
            Icon: BsBoundingBoxCircles,
            title: 'Choose Destination',
            description: 'Pick from curated destinations, from vibrant cities to tranquil beaches. SyncTrip connects you with like-minded travelers for the perfect start.',
        },
        {
            Icon: GrSwim,
            title: 'Explore Itinerary',
            description: 'Browse expert-crafted itineraries with iconic sights and hidden gems. SyncTrip simplifies planning to match your style and budget.',
        },
        {
            Icon: BsTaxiFrontFill,
            title: 'Customise It to your liking',
            description: 'Tailor your itinerary to your interests and budget. Collaborate with companions for a trip that’s uniquely yours.',
        },
    ];
    return (
        <section>
            <Container fluid className=" py-5 pre-made-itinerary mb-5 mt-5" style={{ textAlign: "left" }}>
                <Row className="justify-content-center align-items-center">
                    {/* Left Column: Text Content */}
                    <Col md={6} lg={4} className="text-left text-md-start mb-4 mb-md-0">
                        <h6 className="text-muted" style={{ fontWeight: "700" }}>Easy and Fast</h6>
                        <h1 className="fw-bold text-custom-secondary majorHeadings" >Save The Hassle With Pre-Made Itinerary</h1>

                        <ListGroup variant="flush" className="mt-4">
                            {features.map(({ Icon, title, description }, index) => (
                                <ListGroup.Item
                                    key={index}
                                    className="d-flex  border-0 p-2"
                                >
                                    <Icon style={iconStyle} />
                                    <p className="mb-0">
                                        <strong>{title}</strong><br></br> {description}
                                    </p>
                                </ListGroup.Item>
                            ))}

                            {/* <ListGroup.Item className="border-0 p-2">
                            <BsBoundingBoxCircles style={{ width: "25px", height: "25px", padding: "4px", backgroundColor: "black", color: "white", borderRadius: "5px", marginRight: "10px" }} />
                            <p className="mb-0">
                                <strong>{title}</strong> {description}
                            </p>
                        </ListGroup.Item>
                        <ListGroup.Item className="border-0 p-2">
                            <GrSwim style={{ width: "25px", height: "25px", padding: "4px", backgroundColor: "black", color: "white", borderRadius: "5px", marginRight: "10px" }} />
                            Browse our collection of pre-made itineraries, crafted by travel experts and enthusiasts. Each itinerary is designed to maximize your experience, offering a blend of must-see attractions and hidden gems.
                        </ListGroup.Item>
                        <ListGroup.Item className="border-0 p-2">
                            <BsTaxiFrontFill style={{ width: "25px", height: "25px", padding: "4px", backgroundColor: "black", color: "white", borderRadius: "5px", marginRight: "10px" }} />
                            Make it yours! Adjust the itinerary to fit your interests, budget, and travel pace. Add or remove activities, tweak the schedule, and even invite travel companions to join in on the planning.
                        </ListGroup.Item> */}
                        </ListGroup>
                    </Col>
                    {/* <Col md={6} lg={1}></Col> */}
                    <Col md={6} lg={8} className="d-flex flex-column flex-md-row gap-3 justify-content-center">
                        <ItineraryCarousel />
                    </Col>


                </Row>
            </Container>
        </section>
    );
};

export default PreMadeItinerary;