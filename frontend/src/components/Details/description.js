import React, { useState } from 'react';
import '../../styles/Description.css'; // We'll create this CSS file separately
import { TiWeatherPartlySunny } from "react-icons/ti";
import { CiTimer } from "react-icons/ci";
import { MdSentimentVerySatisfied } from "react-icons/md";
import { TbTemperatureSun } from "react-icons/tb";
import location from "../../data/locations.json";
const Discription = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    // Shortened description for initial view
    const shortDescription = location[0].description;
    // Full description from the image
    const fullDescription = `<h1>Kashmir - Paradise on Earth</h1>
        <p>Popularly referred to as the "Paradise on Earth," Kashmir is a breathtaking region in northwestern India. Historically part of the princely state of Jammu and Kashmir, it was declared a Union Territory in 2019.</p>
        
        <h2>Major Cities</h2>
        <p>The major cities in the Kashmir Valley include:</p>
        <ul>
            <li>Srinagar</li>
            <li>Gulmarg</li>
            <li>Anantnag</li>
            <li>Baramulla</li>
        </ul>
        
        <h2>Natural Beauty and Attractions</h2>
        <p>Nestled in the Pir Panjal and Karakoram mountain ranges of the Himalayas, Kashmir is known for:</p>
        <ul>
            <li>Scenic splendor and snow-capped mountains</li>
            <li>Plentiful wildlife and exquisite monuments</li>
            <li>Hospitable people and traditional handicrafts</li>
            <li>Asia's longest Cable Car - <strong>Gulmarg Gondola</strong></li>
            <li>The famous <strong>Shikara rides</strong> in Dal Lake, Srinagar</li>
            <li>Exquisite Mughal gardens like Nishat Bagh, Shalimar Bagh, and Chashm-E-Shahi</li>
        </ul>
        
        <h2>Trekking and Adventure</h2>
        <p>Kashmir offers mesmerizing trekking and hiking routes:</p>
        <ul>
            <li><strong>Kashmir Great Lakes Trek</strong></li>
            <li><strong>Tarsar Marsar Trek</strong></li>
        </ul>
        <p>Adventure enthusiasts can enjoy:</p>
        <ul>
            <li>Skiing</li>
            <li>Golf</li>
            <li>River Rafting</li>
            <li>Paragliding</li>
            <li>Camping</li>
        </ul>
        
        <h2>Pilgrimage Sites</h2>
        <p>Kashmir is home to sacred pilgrimage destinations:</p>
        <ul>
            <li><strong>Amarnath</strong></li>
            <li><strong>Vaishno Devi</strong></li>
        </ul>
        
        <h2>Local Cuisine and Shopping</h2>
        <p><strong>Kashmiri cuisine</strong>, or Wazwan, is famous worldwide. Must-try dishes include:</p>
        <ul>
            <li>Rich, fragrant spiced delicacies</li>
        </ul>
        <p>Popular items to buy from Kashmir include:</p>
        <ul>
            <li>Kashmiri shawls</li>
            <li>Kashmiri apples</li>
            <li>Dried fruits (almonds and walnuts) from <strong>Lal Chowk Market</strong></li>
        </ul>
        
        <h2>Travel Tips</h2>
        <p>Be mindful of heavy snowfall affecting connectivity to some destinations in Kashmir during the winter months of December to February.</p>`;
    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="travel-info-container">
            <div className="info-grid">
                <div className="essentials-section">
                    <h2 className='DescriptionHeading'>Essentials</h2>
                    <div className="essentials-item">
                        <TiWeatherPartlySunny className="icon" /> Weather: 32°C
                    </div>
                    <div className="essentials-item">
                        <CiTimer className="icon" /> Ideal duration: 5 days
                    </div>
                    <div className="essentials-item">
                        <MdSentimentVerySatisfied className="icon" /> Best time: March-July
                    </div>
                </div>

                <div className="weather-section">
                    <h2 className='DescriptionHeading'>Upcoming weather</h2>
                    <div className="weather-item">
                        <TbTemperatureSun className="day-icon" /> Monday: 32°C
                    </div>
                    <div className="weather-item">
                        <TbTemperatureSun className="day-icon" /> Tuesday: 31°C
                    </div>
                    <div className="weather-item">
                        <TbTemperatureSun className="day-icon" /> Wednesday: 29°C
                    </div>
                </div>
            </div>

            <div className="description-section">
                <h2 className='DescriptionHeading'>Description</h2>
                <p
                    className="description-text"
                    dangerouslySetInnerHTML={{ __html: isExpanded ? fullDescription : shortDescription }}
                ></p>
                <button
                    className="view-more-btn"
                    onClick={toggleDescription}
                >
                    {isExpanded ? 'View Less' : 'View More'} →
                </button>
            </div>
            <hr></hr>
        </div>
    );
};

export default Discription;