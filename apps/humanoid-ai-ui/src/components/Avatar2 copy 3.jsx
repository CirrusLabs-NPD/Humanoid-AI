import React, { useEffect, useRef, useState } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { button, useControls } from 'leva';
import * as THREE from 'three';
import { useChat } from '../hooks/useChat';

const facialExpressions = {
  default: {},
  smile: {
    Brow_Raise_Inner_Left: 0.500,
    Brow_Raise_Inner_Right: 0.500,
    Brow_Raise_Outer_Left: 0.500,
    Brow_Raise_Outer_Right: 0.500,
    Mouth_Smile_L: 0.650,
    Mouth_Smile_R: 0.300,
    Mouth_Widen_Sides: 0.300,
    Mouth_Dimple_L: 1.000,
    Mouth_Dimple_R: 1.000,
  },
  funnyFace: {
    Brow_Raise_Inner_Left: 0.500,
    Brow_Raise_Inner_Right: 0.500,
    Brow_Raise_Outer_Left: 0.500,
    Brow_Raise_Outer_Right: 0.500,
    Brow_Drop_Left: 0.500,
    Brow_Drop_Right: 0.500,
    Eyes_Blink: 0.300,
    Eye_Wide_L: 0.400,
    Eye_Wide_R: 0.400,
    Nose_Scrunch: 0.400,
    Nose_Flanks_Raise: 0.300,
    Nose_Nostrils_Flare: 0.300,
    Cheek_Raise_L: 0.500,
    Cheek_Raise_R: 0.500,
    Mouth_Smile: 0.635,
    Mouth_Dimple_L: 1.000,
    Mouth_Dimple_R: 0.400,
    Mouth_Top_Lip_Up: 0.689,
    Mouth_Top_Lip_Under: 0.088,
    Mouth_Snarl_Lower_L: 0.500,
    Mouth_Snarl_Lower_R: 0.277,
    Mouth_Bottom_Lip_Bite: 0.716,
    Mouth_Lips_Jaw_Adjust: 0.541,
    Mouth_Bottom_Lip_Trans: 0.054,
    A01_Brow_Inner_Up: 0.500,
    A20_Cheek_Puff: 0.500,
    A26_Jaw_Forward: 0.500,
    A29_Mouth_Funnel: 0.200,
    Teen_Open_Upper: 0.300,
    Teen_Open_Lower: 0.200,
  },
  sad: {
    Brow_Drop_Left: 0.500,
    Brow_Drop_Right: 0.500,
    Eye_Blink_L: 0.200,
    Eye_Blink_R: 0.200,
    Eye_Wide_L: 0.400,
    Eye_Wide_R: 0.400,
    Mouth_Frown: 1.000,
    A01_Brow_Inner_Up: 0.500,
    A20_Cheek_Puff: 0.500,
    A40_Mouth_Frown_Left: 0.350,
    A41_Mouth_Frown_Right: 0.350,
  },
  surprised: {
    Eye_Wide_L: 0.394,
    Eye_Wide_R: 0.288,
    Nose_Flanks_Raise: 0.652,
    Cheeks_Raise_L: 1.000,
    Cheeks_Raise_R: 1.000,
    Cheek_Blow_L: 0.379,
    Cheek_Blow_R: 0.621,
    Mouth_Pucker_Open: 1.000,
    Mouth_Widen: 0.833,
    Mouth_Widen_Sides: 0.697,
    Mouth_Snarl_Upper_L: 0.667,
    Mouth_Snarl_Upper_R: 0.576,
    Mouth_Open: 0.348,
    Move_Jaw_Down: 1.000,
    A01_Brow_Inner_Up: 1.000,
    A04_Brow_Outer_Up_Left: 1.000,
    A05_Brow_Outer_Up_Right: 1.000,
    Teeth_Open_Upper: 0.300,
    Teeth_Open_Lower: 0.973,
  },
};

const corresponding = {
  A: 'Viseme_PP',
  B: 'Viseme_KK',
  C: 'Viseme_I',
  D: 'Viseme_AA',
  E: 'Viseme_O',
  F: 'Viseme_U',
  G: 'Viseme_FF',
  H: 'Viseme_TH',
  X: 'Viseme_PP',
};

let setupMode = false;

export default function Avatar2(props) {
  const { nodes, materials, scene } = useGLTF('/model2/Daven_v3.2.gltf');

  const { message, onMessagePlayed, chat } = useChat();

  const [lipsync, setLipsync] = useState();
  const [audio, setAudio] = useState();

  useEffect(() => {
    if (message) {
      
      console.log("PReceived message:", message);
      console.log("PLipsync data:", message.lipsync);  
      // Set the facial expression and animation from the message
      setAnimation(message.animation || "Idle");
      setFacialExpression(message.facialExpression || "default");
      
      // Play the corresponding audio file
      const audioFile = new Audio("data:audio/mp3;base64," + message.audio);
      setAudio(audioFile);
      audioFile.play();
      
      // Handle lipsync data from the message
      setLipsync(message.lipsync);

      // Trigger onMessagePlayed when the audio ends
      audioFile.onended = onMessagePlayed;
    }
  }, [message]);

  const { animations } = useGLTF('/model2/animations.glb');

  const group = useRef();
  const { actions, mixer } = useAnimations(animations, group);
  const [animation, setAnimation] = useState(
    animations.find((a) => a.name === "Idle") ? "Idle" : animations[0].name
  );

  useEffect(() => {
    actions[animation]
      .reset()
      .fadeIn(mixer.stats.actions.inUse === 0 ? 0 : 0.5)
      .play();
    return () => actions[animation].fadeOut(0.5);
  }, [animation, actions]);

  const lerpMorphTarget = (target, value, speed = 0.1) => {
    scene.traverse((child) => {
      if (child.isSkinnedMesh && child.morphTargetDictionary) {
        const index = child.morphTargetDictionary[target];
        if (
          index === undefined ||
          child.morphTargetInfluences[index] === undefined
        ) {
          return;
        }
        child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
          child.morphTargetInfluences[index],
          value,
          speed
        );

        if (!setupMode) {
          try {
            set({
              [target]: value,
            });
          } catch (e) {}
        }
      }
    });
  };

  const [blink, setBlink] = useState(false);
  const [winkLeft, setWinkLeft] = useState(false);
  const [winkRight, setWinkRight] = useState(false);
  const [facialExpression, setFacialExpression] = useState("");

  useFrame(() => {
    if (!setupMode) {
      Object.keys(nodes.Male_Bushy_2.morphTargetDictionary).forEach((key) => {
        const mapping = facialExpressions[facialExpression];
        if (key === "Eye_Blink_L" || key === "Eye_Blink_R") {
          return; // eyes wink/blink are handled separately
        }
        if (mapping && mapping[key]) {
          lerpMorphTarget(key, mapping[key], 0.1);
        } else {
          lerpMorphTarget(key, 0, 0.1);
        }
      });

      lerpMorphTarget("Eye_Blink_L", blink || winkLeft ? 1 : 0, 0.5);
      lerpMorphTarget("Eye_Blink_R", blink || winkRight ? 1 : 0, 0.5);

      // LIPSYNC
      const appliedMorphTargets = [];
      if (lipsync && audio) {
        const currentAudioTime = audio.currentTime;
        
        lipsync.mouthCues.forEach((mouthCue) => {
          const targetShape = corresponding[mouthCue.value];
          const targetIndex = nodes.Male_Bushy_2.morphTargetDictionary[targetShape];
          
          if (currentAudioTime >= mouthCue.start && currentAudioTime <= mouthCue.end) {
            if (targetIndex !== undefined) {
              appliedMorphTargets.push(targetShape);
              nodes.Male_Bushy_2.morphTargetInfluences[targetIndex] = 0.71;
            } else {
              console.warn(`Shape key ${targetShape} not found in model.`);
            }
          }
        });
      }
    }
  });

  // useControls("FacialExpressions", {
  //   chat: button(() => chat()),
  //   winkLeft: button(() => {
  //     setWinkLeft(true);
  //     setTimeout(() => setWinkLeft(false), 300);
  //   }),
  //   winkRight: button(() => {
  //     setWinkRight(true);
  //     setTimeout(() => setWinkRight(false), 300);
  //   }),
  //   animation: {
  //     value: animation,
  //     options: animations.map((a) => a.name),
  //     onChange: (value) => setAnimation(value),
  //   },
  //   facialExpression: {
  //     options: Object.keys(facialExpressions),
  //     onChange: (value) => setFacialExpression(value),
  //   },
  //   enableSetupMode: button(() => {
  //     setupMode = true;
  //   }),
  //   disableSetupMode: button(() => {
  //     setupMode = false;
  //   }), // Corrected closing parenthesis
  //   logMorphTargetValues: button(() => {
  //     const emotionValues = {};
  //     Object.keys(nodes.Male_Bushy_2.morphTargetDictionary).forEach((key) => {
  //       if (key === "Eye_Blink_L" || key === "Eye_Blink_R") {
  //         return; // eyes wink/blink are handled separately
  //       }
  //       const value =
  //         nodes.Male_Bushy_2.morphTargetInfluences[
  //           nodes.Male_Bushy_2.morphTargetDictionary[key]
  //         ];
  //       if (value > 0.01) {
  //         emotionValues[key] = value;
  //       }
  //     });
  //     console.log(JSON.stringify(emotionValues, null, 2));
  //   }),
  // });
  
  // const [, set] = useControls("MorphTarget", () =>
  //   Object.assign(
  //     {},
  //     ...Object.keys(nodes.Male_Bushy_2.morphTargetDictionary).map((key) => {
  //       return {
  //         [key]: {
  //           label: key,
  //           value: 0,
  //           min: nodes.Male_Bushy_2.morphTargetInfluences[
  //             nodes.Male_Bushy_2.morphTargetDictionary[key]
  //           ],
  //           max: 1,
  //           onChange: (val) => {
  //             if (setupMode) {
  //               lerpMorphTarget(key, val, 1);
  //             }
  //           },
  //         },
  //       };
  //     })
  //   )
  // );

  useEffect(() => {
    let blinkTimeout;
    const nextBlink = () => {
      blinkTimeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          nextBlink();
        }, 200);
      }, THREE.MathUtils.randInt(1000, 5000));
    };
    nextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

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
      {/* <PerspectiveCamera makeDefault={false} far={999.99} near={0} fov={14.426} position={[-0.098, 1.853, 5.516]} rotation={[0.037, -0.004, 0]} scale={0.01} /> */}
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


