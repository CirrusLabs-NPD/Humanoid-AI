// src/components/Experience.jsx
import {Environment, EnvironmentMap, OrbitControls } from "@react-three/drei";
import { Canvas } from '@react-three/fiber';
import Avatar2 from './Avatar2.jsx'; 

export const Experience = () => {
  return (
    <>
      <OrbitControls />
      <Avatar2 position = {[0,-8,-5]} scale ={3} />
      <Environment preset="sunset"/>
    </>
  );
};

export default Experience;