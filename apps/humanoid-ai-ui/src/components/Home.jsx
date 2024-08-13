import React, { useRef, Suspense, lazy } from "react";
import { useChat } from "../hooks/useChat";
import './Home.css';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Preload } from '@react-three/drei';

const Avatar2 = lazy(() => import('./Avatar2.jsx'));

export const Home = ({ hidden, ...props }) => {
  const input = useRef();
  const { chat, loading, cameraZoomed, setCameraZoomed, message } = useChat();

  const sendMessage = () => {
    const text = input.current.value;
    if (!loading && text.trim()) {
      chat(text);
      input.current.value = "";
    }
  };

  if (hidden) {
    return null;
  }

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
          <Suspense fallback={<div>Loading Avatar...</div>}>
            <Canvas>
              <ambientLight intensity={0.5} />
              <directionalLight position={[0, 0, 5]} intensity={1} />
              <Avatar2 position={[0, -45, -5]} scale={27} />
              <OrbitControls />
              <Environment preset="sunset" />
              <Preload all />
            </Canvas>
          </Suspense>
        </div>
        <button className="contact-us-btn">Contact us</button>
      </header>

      <section className="info-section">
        <h2>Who is CirrusLabs?</h2>
        <p>Our tagline, "Digital Transformation Simplified," isn't just a phrase; it's our commitment to making complex processes easy to understand and implement. Your journey is our journey, and together, we'll navigate the digital landscape, breaking down barriers and delivering results.</p>
        <button className="learn-more-btn">Learn more</button>
        <div className="info-media">
          <img src="/src/components/who.png" alt="Who is CirrusLabs?" />  {/* Update with correct image path */}
        </div>
      </section>

      <section className="solutions-section">
        <h2>Explore Our Solutions</h2>
        <p>Our expertise spans advanced AI applications to sophisticated SAP integrations to efficient GRC platforms and more. To fully understand how our solutions can benefit your business, we encourage you to watch our video overview. Dive deeper into our solutions and discover ways to accelerate your success.</p>
        <div className="solutions-media">
          <img src="/src/components/expert.png" alt="Explore Our Solutions" />  {/* Update with correct image path */}
        </div>
      </section>

      <div className="chat-input">
        <div className="flex items-center gap-2 pointer-events-auto max-w-screen-sm w-full mx-auto">
          <input
            className="w-full placeholder:text-gray-800 placeholder:italic p-4 rounded-md bg-opacity-50 bg-white backdrop-blur-md"
            placeholder="Type a message..."
            ref={input}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <button
            disabled={loading || !input.current?.value.trim()}
            onClick={sendMessage}
            className={`bg-pink-500 hover:bg-pink-600 text-white p-4 px-10 font-semibold uppercase rounded-md ${
              loading || !input.current?.value.trim() ? "cursor-not-allowed opacity-30" : ""
            }`}
          >
            Send
          </button>
        </div>
      </div>
      
      <div className="chat-button">
        <button>Chat with Sonya</button>
      </div>
    </div>
  );
}

export default Home;
