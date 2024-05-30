import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Circle } from '@react-google-maps/api';

const containerStyle = {
  width: '100vw',
  height: '100vh',
};

const defaultCenter = {
  lat: -34.397,
  lng: 150.644,
};

export const Home = () => {
  const [center, setCenter] = useState(defaultCenter);
  const [isLocationLoaded, setLocationLoaded] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setCenter({
            lat: coords.latitude,
            lng: coords.longitude,
          });
          setLocationLoaded(true);
        },
        (err) => {
          console.error('Error fetching location', err);
          setLocationLoaded(true);
        },
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setLocationLoaded(true);
    }
  }, []);

  const circleOptions = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 1000,
    zIndex: 1,
  };

  return (
    <div>
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
          {isLocationLoaded && (
            <>
              <Marker position={center} />{' '}
              <Circle center={center} options={circleOptions} />
            </>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};
