// DOTENV
require("dotenv").config();
// EXPRESS
const express = require("express");
const kmeans = require("node-kmeans");
const app = express();
const port = process.env.PORT || 3500;
app.use(express.json());
// MIDDLEWARE
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const bodyParser = require("body-parser");
app.use(bodyParser.json());
// CORS
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
app.use(cors(corsOptions));
// LIBRARIES
const fs = require("fs");
const axios = require("axios");
const csvtojson = require("csvtojson");
// DB
const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.MYSQL_PASSWORD,
  database: "bitbits",
});
connection.connect((err) => {
  if (err) {
    console.error(`Error Connecting To MySQL : ${err}`);
    return;
  }
  console.log("Connected to MySQL");
});
app.listen(port, () => {
  console.log(`Server Is Running On Port : ${port}`);
});
// DEFAULT ENDPOINT
app.get("/", async (req, res) => {
  res.json({
    message: "200 OK",
  });
});
// DATABASE INITIALISATION : crime_data
app.get("/crime_data_csv_to_mysql", async (req, res) => {
  console.log(`${new Date().toLocaleString()} | GET /crime_data_csv_to_mysql`);
  try {
    const filePath = "./data/crime_data.csv";
    csvtojson()
      .fromFile(filePath)
      .then((jsonArray) => {
        const filteredArray = jsonArray.filter(
          (item) =>
            item["value"] !== "na" || item["level_1"].includes("Unknown")
        );
        filteredArray.forEach((row) => {
          const year = row["year"];
          const division = row["level_1"].split(" - ")[0];
          const npc = row["level_1"].split(" - ")[1];
          const count = row["value"];
          const query = `INSERT INTO crime_data (year, division, npc, count) VALUES (?, ?, ?, ?)`;
          const queryParams = [year, division, npc, count];
          connection.query(query, queryParams, (error, result) => {
            if (error) {
              console.log(
                `${new Date().toLocaleString()} | GET /crime_data_csv_to_mysql : ERROR INSERTING DATA INTO MYSQL - ${error}`
              );
              res.status(500).json({
                error: `Error Inserting Data Into MySQL - ${error}`,
              });
            }
          });
        });
        console.log(
          `${new Date().toLocaleString()} | GET /crime_data_csv_to_mysql : 200 OK`
        );
        res.status(200).json({
          message: "Data Inserted From CSV to MySQL Successfully",
        });
      });
  } catch (error) {
    console.log(
      `${new Date().toLocaleString()} | GET /crime_data_csv_to_mysql : ERROR PROCESSING CSV DATA - ${error}`
    );
    res.status(500).json({
      error: `Error Processing CSV Data - ${error}`,
    });
  }
});
// DATABASE INITIALISATION : location_coordinate
app.get("/location_coordinates_json_to_mysql", async (req, res) => {
  console.log(
    `${new Date().toLocaleString()} | GET /location_coordinates_json_to_mysql`
  );
  fs.readFile("./data/location_coordinates_data.json", "utf8", (err, data) => {
    if (err) {
      console.log(
        `${new Date().toLocaleString()} | GET /location_coordinates_json_to_mysql : ERROR READING FILE - ${err}`
      );
      res.status(500).json({
        error: `Error Reading File - ${err}`,
      });
    }
    try {
      const jsonData = JSON.parse(data);
      const query =
        "INSERT INTO location_coordinates (location, latitude, longitude) VALUES ?";
      const queryParams = jsonData.map((obj) => [
        obj.location,
        obj.latitude,
        obj.longitude,
      ]);
      connection.query(query, [queryParams], (error, results, fields) => {
        if (error) {
          console.log(
            `${new Date().toLocaleString()} | GET /location_coordinates_json_to_mysql : ERROR INSERTING DATA INTO MYSQL - ${error}`
          );
          res.status(500).json({
            error: `Error Inserting Data Into MySQL - ${error}`,
          });
        }
        console.log(
          `${new Date().toLocaleString()} | GET /location_coordinates_json_to_mysql : 200 OK`
        );
        res.status(200).json({
          message: "Data Inserted From JSON to MySQL Successfully",
        });
      });
    } catch (error) {
      console.log(
        `${new Date().toLocaleString()} | GET /location_coordinates_json_to_mysql : ERROR PARSING JSON - ${error}`
      );
      res.status(500).json({
        error: `Error Parsing JSON - ${error}`,
      });
    }
  });
});
// FETCH DATA FROM crime_data
app.get("/get_crime_data", async (req, res) => {
  console.log(`${new Date().toLocaleString()} | GET /get_crime_data`);
  const query = `SELECT * FROM crime_data`;
  try {
    connection.query(query, (error, results) => {
      if (error) {
        console.log(
          `${new Date().toLocaleString()} | GET /get_crime_data : ERROR FETCHING DATA FROM MYSQL - ${error}`
        );
        res.status(500).json({
          error: `Error Fetching Data From MySQL - ${error}`,
        });
      }
      console.log(
        `${new Date().toLocaleString()} | GET /get_crime_data : 200 OK`
      );
      res.status(200).json(results);
    });
  } catch (error) {
    console.log(
      `${new Date().toLocaleString()} | GET /get_crime_data : ERROR FETCHING DATA FROM MYSQL - ${error}`
    );
    res.status(500).json({
      error: `Error Fetching Data From MySQL - ${error}`,
    });
  }
});
// FETCH DATA FROM location_coordinates
app.get("/get_location_coordinates_data", async (req, res) => {
  console.log(`${new Date().toLocaleString()} | GET /get_location_coordinates`);
  const query = `SELECT * FROM location_coordinates`;
  try {
    connection.query(query, (error, results) => {
      if (error) {
        console.log(
          `${new Date().toLocaleString()} | GET /get_location_coordinates_data : ERROR FETCHING DATA FROM MYSQL - ${error}`
        );
        res.status(500).json({
          error: `Error Fetching Data From MySQL - ${error}`,
        });
      }
      console.log(
        `${new Date().toLocaleString()} | GET /get_location_coordinates_data : 200 OK`
      );
      res.status(200).json(results);
    });
  } catch (error) {
    console.log(
      `${new Date().toLocaleString()} | GET /get_location_coordinates_data : ERROR FETCHING DATA FROM MYSQL - ${error}`
    );
    res.status(500).json({
      error: `Error Fetching Data From MySQL - ${error}`,
    });
  }
});
// FETCH CENTROIDS using location_coordinates
app.get("/get_centroids_data", async (req, res) => {
  console.log(`${new Date().toLocaleString()} | GET /get_centroids_data`);
  const query = `SELECT DISTINCT * FROM location_coordinates`;
  try {
    connection.query(query, (error, results) => {
      if (error) {
        console.log(
          `${new Date().toLocaleString()} | GET /get_centroids_data : ERROR FETCHING DATA FROM MYSQL - ${error}`
        );
        res.status(500).json({
          error: `Error Fetching Data From MySQL - ${error}`,
        });
        return;
      }

      const hm = {};
      for (const result of results) {
        hm[result.latitude + "," + result.longitude] = result.location;
      }
      // PREPARE DATA FOR CLUSTERING
      const vectors = results.map((record) => [
        record.latitude,
        record.longitude,
      ]);
      // MAPPING FUNCTION
      function mapClusterData(data) {
        const lat = Number(data.centroid[0]);
        const lng = Number(data.centroid[1]);
        return {
          centroid: {
            lat: data.centroid[0],
            lng: data.centroid[1],
          },
          points: data.cluster.map((point) => ({
            loc: hm[point[0] + "," + point[1]],
            lat: point[0],
            lng: point[1],
          })),
          markers: generateRandomPoints(lat, lng, 3, 300),
        };
      }
      // MAPPING FUNCTION
      function mapAll(data) {
        return {
          centroid: data.centroid,
          points: data.points,
          markers: data.markers,
          mapping: allocateMarkersToPoints(data.points, data.markers),
        };
      }
      // GENERATE RANDOM MARKERS
      function generateRandomPoints(lat, lng, radius, numPoints) {
        const randomPoints = [];
        const degreesToRadians = (deg) => (deg * Math.PI) / 180;
        const radiansToDegrees = (rad) => (rad * 180) / Math.PI;
        const earthRadius = 6371;
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
      // ALLOCATE RANDOM MARKERS TO POINTS
      function allocateMarkersToPoints(points, markers) {
        const numPoints = points.length;
        const numMarkers = markers.length;
        const baseMarkersPerPoint = Math.floor(numMarkers / numPoints);
        const remainder = numMarkers % numPoints;
        const allocatedMarkers = points.map(() => []);
        // DISTRIBUTE POINTS
        let markerIndex = 0;
        for (let i = 0; i < numPoints; i++) {
          // EACH POINT GET BASE AMOUNT OF MARKERS
          for (let j = 0; j < baseMarkersPerPoint; j++) {
            allocatedMarkers[i].push(markers[markerIndex]);
            markerIndex++;
          }
          // DISTRIBUTE REMAINDER POINTS
          if (i < remainder) {
            allocatedMarkers[i].push(markers[markerIndex]);
            markerIndex++;
          }
        }
        // CREATE RESULT INSTANCE
        return {
          points: points.map((point, index) => ({
            ...point,
            markers: allocatedMarkers[index],
          })),
        };
      }
      // PERFORM KMEANS CLUSTERING (5 CENTROIDS)
      kmeans.clusterize(vectors, { k: 5 }, (err, clusters) => {
        if (err) {
          console.log(
            `${new Date().toLocaleString()} | GET /get_centroids_data : ERROR IN K-MEANS CLUSTERING - ${err}`
          );
          res.status(500).json({
            error: `Error in K-means Clustering - ${err}`,
          });
          return;
        }
        console.log(clusters);
        // MAP DATA USING MAPPING FUNCTION
        const mappedClusters = clusters.map((item) => mapClusterData(item));
        // MAP DATA USING MAPPING FUNTION
        const mappedPoints = mappedClusters.map((item) => mapAll(item));
        // console.log(mappedPoints)
        console.log(
          `${new Date().toLocaleString()} | GET /get_centroids_data : 200 OK - centroids and groupings calculated`
        );
        res.status(200).json(mappedPoints);
      });
    });
  } catch (error) {
    console.log(
      `${new Date().toLocaleString()} | GET /get_centroids_data : ERROR FETCHING DATA FROM MYSQL - ${error}`
    );
    res.status(500).json({
      error: `Error Fetching Data From MySQL - ${error}`,
    });
  }
});

app.get("/crime_data_statistics", (req, res) => {
  console.log(`${new Date().toLocaleString()} | GET /crime_data_statistics`);
  const query = `
    SELECT location_coordinates.location, location_coordinates.latitude, location_coordinates.longitude, AVG(crime_data.count) AS count
    FROM crime_data, location_coordinates
    WHERE crime_data.npc != "Total" AND crime_data.npc = location_coordinates.location
    GROUP BY location_coordinates.location, location_coordinates.latitude, location_coordinates.longitude
    `;
  try {
    connection.query(query, (error, results) => {
      if (error) {
        console.log(
          `${new Date().toLocaleString()} | GET /crime_data_statistics : ERROR FETCHING DATA FROM MYSQL - ${error}`
        );
        res.status(500).json({
          error: `Error Fetching Data From MySQL - ${error}`,
        });
      }
      console.log(
        `${new Date().toLocaleString()} | GET /crime_data_statistics : 200 OK`
      );
      res.status(200).json(results);
    });
  } catch (error) {
    console.log(
      `${new Date().toLocaleString()} | GET /crime_data_statistics : ERROR FETCHING DATA FROM MYSQL - ${error}`
    );
    res.status(500).json({
      error: `Error Fetching Data From MySQL - ${error}`,
    });
  }
});
