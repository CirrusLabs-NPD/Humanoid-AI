import React from 'react';
import { Canvas } from '@react-three/fiber';
import Home from '../components/Home';
import './app.css';
import Experience from '../components/Experience';

function App() {
  return (
    <div className="App">
      <Home />
      <Canvas shadows camera={{ position: [0, 0, 8], fov: 10 }}>
        <color attach="background" args={['#ececec']} />
        <Experience />
      </Canvas>
    </div>
  );
}

export default App;

// import React from 'react';
// import Home from '../components/Home';
// import './app.css';
// import { Experience } from '../components/Experience';

// function App() {
//   return (
//     <div className="App">
//       <Home />
//     </div>
//   );
// }

// export default App;

//import { Canvas } from '@react-three/fiber';
// import { Experience } from '../components/Experience';

// function App() {
//   return (
//     <Canvas shadows camera={{ position: [3, 3, 3], fov: 30 }}>
//       <color attach="background" args={['#ececec']} />
//       <Experience />
//     </Canvas>
//   );
// }

// export default App;
