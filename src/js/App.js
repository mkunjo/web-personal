import React from 'react';
import Navbar from '../components/Navbar';
import MainContent from '../components/MainContent';
import Footer from '../components/Footer';
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Gallery from "../components/Gallery";
import FlightLog from '../components/FlightLog';
import Terminal from '../components/Terminal';
import Pomodoro from '../components/Pomodoro';
import PasswordGenerator from '../components/PasswordGenerator';
import DiffChecker from '../components/DiffChecker';
import Transcribe from '../components/Transcribe';


const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/Gallery" element={<Gallery />} />
          <Route path="/FlightLog" element={<FlightLog />} />
          <Route path="/Terminal" element={<Terminal />} />
          <Route path="/Pomodoro" element={<Pomodoro />} />
          <Route path="/PasswordGenerator" element={<PasswordGenerator />} />
          <Route path="/DiffChecker" element={<DiffChecker />} />
          <Route path="/Transcribe" element={<Transcribe />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
