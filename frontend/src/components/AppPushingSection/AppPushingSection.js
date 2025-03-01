import React from 'react';
import { BsBoundingBoxCircles, BsTaxiFrontFill } from 'react-icons/bs';
import { GrSwim } from 'react-icons/gr';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';

import womanWithPhone from "../../assets/images/women.png"; // Replace with your image path
import syncTripApp from '../../assets/images/syncTripMobile.png'; // Replace with your image path
import "../../styles/appPushing.css";
const SyncTripAppPushingSection = () => {
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
            title: 'Explore Destinations',
            description: 'SyncTrip helps you discover destinations with a variety of filters like budget, activities, and travel preferences, making it easy to find your perfect spot.',
        },
        {
            Icon: GrSwim,
            title: 'Plan Collaboratively',
            description: 'Create trips, invite friends, and work together to save places, events, and activities in a shared itinerary, just like building a Pinterest board.',
        },
        {
            Icon: BsTaxiFrontFill,
            title: 'Finalize Effortlessly',
            description: 'Pick dates, finalize plans with your group, and get a well-organized travel itinerary ready to make your trip unforgettable.',
        },
    ];
    return (
        <div className="container-appPushing mx-auto px-4 py-8 bg-white">

            <h1 className="fw-bold text-custom-secondary majorHeadings" >How SyncTrip works?</h1>

            <Container fluid className=" pre-made-itinerary mb-5" style={{ textAlign: "left", padding: "0px 0px 40px 20px" }}>
                <Row className="justify-content-center align-items-center mb-5">
                    {/* Left Column: Text Content */}
                    <Col md={6} lg={4} className="text-left text-md-start mb-4 mb-md-0">

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


                        </ListGroup>
                    </Col>
                    {/* <Col md={6} lg={1}></Col> */}
                    <Col md={6} lg={8} className="d-flex flex-column flex-md-row gap-3 justify-content-center">
                        <img
                            src={womanWithPhone}
                            alt="Woman using SyncTrip app"
                            className="w-full max-w-md rounded-lg shadow-md mb-6"
                        />
                    </Col>


                </Row>
                <Row className="justify-content-center align-items-center">
                    <Col md={6} lg={3} className="">
                        <img
                            src={syncTripApp}
                            alt="SyncTrip app screenshot "
                            className="w-full max-w-sm  mb-6 img-appPushing"
                        />
                    </Col>
                    <Col md={6} lg={6} className="">

                        <div className="">
                            <h2 className="text-2xl font-bold text-blue-800 mb-4 majorHeadings">
                                Sync, plan, and explore – the way YOU want.
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Your perfect trip planner is coming soon! Stay ahead by joining the travel revolution.
                            </p>
                            <button className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition">
                                Click here & register for early access.
                            </button>
                        </div>
                    </Col>
                </Row>
            </Container>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Left Column - Features
                <div className="w-full md:w-1/2 space-y-6">
                    <div className="flex items-start gap-4">
                        <span className="text-2xl bg-blue-100 p-2 rounded-full">📍</span>
                        <div>
                            <h2 className="text-xl font-semibold">Explore Destinations</h2>
                            <p className="text-gray-600">
                                SyncTrip helps you discover destinations with a variety of filters like budget, activities, and travel preferences, making it easy to find your perfect spot.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <span className="text-2xl bg-blue-100 p-2 rounded-full">🗺️</span>
                        <div>
                            <h2 className="text-xl font-semibold">Plan Collaboratively</h2>
                            <p className="text-gray-600">
                                Create trips, invite friends, and work together to save places, events, and activities in a shared itinerary, just like building a Pinterest board.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <span className="text-2xl bg-blue-100 p-2 rounded-full">📅</span>
                        <div>
                            <h2 className="text-xl font-semibold">Finalize Effortlessly</h2>
                            <p className="text-gray-600">
                                Pick dates, finalize plans with your group, and get a well-organized travel itinerary ready to make your trip unforgettable.
                            </p>
                        </div>
                    </div>
                </div> */}

                {/* Right Column - Image and Call-to-Action */}
                <div className="">


                </div>
            </div>
        </div>
    );
};

export default SyncTripAppPushingSection;