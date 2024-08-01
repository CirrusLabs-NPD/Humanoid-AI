import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useGraph } from '@react-three/fiber';
import { useAnimations, useFBX, useGLTF, PerspectiveCamera } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import { useFrame, useLoader } from '@react-three/fiber';
import { useControls } from 'leva';
import * as THREE from 'three';

const corresponding = {
  A: 'Viseme_PP',
  B: 'Viseme_kk',
  C: 'Viseme_I',
  D: 'Viseme_AA',
  E: 'Viseme_O',
  F: 'Viseme_U',
  G: 'Viseme_FF',
  H: 'Viseme_TH',
  X: 'Viseme_PP',
};

export default function Avatar2(props) {
  const { playAudio, script } = useControls({
    playAudio: false,
    script: {
      value: 'cirrusai',
      options: ['cirrusai'],
    },
  });
  const audio = useMemo(() => new Audio(`/audios/${script}.ogg`), [script]);
  const jsonFile = useLoader(THREE.FileLoader, `audios/${script}.json`);
  const lipsync = JSON.parse(jsonFile);

  useFrame(() => {
    const currentAudioTime = audio.currentTime;
    Object.values(corresponding).forEach((value) => {
      nodes.Male_Bushy_2.morphTargetInfluences[nodes.Male_Bushy_2.morphTargetDictionary[value]] = 0;
    });

    for (let i = 0; i < lipsync.mouthCues.length; i++) {
      const mouthCue = lipsync.mouthCues[i];
      if (currentAudioTime >= mouthCue.start && currentAudioTime <= mouthCue.end) {
        nodes.Male_Bushy_2.morphTargetInfluences[nodes.Male_Bushy_2.morphTargetDictionary[corresponding[mouthCue.value]]] = 1;
      }
    }
  });

  useEffect(() => {
    if (playAudio) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [playAudio, script]);

  const { scene } = useGLTF('/model2/Daven_v3.2.gltf');
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);

  const { animations: idleAnimation } = useFBX('/animations/Idle.fbx');
  idleAnimation[0].name = 'Idle';

  const group = useRef();

  const { actions } = useAnimations([idleAnimation[0]], group);
  const [animation, setAnimation] = useState('Idle');

  useEffect(() => {
    actions[animation]?.reset().fadeIn(0.5).play();
    return () => actions[animation]?.fadeOut(0.5);
  }, [animation, actions]);

  useEffect(() => {
    console.log(nodes.Male_Bushy_2.morphTargetDictionary);
    nodes.Male_Bushy_2.morphTargetInfluences[nodes.Male_Bushy_2.morphTargetDictionary['Teeth_Open_Upper&Lower']] = 1;
  });

  useEffect(() => {
    console.log(`Current animation: ${animation}`);
  }, [animation]);


  return (
    <group {...props} dispose={null} ref={group}>
      <group scale={0.01}>
        <primitive object={nodes.CC_Base_BoneRoot} />
        <skinnedMesh name="Male_Bushy" geometry={nodes.Male_Bushy.geometry} material={materials.Male_Bushy_Transparency} skeleton={nodes.Male_Bushy.skeleton} morphTargetDictionary={nodes.Male_Bushy.morphTargetDictionary} morphTargetInfluences={nodes.Male_Bushy.morphTargetInfluences} />
        <skinnedMesh name="Male_Bushy_1" geometry={nodes.Male_Bushy_1.geometry} material={materials.Male_Bushy_Base_Transparency} skeleton={nodes.Male_Bushy_1.skeleton} morphTargetDictionary={nodes.Male_Bushy_1.morphTargetDictionary} morphTargetInfluences={nodes.Male_Bushy_1.morphTargetInfluences} />
        <skinnedMesh name="Male_Bushy_2" geometry={nodes.Male_Bushy_2.geometry} material={materials.Std_Skin_Head} skeleton={nodes.Male_Bushy_2.skeleton} morphTargetDictionary={nodes.Male_Bushy_2.morphTargetDictionary} morphTargetInfluences={nodes.Male_Bushy_2.morphTargetInfluences} />
        <skinnedMesh name="Male_Bushy_3" geometry={nodes.Male_Bushy_3.geometry} material={materials.Std_Skin_Body} skeleton={nodes.Male_Bushy_3.skeleton} morphTargetDictionary={nodes.Male_Bushy_3.morphTargetDictionary} morphTargetInfluences={nodes.Male_Bushy_3.morphTargetInfluences} />
        <skinnedMesh name="Male_Bushy_4" geometry={nodes.Male_Bushy_4.geometry} material={materials.Std_Skin_Arm} skeleton={nodes.Male_Bushy_4.skeleton} morphTargetDictionary={nodes.Male_Bushy_4.morphTargetDictionary} morphTargetInfluences={nodes.Male_Bushy_4.morphTargetInfluences} />
        <skinnedMesh name="Male_Bushy_5" geometry={nodes.Male_Bushy_5.geometry} material={materials.Std_Skin_Leg} skeleton={nodes.Male_Bushy_5.skeleton} morphTargetDictionary={nodes.Male_Bushy_5.morphTargetDictionary} morphTargetInfluences={nodes.Male_Bushy_5.morphTargetInfluences} />
        <skinnedMesh name="Male_Bushy_6" geometry={nodes.Male_Bushy_6.geometry} material={materials.Std_Nails} skeleton={nodes.Male_Bushy_6.skeleton} morphTargetDictionary={nodes.Male_Bushy_6.morphTargetDictionary} morphTargetInfluences={nodes.Male_Bushy_6.morphTargetInfluences} />
        {/* <skinnedMesh name="Male_Bushy_7" geometry={nodes.Male_Bushy_7.geometry} material={materials.Std_Eyelash} skeleton={nodes.Male_Bushy_7.skeleton} morphTargetDictionary={nodes.Male_Bushy_7.morphTargetDictionary} morphTargetInfluences={nodes.Male_Bushy_7.morphTargetInfluences} /> */}
        <skinnedMesh name="Male_Bushy_8" geometry={nodes.Male_Bushy_8.geometry} material={materials.Std_Tearline_R} skeleton={nodes.Male_Bushy_8.skeleton} morphTargetDictionary={nodes.Male_Bushy_8.morphTargetDictionary} morphTargetInfluences={nodes.Male_Bushy_8.morphTargetInfluences} />
        <skinnedMesh name="Male_Bushy_9" geometry={nodes.Male_Bushy_9.geometry} material={materials.Std_Tearline_L} skeleton={nodes.Male_Bushy_9.skeleton} morphTargetDictionary={nodes.Male_Bushy_9.morphTargetDictionary} morphTargetInfluences={nodes.Male_Bushy_9.morphTargetInfluences} />
        <skinnedMesh name="Male_Bushy_10" geometry={nodes.Male_Bushy_10.geometry} material={materials.Std_Upper_Teeth} skeleton={nodes.Male_Bushy_10.skeleton} morphTargetDictionary={nodes.Male_Bushy_10.morphTargetDictionary} morphTargetInfluences={nodes.Male_Bushy_10.morphTargetInfluences} />
        {/* <skinnedMesh name="Male_Bushy_11" geometry={nodes.Male_Bushy_11.geometry} material={materials.Std_Lower_Teeth} skeleton={nodes.Male_Bushy_11.skeleton} morphTargetDictionary={nodes.Male_Bushy_11.morphTargetDictionary} morphTargetInfluences={nodes.Male_Bushy_11.morphTargetInfluences} /> */}
        {/* <skinnedMesh name="Male_Bushy_12" geometry={nodes.Male_Bushy_12.geometry} material={materials.Std_Eye_Occlusion_R} skeleton={nodes.Male_Bushy_12.skeleton} morphTargetDictionary={nodes.Male_Bushy_12.morphTargetDictionary} morphTargetInfluences={nodes.Male_Bushy_12.morphTargetInfluences} /> */}
        {/* <skinnedMesh name="Male_Bushy_13" geometry={nodes.Male_Bushy_13.geometry} material={materials.Std_Eye_Occlusion_L} skeleton={nodes.Male_Bushy_13.skeleton} morphTargetDictionary={nodes.Male_Bushy_13.morphTargetDictionary} morphTargetInfluences={nodes.Male_Bushy_13.morphTargetInfluences} /> */}
        <skinnedMesh name="Male_Bushy_14" geometry={nodes.Male_Bushy_14.geometry} material={materials.Std_Tongue} skeleton={nodes.Male_Bushy_14.skeleton} morphTargetDictionary={nodes.Male_Bushy_14.morphTargetDictionary} morphTargetInfluences={nodes.Male_Bushy_14.morphTargetInfluences} />
        <skinnedMesh name="Male_Bushy_15" geometry={nodes.Male_Bushy_15.geometry} material={materials.Std_Eye_R} skeleton={nodes.Male_Bushy_15.skeleton} morphTargetDictionary={nodes.Male_Bushy_15.morphTargetDictionary} morphTargetInfluences={nodes.Male_Bushy_15.morphTargetInfluences} />
        <skinnedMesh name="Male_Bushy_16" geometry={nodes.Male_Bushy_16.geometry} material={materials.Std_Cornea_R} skeleton={nodes.Male_Bushy_16.skeleton} morphTargetDictionary={nodes.Male_Bushy_16.morphTargetDictionary} morphTargetInfluences={nodes.Male_Bushy_16.morphTargetInfluences} />
        <skinnedMesh name="Male_Bushy_17" geometry={nodes.Male_Bushy_17.geometry} material={materials.Std_Eye_L} skeleton={nodes.Male_Bushy_17.skeleton} morphTargetDictionary={nodes.Male_Bushy_17.morphTargetDictionary} morphTargetInfluences={nodes.Male_Bushy_17.morphTargetInfluences} />
        <skinnedMesh name="Male_Bushy_18" geometry={nodes.Male_Bushy_18.geometry} material={materials.Std_Cornea_L} skeleton={nodes.Male_Bushy_18.skeleton} morphTargetDictionary={nodes.Male_Bushy_18.morphTargetDictionary} morphTargetInfluences={nodes.Male_Bushy_18.morphTargetInfluences} />
      </group>
      <group scale={0.01}>
        <primitive object={nodes.CC_Base_BoneRoot_1} />
        <skinnedMesh name="Side_part_wavy_1" geometry={nodes.Side_part_wavy_1.geometry} material={materials.Scalp_Transparency} skeleton={nodes.Side_part_wavy_1.skeleton} morphTargetDictionary={nodes.Side_part_wavy_1.morphTargetDictionary} morphTargetInfluences={nodes.Side_part_wavy_1.morphTargetInfluences} />
        <skinnedMesh name="Side_part_wavy_2" geometry={nodes.Side_part_wavy_2.geometry} material={materials.Hair_Transparency} skeleton={nodes.Side_part_wavy_2.skeleton} morphTargetDictionary={nodes.Side_part_wavy_2.morphTargetDictionary} morphTargetInfluences={nodes.Side_part_wavy_2.morphTargetInfluences} />
      </group>
      <PerspectiveCamera makeDefault={false} far={999.99} near={0} fov={14.426} position={[-0.098, 1.853, 5.516]} rotation={[0.037, -0.004, 0]} scale={0.01} />
      <mesh geometry={nodes.Lighting_Setup_Generator.geometry} material={nodes.Lighting_Setup_Generator.material} />
      <mesh geometry={nodes.Boots.geometry} material={materials['Boots.001']} scale={0.01} />
      <group scale={0.01}>
        <mesh geometry={nodes.Layered_sweater_1.geometry} material={materials.Layered_sweater} />
        <mesh geometry={nodes.Layered_sweater_2.geometry} material={materials['Material.001']} />
      </group>
      <mesh geometry={nodes.Slim_Jeans.geometry} material={materials['Slim_Jeans.001']} scale={0.01} />
    </group>
  )
}

useGLTF.preload('/model2/Daven_v3.2.gltf')


