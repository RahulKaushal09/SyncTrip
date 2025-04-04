import React, { useState, useEffect } from 'react';
// import '../../styles/festivalsEvents.css'; // Optional: Custom CSS for additional styling
// import { BsHeart, BsStarFill } from 'react-icons/bs'; // Add this line
import LocationCard from '../LocationCard/LocationCard';
import locations from "../../data/locations.json"
import { Input } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

const indianCities = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur",
    "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Patna", "Vadodara", "Ghaziabad",
    "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivli", "Vasai-Virar", "Varanasi",
    "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad", "Ranchi", "Haora", "Coimbatore",
    "Jabalpur", "Gwalior", "Vijayawada", "Madurai", "Guwahati", "Chandigarh", "Hubballi-Dharwad", "Amroha",
    "Kota", "Bareilly", "Moradabad", "Aligarh", "Jalandhar", "Bhubaneswar", "Salem", "Warangal", "Guntur", "Bhiwandi",
    "Saharanpur", "Gorakhpur", "Bikaner", "Jamshedpur", "Bhilai", "Cuttack", "Firozabad", "Kochi", "Bhavnagar",
    "Dehradun", "Durgapur", "Asansol", "Nanded", "Kolhapur", "Ajmer", "Gulbarga", "Jamnagar", "Ujjain", "Loni",
    "Siliguri", "Jhansi", "Ulhasnagar", "Jammu", "Sangli-Miraj & Kupwad", "Mangalore", "Erode", "Belgaum", "Kurnool",
    "Ambattur", "Rajahmundry", "Tirunelveli", "Malegaon", "Tiruppur", "Davanagere", "Kozhikode", "Akola", "Kurnool",
    "Bokaro Steel City", "South Dumdum", "Bellary", "Patiala", "Gopalpur", "Agartala", "Bhagalpur", "Muzaffarnagar",
    "Bhatpara", "Panihati", "Latur", "Dhule", "Rohtak", "Korba", "Bhilwara", "Berhampur", "Muzaffarpur", "Ahmednagar",
    "Mathura", "Kollam", "Avadi", "Kadapa", "Kamarhati", "Bilaspur", "Shahjahanpur", "Bijapur", "Rampur", "Shivamogga",
    "Chandrapur", "Junagadh", "Thrissur", "Alwar", "Bardhaman", "Kulti", "Nizamabad", "Parbhani", "Tumkur",
    "Khammam", "Uzhavarkarai", "Bihar Sharif", "Panipat", "Darbhanga", "Bally", "Aizawl", "Dewas", "Ichalkaranji",
    "Karnal", "Bathinda", "Jalna", "Eluru", "Barasat", "Kirari Suleman Nagar", "Purnia", "Satna", "Mau", "Sonipat",
    "Farrukhabad", "Sagar", "Durg", "Imphal", "Ratlam", "Hapur", "Arrah", "Anantapur", "Karimnagar", "Etawah",
    "Ambernath", "North Dumdum", "Bharatpur", "Begusarai", "New Delhi", "Gandhidham", "Baranagar", "Tiruvottiyur",
    "Puducherry", "Sikar", "Thoothukudi", "Rewa", "Mirzapur", "Raichur", "Pali", "Ramagundam", "Haridwar", "Vellore",
    "Gopalganj", "Fatehpur", "Nagapattinam", "Tirupati", "Yamunanagar", "Bidar", "Rampurhat", "Nadiad", "Kumbakonam",
    "Udupi", "Sitapur", "Haldwani", "Mango", "Raiganj", "Thanjavur", "Amroha", "Serampore", "Chhapra", "Ozhukarai"
];

const eventCategories = {
    "Concerts & Music": [
        "Concert", "Music Festival", "Live DJ Set", "Classical Music Performance", "Open Mic Night", "Battle of the Bands"
    ],
    "Sports & Fitness": [
        "Football Match", "Basketball Game", "Marathon", "Yoga Class", "Gym Training Session", "Swimming Competition"
    ],
    "Conferences & Business": [
        "Tech Conference", "Business Summit", "Networking Event", "Startup Pitch Competition", "Workshop", "Career Fair"
    ],
    "Education & Learning": [
        "Seminar", "Webinar", "Coding Bootcamp", "Science Fair", "Art Workshop", "Book Reading"
    ],
    "Entertainment & Arts": [
        "Movie Premiere", "Theatre Play", "Stand-up Comedy", "Magic Show", "Art Exhibition", "Dance Performance"
    ],
    "Festivals & Cultural": [
        "Food Festival", "Film Festival", "Traditional Festival", "Carnival", "Religious Gathering", "Independence Day Celebration"
    ],
    "Technology & Innovation": [
        "Hackathon", "AI Summit", "Robotics Expo", "Cybersecurity Conference", "Software Developer Meetup", "Gaming Convention"
    ],
    "Health & Wellness": [
        "Mental Health Seminar", "Nutrition Workshop", "Meditation Retreat", "Blood Donation Camp", "First Aid Training"
    ],
    "Outdoor & Adventure": [
        "Hiking Trip", "Camping Event", "Skydiving Session", "Scuba Diving Training", "Wildlife Safari", "Cycling Race"
    ],
    "Social & Community": [
        "Charity Event", "Fundraiser", "Volunteer Drive", "Town Hall Meeting", "Public Debate", "Protest"
    ],
    "Nightlife & Parties": [
        "Club Party", "Cocktail Night", "Themed Costume Party", "VIP Gala", "Rave Party"
    ],
    "Gaming & eSports": [
        "eSports Tournament", "LAN Party", "Board Game Night", "VR Gaming Experience", "Poker Night"
    ],
    "Family & Kids": [
        "Puppet Show", "Kids Science Camp", "Storytelling Event", "Baby Shower", "Parent-Teacher Meeting"
    ],
    "Science & Space": [
        "Astronomy Night", "Science Exhibition", "Space Exploration Talk", "Drone Show", "NASA Event"
    ],
    "Spiritual & Religious": [
        "Church Service", "Meditation Camp", "Pilgrimage", "Religious Festival", "Healing Session"
    ]
};

function LocationBlock() {
    const [location, setLocation] = useState("Fetching location...");
    const [customLocation, setCustomLocation] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
                    )
                        .then((res) => res.json())
                        .then((data) => setLocation(truncateLocation(data.address.city || "Unknown City")))
                        .catch(() => setLocation("Location unavailable"));
                },
                () => setLocation("Location permission denied")
            );
        } else {
            setLocation("Geolocation not supported");
        }
    }, []);

    const fetchLocations = (query) => {
        if (query.length > 2) {
            const filteredCities = indianCities.filter(city => city.toLowerCase().includes(query.toLowerCase()));
            setSuggestions(filteredCities);
        } else {
            setSuggestions([]);
        }
    };

    const fetchEvents = async (city) => {
        const encodedCity = encodeURIComponent(city);
        const res = await fetch(
            `https://real-time-events-search.p.rapidapi.com/search-events?query=comedy%20shows%20in%20${encodedCity}&date=any&is_virtual=false&start=0`,
            {
                headers: {
                    "x-rapidapi-host": "real-time-events-search.p.rapidapi.com",
                    "x-rapidapi-key": "517a959543msh245af0c5f38f00bp15f7a7jsn2b4c1e80b8e4",
                },
            }
        );
        const data = await res.json();
        setEvents(data.events || []);
    };

    const truncateLocation = (loc) => {
        const words = loc.split(" ");
        return words.length > 3 ? words.slice(0, 3).join(" ") + "..." : loc;
    };

    return (
        <div className="d-flex flex-column align-items-end gap-2">
            <div className="d-flex align-items-center gap-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary" />
                <span className="text-muted">{location}</span>
            </div>
            <div className="position-relative">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter location"
                    value={customLocation}
                    onChange={(e) => {
                        setCustomLocation(e.target.value);
                        fetchLocations(e.target.value);
                    }}
                />
                {suggestions.length > 0 && (
                    <ul className="list-group position-absolute w-100 mt-1" style={{ zIndex: 10 }}>
                        {suggestions.map((city, index) => (
                            <li
                                key={index}
                                className="list-group-item list-group-item-action"
                                onClick={() => {
                                    setLocation(city);
                                    fetchEvents(city);
                                    setCustomLocation("");
                                    setSuggestions([]);
                                }}
                            >
                                {city}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
// function LocationBlock({ onLocationChange }) {
//     const [location, setLocation] = useState("Fetching location...");
//     const [customLocation, setCustomLocation] = useState("");
//     const [suggestions, setSuggestions] = useState([]);

//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     fetch(
//                         `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
//                     )
//                         .then((res) => res.json())
//                         .then((data) => {
//                             const city = truncateLocation(data.address.city || "Unknown City");
//                             setLocation(city);
//                             onLocationChange(city); // Pass location to parent
//                         })
//                         .catch(() => setLocation("Location unavailable"));
//                 },
//                 () => setLocation("Location permission denied")
//             );
//         } else {
//             setLocation("Geolocation not supported");
//         }
//     }, [onLocationChange]);

//     const fetchLocations = (query) => {
//         if (query.length > 2) {
//             const filteredCities = indianCities.filter(city => city.toLowerCase().includes(query.toLowerCase()));
//             setSuggestions(filteredCities);
//         } else {
//             setSuggestions([]);
//         }
//     };

//     const truncateLocation = (loc) => {
//         const words = loc.split(" ");
//         return words.length > 3 ? words.slice(0, 3).join(" ") + "..." : loc;
//     };

//     return (
//         <div className="d-flex flex-column align-items-end gap-2">
//             <div className="d-flex align-items-center gap-2">
//                 <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary" />
//                 <span className="text-muted">{location}</span>
//             </div>
//             <div className="position-relative">
//                 <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Enter location"
//                     value={customLocation}
//                     onChange={(e) => {
//                         setCustomLocation(e.target.value);
//                         fetchLocations(e.target.value);
//                     }}
//                 />
//                 {suggestions.length > 0 && (
//                     <ul className="list-group position-absolute w-100 mt-1" style={{ zIndex: 10 }}>
//                         {suggestions.map((city, index) => (
//                             <li
//                                 key={index}
//                                 className="list-group-item list-group-item-action"
//                                 onClick={() => {
//                                     setLocation(city);
//                                     onLocationChange(city); // Pass selected city to parent
//                                     setCustomLocation("");
//                                     setSuggestions([]);
//                                 }}
//                             >
//                                 {city}
//                             </li>
//                         ))}
//                     </ul>
//                 )}
//             </div>
//         </div>
//     );
// }


// Festivals & Events Component
// const FestivalsEvents = () => {
//     // Data for a single card (repeated four times as per description)
//     const [visibleCount, setVisibleCount] = useState(12); // St
//     const destination = {
//         image: 'https://via.placeholder.com/300x200', // Placeholder image; replace with actual image URL
//         title: 'Manali',
//         places: '46 places to visit',
//         rating: '5.0',
//         bestTime: 'sept to nov',
//     };
//     const handleShowMore = () => {
//         setVisibleCount(locations.length); // Show all locations
//     };

//     return (
//         <section className="">
//             {/* Section title */}
//             <div className='row'>
//                 <div className='col-lg-8 col-sm-12 col-md-8'>
//                     <h2 className="fw-bold majorHeadings" style={{ textAlign: "left" }}>Festivals & Events</h2>
//                 </div>
//                 <div className='col-lg-4 col-sm-12 col-md-4'>
//                     <LocationBlock />
//                 </div>
//             </div>
//             {/* Row of cards */}
//             <div
//                 style={{
//                     display: "flex",
//                     justifyContent: "space-around",
//                     // margin: "0px 40px",
//                     flexWrap: "wrap"
//                 }}
//             >
//                 {locations.slice(0, visibleCount).map((location, index) => (
//                     <LocationCard
//                         key={index}
//                         name={location.title?.replace(/[0-9. ]/g, '') || 'Unknown'} // Safely handle null/undefined title
//                         rating={location.rating || 'N/A'} // Safely handle null/undefined rating
//                         places={location.placesNumberToVisit || "0"} // Safely extract places
//                         bestTime={location.best_time || 'N/A'} // Safely handle null/undefined best_time
//                         images={location.images || ['https://via.placeholder.com/300x200?text=No+Image']} // Pass the images array or fallback
//                     />
//                 ))}

//             </div>
//             {
//                 visibleCount < locations.length && (
//                     <div style={{ textAlign: 'center', margin: '20px 0' }}>
//                         <button className="btn btn-black" onClick={handleShowMore}>
//                             Show More
//                         </button>
//                     </div>
//                 )
//             }
//         </section>
//     );
// };
const FestivalsEvents = () => {
    const [visibleCount, setVisibleCount] = useState(12);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [events, setEvents] = useState([]);

    const handleShowMore = () => {
        setVisibleCount(locations.length); // Show all locations
    };

    const fetchEvents = async (city, category) => {
        if (!city || !category) return;

        const eventTypes = eventCategories[category];
        let allEvents = [];

        for (const eventType of eventTypes) {
            const encodedQuery = encodeURIComponent(`${eventType} in ${city}`);
            // add 500ms delay 
            await new Promise(resolve => setTimeout(resolve, 500));
            try {
                const res = await fetch(
                    `https://real-time-events-search.p.rapidapi.com/search-events?query=${encodedQuery}&date=any&is_virtual=false&start=0`,
                    {
                        method: "POST",
                        headers: {
                            "x-rapidapi-host": "real-time-events-search.p.rapidapi.com",
                            "x-rapidapi-key": "517a959543msh245af0c5f38f00bp15f7a7jsn2b4c1e80b8e4",
                        },
                    }
                );
                const data = await res.json();
                if (data.events) {
                    allEvents = [...allEvents, ...data.events];
                }
            } catch (error) {
                console.error(`Error fetching events for ${eventType}:`, error);
            }
        }
        setEvents(allEvents);
    };

    const handleFilterChange = (category) => {
        setSelectedFilter(category);
        if (currentLocation) {
            fetchEvents(currentLocation, category);
        }
    };

    const handleLocationChange = (city) => {
        setCurrentLocation(city);
        if (selectedFilter) {
            fetchEvents(city, selectedFilter);
        }
    };

    return (
        <section className="">
            <div className='row'>
                <div className='col-lg-8 col-sm-12 col-md-8'>
                    <h2 className="fw-bold majorHeadings" style={{ textAlign: "left" }}>Festivals & Events</h2>
                    {/* Filters */}
                    <div className="mt-3">
                        {Object.keys(eventCategories).map((category) => (
                            <button
                                key={category}
                                className={`btn ${selectedFilter === category ? 'btn-primary' : 'btn-outline-primary'} me-2 mb-2`}
                                onClick={() => handleFilterChange(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
                <div className='col-lg-4 col-sm-12 col-md-4'>
                    <LocationBlock onLocationChange={handleLocationChange} />
                </div>
            </div>

            {/* Display Events or Locations */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-around",
                    flexWrap: "wrap"
                }}
            >
                {events.length > 0 ? (
                    events.map((event, index) => (
                        <div key={index} className="card mb-3" style={{ width: "18rem" }}>
                            <img src={event.image || 'https://via.placeholder.com/300x200'} className="card-img-top" alt={event.name} />
                            <div className="card-body">
                                <h5 className="card-title">{event.name || "Unnamed Event"}</h5>
                                <p className="card-text">{event.description || "No description available"}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    locations.slice(0, visibleCount).map((location, index) => (
                        <LocationCard
                            key={index}
                            name={location.title?.replace(/[0-9. ]/g, '') || 'Unknown'}
                            rating={location.rating || 'N/A'}
                            places={location.placesNumberToVisit || "0"}
                            bestTime={location.best_time || 'N/A'}
                            images={location.images || ['https://via.placeholder.com/300x200?text=No+Image']}
                        />
                    ))
                )}
            </div>

            {visibleCount < locations.length && events.length === 0 && (
                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                    <button className="btn btn-black" onClick={handleShowMore}>
                        Show More
                    </button>
                </div>
            )}
        </section>
    );
};
export default FestivalsEvents;