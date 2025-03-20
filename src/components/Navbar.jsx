import React from 'react';
import '../index.css'; 

const Navbar = () => {
  return (
    <nav class="navbar">
        <div class="nav-container">
            <a href="index.html" class="nav-logo">MK</a>
            <ul class="nav-links">
                <li><a href="" target="_blank">Photos</a></li>
                <li><a href="tech.html">Tech</a></li>
                <li><a href="pilot.html">Pilot</a></li>
                <li><a href="contact-me.html">Contact Me</a></li>
            </ul>
        </div>
    </nav>
  );
};

export default Navbar;
