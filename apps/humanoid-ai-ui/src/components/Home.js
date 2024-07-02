import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <nav className="navbar">
        <div className="navbar-brand">cirruslabs</div>
        <ul className="navbar-nav">
          <li><a href="/">Solutions</a></li>
          <li><a href="/">Services</a></li>
          <li><a href="/">Resources</a></li>
          <li><a href="/">Company</a></li>
        </ul>
        <div className="navbar-contact">
          <span>CALL US: (877)431-0767 | INDIA | CANADA | MIDDLE EAST | USA</span>
        </div>
      </nav>
      <header className="hero">
        <div className="hero-content">
          <h1>Digital Transformation, <span className="highlight">Simplified</span></h1>
          <p>Are you ready to step into a world of transformation? Let's embark on a journey that's as human as it is inspiring. Your journey is our journey.</p>
          <button className="learn-more-btn">Learn more</button>
        </div>
        <div className="hero-image">
          <img src="/path-to-your-image.png" alt="Hero" />
        </div>
      </header>
      <div className="chat-button">
        <button>Chat with Sonya</button>
      </div>
    </div>
  );
}

export default Home;
