import React, { useState, useEffect } from 'react';
import { IoLocationSharp } from 'react-icons/io5';
import { MdAccessTime } from 'react-icons/md';

const CultureFestivalsCardComponent = ({ data, type }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  // Auto-rotate images
  useEffect(() => {
    if (data.images && data.images.length > 1) {
      const interval = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentImageIndex((prev) =>
            prev === data.images.length - 1 ? 0 : prev + 1
          );
          setIsTransitioning(false);
        }, 150); // Half of transition duration
      }, 4000); // Increased interval for better UX

      return () => clearInterval(interval);
    }
  }, [data.images]);

  const currentImage = data.images?.[currentImageIndex];

  return (

    <div className="cf-card">
      <div className="row g-0 h-100">
        {/* Left Side - Images */}
        <div className="col-lg-4 col-md-5 col-sm-6">
          <div className="cf-image-container">
            {/* Image Carousel */}
            <div className="cf-carousel-wrapper">
              <div
                className="cf-carousel-track"
                style={{
                  transform: `translateX(-${currentImageIndex * 100}%)`,
                  transition: isTransitioning ? 'none' : 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {data.images?.map((image, index) => (
                  <div key={index} className="cf-carousel-slide">
                    <img
                      src={image.image_url || '/api/placeholder/300/200'}
                      alt={`${data.name} - Image ${index + 1}`}
                      className="cf-image"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Fallback for single image or no images */}
            {(!data.images || data.images.length <= 1) && (
              <img
                src={data.images?.[0]?.image_url || '/api/placeholder/300/200'}
                alt={data.name}
                className="cf-image cf-single-image"
              />
            )}

            {/* Type Badge */}
            <div className="cf-badge-container">
              <span className={`cf-badge ${type === 'culture' ? 'cf-badge-culture' : 'cf-badge-festival'}`}>
                {type === 'culture' ? 'Culture' : 'Festival'}
              </span>
            </div>

            {/* Image Indicators */}
            {data.images && data.images.length > 1 && (
              <div className="cf-indicators">
                {data.images.map((_, index) => (
                  <div
                    key={index}
                    className={`cf-indicator ${index === currentImageIndex ? 'cf-indicator-active' : ''}`}
                    onClick={() => {
                      setIsTransitioning(true);
                      setTimeout(() => {
                        setCurrentImageIndex(index);
                        setIsTransitioning(false);
                      }, 150);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="col-lg-8 col-md-7 col-sm-6">
          <div className="cf-content">
            {/* Header */}
            <div className="cf-header">
              <h3 className="cf-title">{data.name}</h3>
              <p className="cf-description">{data.description}</p>
            </div>

            {/* Details */}
            <div className="cf-details">
              {/* Village */}
              <div className="cf-detail-item">
                <IoLocationSharp className="cf-icon cf-icon-location" />
                <span className="cf-detail-text">{data.village}</span>
              </div>

              {/* Timings */}
              <div className="cf-detail-item">
                <MdAccessTime className="cf-icon cf-icon-time" />
                <span className="cf-detail-text">{data.timings}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cf-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: all 0.3s ease;
          margin-bottom: 1rem;
          height: 150px;
        }

        .cf-card:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .cf-image-container {
          position: relative;
          height: 150px;
          overflow: hidden;
        }

        /* Carousel Styles */
        .cf-carousel-wrapper {
          width: 100%;
          height: 100%;
          overflow: hidden;
          position: relative;
        }

        .cf-carousel-track {
          display: flex;
          height: 100%;
          width: 100%;
        }

        .cf-carousel-slide {
          min-width: 100%;
          height: 100%;
          position: relative;
        }

        .cf-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .cf-single-image {
          position: absolute;
          top: 0;
          left: 0;
        }

        .cf-image:hover {
          transform: scale(1.05);
        }

        .cf-badge-container {
          position: absolute;
          top: 8px;
          left: 8px;
          z-index: 10;
        }

        .cf-badge {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          backdrop-filter: blur(4px);
        }

        .cf-badge-culture {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .cf-badge-festival {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .cf-indicators {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
          z-index: 10;
        }

        .cf-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .cf-indicator:hover {
          background: rgba(255, 255, 255, 0.8);
          transform: scale(1.1);
        }

        .cf-indicator-active {
          background: white;
          transform: scale(1.3);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .cf-content {
          padding: 16px;
          height: 150px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .cf-header {
          flex: 1;
          text-align: left;
        }

        .cf-title {
          font-size: 18px;
          font-weight: 700;
          color: #1a202c;
          margin: 0 0 8px 0;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .cf-description {
          font-size: 13px;
          color: #4a5568;
          line-height: 1.4;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .cf-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .cf-detail-item {
          display: flex;
          align-items: flex-start;
          gap: 6px;
        }

        .cf-icon {
          font-size: 14px;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .cf-icon-location {
          color: #3182ce;
        }

        .cf-icon-time {
          color: #38a169;
        }

        .cf-detail-text {
          font-size: 12px;
          color: #2d3748;
          font-weight: 500;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Responsive Styles */
        @media (max-width: 991.98px) {
          .cf-card {
            height: auto;
            min-height: 150px;
          }
          
          .cf-image-container {
            height: 150px;
          }
          
          .cf-content {
            height: 150px;
            padding: 12px;
          }
          
          .cf-title {
            font-size: 16px;
          }
        }

        @media (max-width: 767.98px) {
          .cf-card {
            height: auto;
            min-height: 130px;
          }
          
          .cf-image-container {
            height: 130px;
          }
          
          .cf-content {
            height: 130px;
            padding: 10px;
          }
          
          .cf-title {
            font-size: 15px;
          }
          
          .cf-description {
            font-size: 12px;
            -webkit-line-clamp: 1;
          }
          
          .cf-detail-text {
            font-size: 11px;
            -webkit-line-clamp: 1;
          }

          .cf-indicator {
            width: 6px;
            height: 6px;
          }
        }

        @media (max-width: 575.98px) {
          .cf-card {
            height: auto;
          }
          
          .cf-image-container {
            height: 130px;
          }
          
          .cf-content {
            height: auto;
            min-height: 130px;
            padding: 8px;
          }
        }
      `}
      </style>
    </div>
  );
};

export default CultureFestivalsCardComponent;