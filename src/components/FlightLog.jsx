import React from 'react';
import '../styles/index.css'; 

const FlightLog = () => {
  const [flightData] = React.useState([
    {
      date: "02/28/2025",
      aircraft: "N4307X Archer",
      route: "Private Pilot - Horizon Aviation: Flight 1 (Intro)",
      dualReceived: "1.7",
      picTime: "-",
      totalTime: "1.7",
      instructor: "Grant Popinga"
    },
    {
      date: "02/27/2025",
      aircraft: "N4307X Archer",
      route: "Private Pilot - Horizon Aviation: Flight 1 (Intro)",
      dualReceived: "0.7",
      picTime: "-",
      totalTime: "0.7",
      instructor: "Grant Popinga"
    },
    {
      date: "02/02/2025",
      aircraft: "N7394J Cherokee",
      route: "Private Pilot - Horizon Aviation: Flight 1 (Intro)",
      dualReceived: "1.3",
      picTime: "-",
      totalTime: "1.3",
      instructor: "Grant Popinga"
    },
    {
      date: "01/30/2025",
      aircraft: "N7394J Cherokee",
      route: "Private Pilot - Horizon Aviation: Flight 1 (Intro)",
      dualReceived: "1.4",
      picTime: "-",
      totalTime: "1.4",
      instructor: "Grant Popinga"
    },
    {
      date: "01/29/2025",
      aircraft: "N59EA Cherokee",
      route: "Private Pilot - Horizon Aviation: Flight 1 (Intro)",
      dualReceived: "1.3",
      picTime: "-",
      totalTime: "1.3",
      instructor: "Grant Popinga"
    },
    {
      date: "12/19/2024",
      aircraft: "N4307X Archer",
      route: "Maneuvers lesson and XC to 6A1",
      dualReceived: "2.0",
      picTime: "-",
      totalTime: "2.0",
      instructor: "Grant Popinga"
    },
    {
      date: "12/02/2024",
      aircraft: "N7394J Cherokee",
      route: "Private Pilot - Horizon Aviation: Flight 4 (Foundations)",
      dualReceived: "1.0",
      picTime: "-",
      totalTime: "1.0",
      instructor: "Grant Popinga"
    },
    {
      date: "10/06/2024",
      aircraft: "N7394J Cherokee",
      route: "Private Pilot - Horizon Aviation: Flight 5 (Intro to TOLs)",
      dualReceived: "1.2",
      picTime: "-",
      totalTime: "1.2",
      instructor: "Grant Popinga"
    },
    {
      date: "10/04/2024",
      aircraft: "N7394J Cherokee",
      route: "Private Pilot - Horizon Aviation: Flight 4 (Foundations)",
      dualReceived: "1.3",
      picTime: "-",
      totalTime: "1.3",
      instructor: "Grant Popinga"
    },
    {
      date: "08/25/2024",
      aircraft: "N1097T Cherokee",
      route: "Private Pilot - Horizon Aviation: Flight 1 (Intro) Local",
      dualReceived: "1.3",
      picTime: "-",
      totalTime: "1.3",
      instructor: "Grant Popinga"
    },
    {
      date: "08/21/2024",
      aircraft: "N7394J Cherokee",
      route: "Private Pilot - Horizon Aviation: Flight 2 (Foundations)",
      dualReceived: "1.0",
      picTime: "-",
      totalTime: "1.0",
      instructor: "Grant Popinga"
    },
    {
      date: "08/19/2024",
      aircraft: "N59EA Cherokee",
      route: "Private Pilot - Horizon Aviation: Flight 1 (Intro)",
      dualReceived: "0.5",
      picTime: "-",
      totalTime: "0.5",
      instructor: "Grant Popinga"
    }
  ]);

  const totalHours = flightData.reduce((acc, flight) => acc + parseFloat(flight.totalTime), 0).toFixed(1);
  const totalFlights = flightData.length;

  return (
    <div className="container">
      <header className="header">
        <h1>Flight Logbook</h1>
      </header>

      <div className="stats">
        <div className="stat-item">
          <h3>Total Hours:</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{totalHours}</p>
        </div>
        <div className="stat-item">
          <h3>Total Flights:</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{totalFlights}</p>
        </div>
      </div>

      <section>
        <h2>Flight Log Entries:</h2>
        
        <div className="flight-log">
          {flightData.map((flight, index) => (
            <div key={index} className="flight-entry">
              <div className="flight-date">{flight.date}</div>
              <div className="aircraft">Aircraft: {flight.aircraft}</div>
              <div className="route">Route: {flight.route}</div>
              <div className="instructor">Instructor: {flight.instructor}</div>
              <div className="dual-received">Dual Received: {flight.dualReceived}</div>
              <div className="pic-time">PIC Time: {flight.picTime}</div>
              <div className="total-time">Total Time: {flight.totalTime}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FlightLog;
