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
import { useNavigate } from 'react-router-dom';

const containerStyle = {
  width: '100vw',
  height: '80vh',
};

const defaultCenter = {
  lat: 1.348815,
  lng: 103.827372,
};

export const Patrol = () => {
  const [center, setCenter] = useState(defaultCenter);
  // API DATA
  const { data: centroidData, isLoading: isCentroidDataLoading } =
    useCentroidData();
  const { data: locationData, isLoading: isLocationDataLoading } =
    useLocationData();
  // CENTROIDS
  const [centroids, setCentroids] = useState([]);
  const [groupings, setGroupings] = useState('');
  const [clusters, setClusters] = useState([]);
  const [areCentroidsLoaded, setCentroidsLoaded] = useState(false);
  const [markerArray, setMarkerArray] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [locations, setLocations] = useState([]);

  // QUERY (FILTER)
  const [query, setQuery] = useState('All');
  const [indexMap, setIndexMap] = useState(null);
  const [displayedPath, setDisplayedPath] = useState(null);
  const [displayedRoute, setDisplayedRoute] = useState(null);

  const handleSelected = (item) => {
    if (item === 'All') {
      setQuery(null);
    } else {
      setQuery(item);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (query === 'All') {
      setDisplayedPath(pathArray);
    } else {
      navigate('/path', [locationData[query]]);
    }
    console.log(displayedPath);
  }, [query]);

  // TSP
  const [pathArray, setPathArray] = useState(null);

  useEffect(() => {
    if (!isCentroidDataLoading && centroidData) {
      // SET CENTROIDS
      const centroids = centroidData.map((item) => item.centroid);
      setCentroids(centroids);
      // SET MARKERS
      const markers = centroidData
        .map((item) => item.markers)
        .flatMap((i) => i);
      setMarkerArray(markers);
      // SET CLUSTERS
      const clusters = centroidData.map((item) => item.points);
      setClusters(clusters);
      // SET GROUPINGS
      const groupings = centroidData
        .map((item) => item.mapping)
        .flatMap((i) => i.points);
      setGroupings(groupings);
      let indexMap = {};
      let pathArray = [];
      let i = 0;
      groupings.map((item) => {
        const currentPath = nearestNeighborTSP(item.markers, {
          lat: item.lat,
          lng: item.lng,
        });
        indexMap[item.loc] = currentPath;
        i++;
        pathArray.push(currentPath);
      });
      setPathArray(pathArray);
      setDisplayedPath(pathArray);
      setIndexMap(indexMap);
      console.log(indexMap);
      setCentroidsLoaded(true);
    }
    if (!isLocationDataLoading && locationData) {
      const locations = locationData.map((item) => item.location);
      setLocations(locations);
    }
  }, [
    centroidData,
    isCentroidDataLoading,
    locationData,
    isLocationDataLoading,
  ]);

  function toRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }

  function calculateDistance(point1, point2) {
    const earthRadiusKm = 6371;
    const dLat = toRadians(point2.lat - point1.lat);
    const dLon = toRadians(point2.lng - point1.lng);

    const lat1 = toRadians(point1.lat);
    const lat2 = toRadians(point2.lat);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  }

  function nearestNeighborTSP(points, start) {
    let unvisited = [...points];
    let path = [start];
    let current = start;

    while (unvisited.length > 0) {
      let nearest = unvisited.reduce((nearest, point) => {
        if (!nearest) {
          return point;
        }
        let nearestDistance = calculateDistance(current, nearest);
        let pointDistance = calculateDistance(current, point);
        return pointDistance < nearestDistance ? point : nearest;
      }, null);

      path.push(nearest);
      current = nearest;
      unvisited = unvisited.filter((point) => point !== nearest);
    }
    return path;
  }

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
            {areCentroidsLoaded &&
              clusters.map((cluster, index) =>
                cluster.map((item) => (
                  <Circle
                    center={{
                      lat: Number(item.lat),
                      lng: Number(item.lng),
                    }}
                    options={getGroupingCircle(index)}
                    key={`${Math.random() * Math.random()}`}
                  />
                )),
              )}
            {markerArray.length > 0 &&
              markerArray.map((item, index) => {
                return (
                  <Circle
                    center={{
                      lat: Number(item.lat),
                      lng: Number(item.lng),
                    }}
                    onClick={() => {
                      setSelectedMarker(item);
                    }}
                    options={getMarkerCircle()}
                    key={index}
                  />
                );
              })}

            {areCentroidsLoaded &&
              centroids.map((item, index) => (
                <MarkerF
                  position={{
                    lat: Number(item.lat),
                    lng: Number(item.lng),
                  }}
                  onClick={() => {
                    setSelectedMarker(item);
                  }}
                  key={index}
                />
              ))}
            {displayedPath &&
              displayedPath.map((item, index) => (
                <Polyline path={item} options={getPathOptions(index % 11)} />
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
