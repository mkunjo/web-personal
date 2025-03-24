import React from 'react';
import '../index.css'; 

const Navbar = () => {
  return (
    <nav class="navbar">
        <div class="nav-container">
            <a href="/" class="nav-logo">MK</a>
            <ul class="nav-links">
                <li><a href="/gallery">Photos</a></li>
                <li><a href="tech.html">Tech</a></li>
                <li><a href="/FlightLog">Pilot</a></li>
                <li><a href="contact-me.html" target="_blank">Contact Me</a></li>
            </ul>
        </div>
    </nav>
  );
};

export default Navbar;
