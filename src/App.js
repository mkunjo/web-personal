import React from 'react';
import Navbar from './components/Navbar';
import MainContent from './components/MainContent';
import Footer from './components/Footer';

const App = () => {
  return (
    <div className="App">
      <Navbar />
      <MainContent />
      <Footer />
    </div>
  );
};

export default App;
