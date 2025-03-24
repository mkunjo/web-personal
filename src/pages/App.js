import React from 'react';
import Navbar from '../components/Navbar';
import MainContent from '../components/MainContent';
import Footer from '../components/Footer';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GalleryPage from "./GalleryPage";
import FlightLog from '../components/FlightLog';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/FlightLog" element={<FlightLog />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
