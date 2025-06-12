import React, { useState } from 'react';

const HotelFormModal = ({ locationId, onClose, onHotelAdded }) => {
    const [hotelData, setHotelData] = useState({
        hotel_name: '',
        hotel_description: '',
        hotel_link: '',
        hotel_images: [],
        hotel_location: {
            neighbourhood: '',
            distance_from_city_centre: '',
            rating: {
                score: '',
                review_count: 0,
            },
            top_location: '',
        },
        price: {
            amount: '',
            description: '',
        },
        location: locationId,
    });

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setHotelData(prev => ({
            ...prev,
            hotel_images: [...prev.hotel_images, ...files]
        }));
    };

    const handleChange = (field, value) => {
        setHotelData(prev => ({ ...prev, [field]: value }));
    };

    const handleNestedChange = (parentField, field, value) => {
        setHotelData(prev => ({
            ...prev,
            [parentField]: {
                ...prev[parentField],
                [field]: value,
            },
        }));
    };
    const handleRemoveImage = (indexToRemove) => {
        setHotelData(prev => ({
            ...prev,
            hotel_images: prev.hotel_images.filter((_, index) => index !== indexToRemove),
        }));
    };
    const handleNestedDeepChange = (parentField, childField, field, value) => {
        setHotelData(prev => ({
            ...prev,
            [parentField]: {
                ...prev[parentField],
                [childField]: {
                    ...prev[parentField][childField],
                    [field]: value,
                },
            },
        }));
    };

    const handleSubmit = async (e) => {
        try {

            e.preventDefault();

            const formData = new FormData();
            if (!hotelData.hotel_name || !hotelData.hotel_description || !hotelData.hotel_link) {
                alert("Please fill all the fields");
                return;
            }
            if (hotelData.hotel_images.length === 0) {
                alert("Please upload at least one image");
                return;
            }


            Object.keys(hotelData).forEach(key => {
                if (key === 'hotel_images') {
                    hotelData.hotel_images.forEach(file => {
                        formData.append('hotel_images', file);
                    });
                } else if (typeof hotelData[key] === 'object') {
                    formData.append(key, JSON.stringify(hotelData[key]));
                } else {
                    formData.append(key, hotelData[key]);
                }
            });

            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/hotels/addNewHotel`, {
                    method: 'POST',
                    body: formData,
                });

                const data = await res.json();
                if (data.hotelId) {
                    onHotelAdded(data.hotelId);
                    onClose(); // Close modal after adding
                }
            } catch (error) {
                console.error('Error adding hotel:', error);
            }
        }
        catch (error) {
            console.error('Error:', error);
        }

    };

    return (
        <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>

            <div className="modal-dialog modal-lg">
                <div className="modal-content p-4">
                    <h5>Add New Hotel</h5>
                    <form >
                        <input type="text" placeholder="Hotel Name" className="form-control my-2"
                            value={hotelData.hotel_name} onChange={(e) => handleChange('hotel_name', e.target.value)} />

                        <input type="text" placeholder="Hotel Link" className="form-control my-2"
                            value={hotelData.hotel_link} onChange={(e) => handleChange('hotel_link', e.target.value)} />

                        <textarea placeholder="Hotel Description" className="form-control my-2"
                            value={hotelData.hotel_description} onChange={(e) => handleChange('hotel_description', e.target.value)} />

                        {/* Images upload */}
                        <input type="file" multiple className="form-control my-2" onChange={handleImageUpload} />

                        {hotelData.hotel_images.length > 0 && (
                            <div className="my-2">
                                <h6>Uploaded Images:</h6>
                                <div className="my-3 d-flex flex-wrap">
                                    {hotelData.hotel_images.map((file, index) => {
                                        let src = '';
                                        if (file instanceof File) {
                                            src = URL.createObjectURL(file);
                                        } else if (typeof file === 'string') {
                                            src = file;
                                        }
                                        return (
                                            <div key={index} className="position-relative me-2 mb-2">
                                                <img
                                                    src={src}
                                                    alt="preview"
                                                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '2px',
                                                        right: '2px',
                                                        background: 'red',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '50%',
                                                        width: '20px',
                                                        height: '20px',
                                                        fontSize: '12px',
                                                        cursor: 'pointer',
                                                        lineHeight: '20px',
                                                        textAlign: 'center',
                                                        padding: 0,
                                                    }}
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        <hr />

                        <h6>Hotel Location Info</h6>

                        <input type="text" placeholder="Neighbourhood" className="form-control my-2"
                            value={hotelData.hotel_location.neighbourhood}
                            onChange={(e) => handleNestedChange('hotel_location', 'neighbourhood', e.target.value)} />

                        <input type="text" placeholder="Distance from City Centre" className="form-control my-2"
                            value={hotelData.hotel_location.distance_from_city_centre}
                            onChange={(e) => handleNestedChange('hotel_location', 'distance_from_city_centre', e.target.value)} />

                        <input type="text" placeholder="Top Location" className="form-control my-2"
                            value={hotelData.hotel_location.top_location}
                            onChange={(e) => handleNestedChange('hotel_location', 'top_location', e.target.value)} />

                        <input type="text" placeholder="Rating Score" className="form-control my-2"
                            value={hotelData.hotel_location.rating.score}
                            onChange={(e) => handleNestedDeepChange('hotel_location', 'rating', 'score', e.target.value)} />

                        <input type="number" placeholder="Review Count" className="form-control my-2"
                            value={hotelData.hotel_location.rating.review_count}
                            onChange={(e) => handleNestedDeepChange('hotel_location', 'rating', 'review_count', Number(e.target.value))} />

                        <hr />

                        <h6>Price Info</h6>

                        <input type="text" placeholder="Amount" className="form-control my-2"
                            value={hotelData.price.amount}
                            onChange={(e) => handleNestedChange('price', 'amount', e.target.value)} />

                        <input type="text" placeholder="Price Description" className="form-control my-2"
                            value={hotelData.price.description}
                            onChange={(e) => handleNestedChange('price', 'description', e.target.value)} />

                        <div className="d-flex justify-content-end">
                            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Add Hotel</button>
                            <button type="button" className="btn btn-secondary ms-2" onClick={onClose}>Cancel</button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default HotelFormModal;
