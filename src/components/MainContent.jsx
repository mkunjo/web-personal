import React from 'react';
import '../styles/index.css'; 

const MainContent = () => {
  return (
    <main>
      {/* Profile Section */}
      <section id="profile" className="profile-section">
        <div className="landing">
          <h1>Hi, I'm Muhammad</h1>
          <img src="/assets/images/creator.png" alt="Profile pic" />
        </div>
        <hr />
        <h2 className="programmer">
          a <span className="pro">pro</span>grammar
        </h2>
        <table className="intro" cellSpacing="20">
          <tbody>
            <tr>
              <td>
              <img src="/assets/images/landing.png" alt="Landing Page" width="600" />
              </td>
            </tr>
            <tr>
              <td>
                <p>
                  <em>Portfolio Site for <strong>MK</strong>.</em>
                </p>
                <a href="https://github.com/mkunjo">Github</a>
                <a href="#/contact-me">Contact Me</a>
              </td>
            </tr>
          </tbody>
        </table>
        <hr />
      </section>

      {/* Courses Section */}
      <section id="courses" className="courses-section">
        <h3 className="section-heading">Relevant Courses:</h3>
        <img className="icon" src="/assets/images/courses-icon.png" alt="Relevant Courses Icon" />
        <ul className="list-title">
          <li><strong>Georgia State University:</strong></li>
          <ul className="rel-courses list">
            <li>Data Structures</li>
            <li>Software Engineering</li>
            <li>Mathematical modeling for Computer Science</li>
            <li>Algorithms & Analysis</li>
            <li>Machine Learning</li>
            <li>Data Visualization</li>
            <li>Computer Architecture</li>
          </ul>
        </ul>
        <hr />
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects-section">
        <h3 className="section-heading">Projects:</h3>
        <img className="icon" src="/assets/images/programming-icon.png" alt="Projects Icon" />
        <table className="projects">
          <thead>
            <tr>
              <th>Dates</th>
              <th>Project</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2018</td>
              <td>Android App Development Features Showcase</td>
              <td><a href="https://github.com/mkunjo/summer2018">Github</a></td>
            </tr>
            <tr>
              <td>2019</td>
              <td>Coffee Ordering Android Application</td>
              <td><a href="https://github.com/mkunjo/Covfefe">Github</a></td>
            </tr>
            <tr>
              <td>2021</td>
              <td>Python Encrypted Password Manager</td>
              <td><a href="https://github.com/mkunjo/cryptPassManager">Github</a></td>
            </tr>
          </tbody>
        </table>
        <hr />
      </section>

      {/* Hobbies Section */}
      <section id="hobbies" className="hobbies-section">
    <div className="hobby">
        <h2>My Hobbies</h2>
        <div className="hobby-row hobby-odd">
            <img className="hobby-icon" src="/assets/images/camera.png" alt="Film Camera Icon"/>
            <div className="hobby-text">
                <h3>Film Photography</h3>
                <p>Film fanatic and amateur photographer. Currently shooting on 35mm film with a 1980 Nikon F3.
                    I'm happy to share my work and have made several albums available on my <a href="#/Gallery">gallery</a> page!</p>
            </div>
        </div>
        <div className="hobby-row hobby-even">
            <img className="hobby-icon" src="/assets/images/plane.png" alt="Aircraft Icon"/>
            <div className="hobby-text">
                <h3>Aircraft Pilot</h3>
                <p>Currently a student pilot with 10 hours of flight time flying primarily Piper Cherokee Aircrafts.
                    Proficient in: Takeoffs, Landings, Climb, Straight & level flight, Slow flight,
                    Power off stalls, Steep turning, & Radio calls. Currently preparing for first solo-flight!
                    I keep track of each flight on the <a href='#/FlightLog'>Flight Log</a> page! </p>
            </div>
        </div>
    </div>
</section>
      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="contact-me">
          <hr className="footer" />
          <h2>Get In Touch</h2>
          <a className="btn" href="contact-me.html">CONTACT ME</a>
        </div>
      </section>
    </main>
  );
};

export default MainContent;
