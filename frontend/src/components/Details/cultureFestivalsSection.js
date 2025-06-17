import React, { useState, useEffect } from 'react';

import CultureFestivalsCardComponent from './cultureFestivalsCard';

const CultureFestivalsSection = ({ data, heading, type }) => {
    return (
        <div className="cf-section" style={{ marginBottom: '50px' }}>
            <h2 className="DescriptionHeading"><strong>{heading}</strong></h2>
            {
                data.map((item, index) => (
                    <CultureFestivalsCardComponent
                        key={index}
                        data={item}
                        type={type}
                    />
                ))
            }
        </div>
    );
};

export default CultureFestivalsSection;
