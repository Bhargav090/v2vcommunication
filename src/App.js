import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { initializeApp } from "firebase/app";
import { FaCarAlt } from "react-icons/fa";
import "./App.css";

const firebaseConfig = {
  apiKey: "AIzaSyA5F30J4uS0qfQgWM_-iKiNfRKsu3KEywg",
  authDomain: "v2vcommunication-912dd.firebaseapp.com",
  databaseURL: "https://v2vcommunication-912dd-default-rtdb.firebaseio.com",
  projectId: "v2vcommunication-912dd",
  storageBucket: "v2vcommunication-912dd.firebasestorage.app",
  messagingSenderId: "248778913962",
  appId: "1:248778913962:web:ba03ea7710c27d7b2c78d3",
  measurementId: "G-LTSJQ01S58",
};

// Initializing Firebase---------------------
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Define the construction zone position and detection radius
const constructionZone = {
  position: [500, 700], // [x, y]
  radius: 50,          // Radius for proximity check
};

const App = () => {
  const [vehicles, setVehicles] = useState({}); // Store vehicles as a dictionary for quick updates

  useEffect(() => {
    // Firebase listener for vehicle data
    const vehiclesRef = ref(database, "Vehicles");
    onValue(vehiclesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const updatedVehicles = {};
        Object.values(data).forEach((vehicle) => {
          updatedVehicles[vehicle.vehicleID] = vehicle;
        });

        setVehicles(updatedVehicles);
      }
    });
  }, []);

  // Function to check if a vehicle is near the construction zone
  const isNearConstruction = (vehicle) => {
    const dx = vehicle.position[0] - constructionZone.position[0];
    const dy = vehicle.position[1] - constructionZone.position[1];
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= constructionZone.radius;
  };

  // Vehicle card component
  const VehicleCard = ({ vehicle }) => {
    const nearConstruction = isNearConstruction(vehicle); // Check proximity
    return (
      <div className="vehicle-card">
        <FaCarAlt className="car-icon" />
        <h3>Vehicle {vehicle.vehicleID}</h3>
        <p>
          <strong>Speed:</strong> {vehicle.speed} km/h
        </p>
        <p>
          <strong>Position:</strong> ({vehicle.position[0]}, {vehicle.position[1]})
        </p>
        <p>
          <strong>Status:</strong>{" "}
          {nearConstruction ? (
            <span style={{ color: "red" }}>Near Construction Zone</span>
          ) : (
            <span style={{ color: "green" }}>Clear</span>
          )}
        </p>
      </div>
    );
  };

  // Divide vehicles into RSU regions (example logic, adjust if needed)
  const road1Vehicles = Object.values(vehicles).filter(
    (vehicle) => vehicle.position[1] <= 500
  );
  const road2Vehicles = Object.values(vehicles).filter(
    (vehicle) => vehicle.position[1] > 500
  );

  return (
    <div className="app">
      <div className="road-container">
        <div className="road">
          <h2>Road-1</h2>
          <div className="vehicles">
            {road1Vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.vehicleID} vehicle={vehicle} />
            ))}
          </div>
        </div>
        <div className="road">
          <h2>Road-2</h2>
          <div className="vehicles">
            {road2Vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.vehicleID} vehicle={vehicle} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
