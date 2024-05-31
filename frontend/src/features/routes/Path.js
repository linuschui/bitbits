import React, { useState, useEffect } from 'react';
import {
  GoogleMap,
  MarkerF,
  Circle,
  useLoadScript,
  DirectionsRenderer,
  Polyline,
  InfoWindow,
} from '@react-google-maps/api';
import { useCentroidData, useLocationData } from '../../hooks';
import { Header } from '../../components';
import './Patrol.css';
import DropdownMenu from '../../components/Dropdown';

const containerStyle = {
  width: '100vw',
  height: '80vh',
};

const defaultCenter = {
  lat: 1.348815,
  lng: 103.827372,
};

export const Path = (path, lat, lng) => {
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

  const colourMapping = {
    0: 'grey',
    1: 'red',
    2: 'orange',
    3: 'yellow',
    4: 'green',
    5: 'cyan',
    6: 'darkblue',
    7: 'purple',
    8: 'pink',
    9: 'turquoise',
    10: 'brown',
  };

  function getPathOptions(index) {
    const pathOptions = {
      strokeColor: colourMapping[index],
      strokeOpacity: 0.8,
      strokeWeight: 5,
      fillColor: colourMapping[index],
      fillOpacity: 0.35,
      zIndex: 2,
    };
    return pathOptions;
  }

  function calculateEuclideanDistance(point1, point2) {
    const dx = point1.lat - point2.lat;
    const dy = point1.lng - point2.lng;
    return Math.sqrt(dx * dx + dy * dy);
  }

  return (
    <>
      <Header />
      <div className="patrol-container">
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
          <>
            <Circle
              center={{
                lat: Number(lat),
                lng: Number(lng),
              }}
              options={getMarkerCircle()}
              key={index}
            />
            {displayedPath &&
              displayedPath.map((item, index) => (
                <Polyline path={path} options={getPathOptions(index % 11)} />
              ))}
          </>
        </GoogleMap>
        <div className="patrol-utilities-container">
          {locations && (
            <DropdownMenu data={locations} handleSelected={handleSelected} />
          )}
        </div>
      </div>
    </>
  );
};
