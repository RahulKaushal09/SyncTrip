// import React, { useState } from 'react';

// const ItineraryDayWiseComponent = ({ itinerary }) => {
//     const [selectedDay, setSelectedDay] = useState(itinerary?.days[0]?.dayTitle || '');

//     const handleDayClick = (dayTitle) => {
//         setSelectedDay(dayTitle);
//     };

//     const selectedDayData = itinerary?.days.find(day => day.dayTitle === selectedDay);

//     // Extract day number from dayTitle (e.g., "Day 1" -> "1")
//     const getDayNumber = (dayTitle) => {
//         const match = dayTitle.match(/\d+/);
//         return match ? match[0] : '';
//     };

//     // Mock data for demonstration
//     const mockItinerary = itinerary || {
//         days: [
//             {
//                 dayTitle: "Day 1",
//                 htmlDescription: "<h3>Departure from Panjab University</h3><ul><li>9:00 PM – Departure from Panjab University at night</li></ul>"
//             },
//             {
//                 dayTitle: "Day 2",
//                 htmlDescription: "<h3>Adventure Activities</h3><ul><li>Morning trek to mountain peak</li><li>River rafting experience</li><li>Sunset viewing point</li></ul>"
//             },
//             {
//                 dayTitle: "Day 3",
//                 htmlDescription: "<h3>Cultural Immersion</h3><ul><li>Local museum visits</li><li>Traditional craft workshop</li><li>Dinner with local family</li></ul>"
//             },
//             {
//                 dayTitle: "Day 4",
//                 htmlDescription: "<h3>Sightseeing Tour</h3><ul><li>Historic monuments</li><li>Local markets exploration</li><li>Photography session</li></ul>"
//             },
//             {
//                 dayTitle: "Day 5",
//                 htmlDescription: "<h3>Departure Day</h3><ul><li>Morning spa treatment</li><li>Shopping for souvenirs</li><li>Return journey begins</li></ul>"
//             }
//         ]
//     };

//     const workingItinerary = itinerary || mockItinerary;
//     const workingSelectedDay = selectedDay || workingItinerary.days[0]?.dayTitle;
//     const workingSelectedDayData = workingItinerary.days.find(day => day.dayTitle === workingSelectedDay);

//     return (
//         <div style={{
//             width: '100%',
//             maxWidth: '800px',
//             margin: '20px auto',
//             padding: '20px',
//             fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
//             background: 'white'
//         }}>
//             {/* Title */}
//             <h2 style={{
//                 fontSize: '28px',
//                 fontWeight: '600',
//                 color: 'black',
//                 marginBottom: '30px',
//                 marginTop: '0'
//             }}>
//                 Day-Wise Itinerary
//             </h2>

//             {/* Day Navigation Pills */}
//             <div style={{
//                 display: 'flex',
//                 gap: '12px',
//                 marginBottom: '30px',
//                 flexWrap: 'wrap'
//             }}>
//                 {workingItinerary.days.map((day, index) => (
//                     <button
//                         key={index}
//                         onClick={() => handleDayClick(day.dayTitle)}
//                         style={{
//                             padding: '12px 24px',
//                             borderRadius: '25px',
//                             border: 'none',
//                             background: workingSelectedDay === day.dayTitle ? '#00bcd4' : '#f5f5f5',
//                             color: workingSelectedDay === day.dayTitle ? 'white' : 'black',
//                             cursor: 'pointer',
//                             fontSize: '16px',
//                             fontWeight: '500',
//                             transition: 'all 0.2s ease'
//                         }}
//                         onMouseEnter={(e) => {
//                             if (workingSelectedDay !== day.dayTitle) {
//                                 e.target.style.background = '#e0e0e0';
//                             }
//                         }}
//                         onMouseLeave={(e) => {
//                             if (workingSelectedDay !== day.dayTitle) {
//                                 e.target.style.background = '#f5f5f5';
//                             }
//                         }}
//                     >
//                         {day.dayTitle}
//                     </button>
//                 ))}
//             </div>

//             {/* Content Display */}
//             <div style={{
//                 background: 'white',
//                 padding: '0',
//                 color: 'black'
//             }}>
//                 {workingSelectedDayData ? (
//                     <div
//                         style={{
//                             fontSize: '16px',
//                             lineHeight: '1.6'
//                         }}
//                         dangerouslySetInnerHTML={{
//                             __html: workingSelectedDayData.htmlDescription
//                         }}
//                     />
//                 ) : (
//                     <div style={{
//                         textAlign: 'center',
//                         padding: '40px',
//                         color: '#666'
//                     }}>
//                         <p>No itinerary available for this day</p>
//                     </div>
//                 )}
//             </div>

//             <style>
//                 {`
//                 /* Styling for the HTML content */
//                 h3 {
//                     color: black !important;
//                     font-size: 20px !important;
//                     font-weight: 600 !important;
//                     margin: 0 0 15px 0 !important;
//                 }
                
//                 ul {
//                     margin: 0 !important;
//                     padding-left: 20px !important;
//                     list-style-type: disc !important;
//                 }
                
//                 li {
//                     color: black !important;
//                     margin-bottom: 8px !important;
//                     font-size: 16px !important;
//                 }
                
//                 p {
//                     color: black !important;
//                     margin-bottom: 15px !important;
//                 }
                
//                 strong {
//                     color: black !important;
//                 }
                
//                 @media (max-width: 768px) {
//                     .day-pills {
//                         flex-direction: column;
//                         align-items: stretch;
//                     }
                    
//                     .day-pill-button {
//                         text-align: center;
//                     }
//                 }
//                 `}
//             </style>
//         </div>
//     );
// };

// export default ItineraryDayWiseComponent;