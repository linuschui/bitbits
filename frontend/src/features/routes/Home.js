import React, { useState, useEffect } from 'react';
import {
  GoogleMap,
  LoadScript,
  Marker,
  Circle,
  useLoadScript,
} from '@react-google-maps/api';
import { useLocationData } from '../../hooks';
import { useCrimeData } from '../../hooks';
import { Header } from '../../components';

const containerStyle = {
  width: '100vw',
  height: '90vh',
};

const defaultCenter = {
  lat: 1.348815,
  lng: 103.827372,
};

export const Home = () => {
  const [center, setCenter] = useState(defaultCenter);
  const { data: crimeData, isLoading: isCrimeDataLoading } = useCrimeData();
  const { data: centroidData, isLoading: isCentroidDataLoading } =
    useLocationData();
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
      setCentroids(centroidData.centroids);
      const newGroupings = {};

      centroidData.centroids.forEach((centroid) => {
        const key = `${centroid.centroidLatitude},${centroid.centroidLongitude}`;
        newGroupings[key] = centroidData.mappings[key] || [];
      });

      setGroupings(newGroupings);
      console.log(newGroupings);
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
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
          >
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
              {areCentroidsLoaded &&
                centroids.map((item, index) => (
                  <Circle
                    center={{
                      lat: Number(item.centroidLatitude),
                      lng: Number(item.centroidLongitude),
                    }}
                    options={getCentroidCircle()}
                    key={index}
                  />
                ))}
            </>
          </GoogleMap>
        </LoadScript>
      </div>
    </>
  );
};
