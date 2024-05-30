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

export const Patrol = () => {
  const [center, setCenter] = useState(defaultCenter);
  const { data: crimeData, isLoading: isCrimeDataLoading } = useCrimeData();
  const { data: centroidData, isLoading: isCentroidDataLoading } =
    useLocationData();
  const [centroids, setCentroids] = useState('');
  const [groupings, setGroupings] = useState('');
  const [areCentroidsLoaded, setCentroidsLoaded] = useState(false);
  const [markerArray, setMarkerArray] = useState([]);

  useEffect(() => {
    if (!isCentroidDataLoading && centroidData) {
      setCentroids(centroidData.centroids);
      const newGroupings = {};

      centroidData.centroids.forEach((centroid) => {
        const key = `${centroid.centroidLatitude},${centroid.centroidLongitude}`;
        newGroupings[key] = centroidData.mappings[key] || [];
      });

      setGroupings(newGroupings);
      let newMarkers = [];
      for (const [key, value] of Object.entries(newGroupings)) {
        const markers = generateRandomPoints(
          Number(key.split(',')[1]),
          Number(key.split(',')[0]),
          4,
          100,
        );
        newMarkers = [...newMarkers, ...markers];
      }
      setMarkerArray(newMarkers);
      console.log(newGroupings);
      let assignments = [];
      let j = 0;
      Object.values(groupings).forEach((item) => {
        const currAssignment = assignMarkersToOffices(j, item, newMarkers);
        assignments.push(currAssignment);
        j++;
      });
      console.log(assignments);
      setCentroidsLoaded(true);
    }
  }, [crimeData, isCrimeDataLoading, centroidData, isCentroidDataLoading]);

  function getFillColor(id) {
    const hm = {};
    hm[0] = 'orange';
    hm[1] = 'pink';
    hm[2] = 'brown';
    hm[3] = 'purple';
    hm[4] = 'cyan';
    return hm[id];
  }

  function getGroupingCircle(id) {
    const circleOptions = {
      strokeColor: `#000000`,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: getFillColor(id),
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

  function getCentroidCircle() {
    const circleOptions = {
      strokeColor: `#000000`,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: 'black',
      fillOpacity: 0.4,
      clickable: false,
      draggable: false,
      editable: false,
      visible: true,
      radius: 3000,
      zIndex: 1,
    };
    return circleOptions;
  }

  function getMarkerCircle() {
    const circleOptions = {
      strokeColor: `#000000`,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: 'black',
      fillOpacity: 0.4,
      clickable: false,
      draggable: false,
      editable: false,
      visible: true,
      radius: 10,
      zIndex: 1,
    };
    return circleOptions;
  }

  function generateRandomPoints(lng, lat, radius, numPoints) {
    const randomPoints = [];
    const degreesToRadians = (deg) => (deg * Math.PI) / 180;
    const radiansToDegrees = (rad) => (rad * 180) / Math.PI;
    const earthRadius = 6371; // Earth's radius in kilometers

    for (let i = 0; i < numPoints; i++) {
      const u = Math.random();
      const v = Math.random();
      const w = (radius / earthRadius) * Math.sqrt(u);
      const t = 2 * Math.PI * v;
      const x = w * Math.cos(t);
      const y = w * Math.sin(t);
      const new_x = x / Math.cos(degreesToRadians(lat));

      const newLat = lat + radiansToDegrees(y);
      const newLng = lng + radiansToDegrees(new_x);

      randomPoints.push({ lat: newLat, lng: newLng });
    }

    return randomPoints;
  }

  function assignMarkersToOffices(j, offices, markerArray) {
    const assignments = {};
    console.log(markerArray);
    console.log(offices);
    offices.forEach((office, index) => {
      if (!assignments[office.loc]) {
        assignments[office.loc] = [];
      }
      for (let i = 0; i < markerArray[j].length; i += offices.length) {
        assignments[office.loc].push(markerArray[j][i]);
      }
    });
    console.log(assignments);
    return assignments;
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
              {areCentroidsLoaded &&
                Object.entries(groupings).map(([key, group], index) =>
                  group.map((item, id) => (
                    <Circle
                      center={{
                        lat: Number(item.coords.split(',')[0]),
                        lng: Number(item.coords.split(',')[1]),
                      }}
                      options={getGroupingCircle(index)}
                      key={`${key}-${id}`}
                    />
                  )),
                )}
              {markerArray.length > 0 &&
                markerArray
                  .flatMap((i) => i)
                  .map((item, index) => (
                    <Circle
                      center={{
                        lat: Number(item.lat),
                        lng: Number(item.lng),
                      }}
                      options={getMarkerCircle()}
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
