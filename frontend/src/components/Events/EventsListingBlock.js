import React from 'react';
import EventCard from './EventsCard';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS for styling
import '../../styles/events/events.css'; // Import custom CSS for event listing block

const EventList = ({ events }) => {
    return (
        <div className="container mt-4">
            <div className="row">
                {events.map((event) => (
                    <div key={event._id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                        <EventCard event={event} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventList;