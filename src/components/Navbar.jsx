import React from 'react';
import '../styles/index.css'; 

const Navbar = () => {
  return (
    <nav class="navbar">
        <div class="nav-container">
            <a href="/" class="nav-logo">MK</a>
            <ul class="nav-links">
                <li><a href="#/Gallery">Photos</a></li>
                <li><a href="#/Terminal">Tech</a></li>
                <li><a href="#/FlightLog">Pilot</a></li>
                <li><a href="#/contact-me">Contact Me</a></li>
            </ul>
        </div>
    </nav>
  );
};

export default Navbar;
