import React, { useState, useEffect } from 'react';
import { GoogleMap, MarkerF, Circle } from '@react-google-maps/api';
import { useCentroidData, useCrimeData } from '../../hooks';
import { Header } from '../../components';

const containerStyle = {
  width: '100vw',
  height: '80vh',
};

const defaultCenter = {
  lat: 1.348815,
  lng: 103.827372,
};

export const Home = () => {
  const [center, setCenter] = useState(defaultCenter);
  const { data: crimeData, isLoading: isCrimeDataLoading } = useCrimeData();
  const { data: centroidData, isLoading: isCentroidDataLoading } =
    useCentroidData();
  const [centroids, setCentroids] = useState('');
  const [groupings, setGroupings] = useState('');
  const [areCoordinatesLoaded, setCoordinatesLoaded] = useState(false);
  const [areCentroidsLoaded, setCentroidsLoaded] = useState(false);

  const [crimeCountData, setCrimeCountData] = useState([]);

  useEffect(() => {
    if (!isCrimeDataLoading && crimeData) {
      setCrimeCountData(crimeData);
      console.log(crimeData);
      setCoordinatesLoaded(true);
    }
    if (!isCentroidDataLoading && centroidData) {
      const centroids = centroidData.map((item) => item.centroid);
      console.log(centroids);
      setCentroids(centroids);
      setCentroidsLoaded(true);
    }
  }, [crimeData, isCrimeDataLoading, centroidData, isCentroidDataLoading]);

  // Get current location
  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       ({ coords }) => {
  //         setCenter({
  //           lat: coords.latitude,
  //           lng: coords.longitude,
  //         });
  //         setLocationLoaded(true);
  //       },
  //       (err) => {
  //         console.error('Error fetching location', err);
  //         setLocationLoaded(true);
  //       },
  //     );
  //   } else {
  //     console.error('Geolocation is not supported by this browser.');
  //     setLocationLoaded(true);
  //   }
  // }, []);

  function getCircleOptions(count) {
    let baseOpacity = 0.2;
    let additionalOpacity = (count - 80) * 0.005;
    let fillOpacity = baseOpacity + additionalOpacity;

    fillOpacity = Math.max(baseOpacity, Math.min(fillOpacity, 0.6));

    const circleOptions = {
      strokeColor: `${count < 60 ? '#00FF00' : '#FF0000'}`,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: `${count < 60 ? '#00FF00' : '#FF0000'}`,
      fillOpacity: fillOpacity,
      clickable: false,
      draggable: false,
      editable: false,
      visible: true,
      radius: 2000,
      zIndex: 1,
    };
    return circleOptions;
  }

  function getCentroidCircle() {
    const circleOptions = {
      strokeColor: `#000000`,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: `#000000`,
      fillOpacity: 0.2,
      clickable: false,
      draggable: false,
      editable: false,
      visible: true,
      radius: 2000,
      zIndex: 1,
    };
    return circleOptions;
  }

  return (
    <>
      <Header />
      <div>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
          <>
            {areCoordinatesLoaded &&
              crimeCountData.map((item, index) => (
                <Circle
                  center={{
                    lat: Number(item.latitude),
                    lng: Number(item.longitude),
                  }}
                  options={getCircleOptions(item.count)}
                  key={index}
                />
              ))}
            {/* {areCentroidsLoaded &&
              centroids.map((item, index) => (
                <Circle
                  center={{
                    lat: Number(item.centroidLatitude),
                    lng: Number(item.centroidLongitude),
                  }}
                  options={getCentroidCircle()}
                  key={index}
                />
              ))} */}

            {areCentroidsLoaded &&
              centroids.map((item, index) => (
                <MarkerF
                  position={{
                    lat: Number(item.lat),
                    lng: Number(item.lng),
                  }}
                  key={index}
                />
              ))}
          </>
        </GoogleMap>
      </div>
    </>
  );
};
