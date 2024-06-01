import {
  OrbitControls,
  TransformControls,
  PivotControls,
  MeshReflectorMaterial,
  Html,
  Text,
  Text3D,
  Float,
} from "@react-three/drei";
// import OpenSansSemiBold from "./os-sb.json";
import OpenSansExtraBold from "./os-eb.json";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Experience() {
  const cube = useRef();
  const sphere = useRef();

  useFrame(() => {
    cube.current.rotation.x = cube.current.rotation.y += 0.01;
  });

  return (
    <>
      <OrbitControls makeDefault />

      <directionalLight castShadow position={[10, 10, 10]} intensity={2.5} />
      <ambientLight intensity={0.5} />

      {/* <PivotControls
        anchor={[0, 0, 0]}
        depthTest={false}
        scale={50}
        fixed={true}
      > */}
      <mesh ref={sphere} position={[-5, 1, -3]} castShadow>
        <sphereGeometry />
        <meshStandardMaterial color="orange" />

        <Html
          position={[1, 1, 0]}
          wrapperClass="label"
          center
          distanceFactor={6}
          occlude={[sphere, cube]}
        >
          Test
        </Html>
      </mesh>
      {/* </PivotControls> */}

      <mesh ref={cube} position={[7, 1, 4]} scale={1.5} castShadow>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>
      {/* <TransformControls object={cube} mode="translate" /> */}

      <mesh
        position-y={-1}
        rotation-x={-Math.PI * 0.5}
        scale={40}
        receiveShadow
      >
        <planeGeometry />
        <MeshReflectorMaterial
          resolution={1024}
          blur={[1000, 1000]}
          mixBlur={1}
          mirror={0.75}
          //  mixBlur={5}
          color="greenyellow"
        />
      </mesh>

      <Float
        speed={2}
        floatIntensity={1.5}
        rotationIntensity={1}
        floatingRange={[0, 1]}
      >
        <Text
          position-y={3.5}
          font="./os-reg.woff"
          fontSize={0.5}
          color="black"
          textAlign="center"
          maxWidth={10}
        >
          Yes, I know there should be an apostrophe on "Luke's". But, it
          wouldn't stay up; cause gravity innit.
        </Text>
      </Float>

      <Text3D
        font={OpenSansExtraBold}
        height={0.3}
        size={1.2}
        position={[-4.5, -1, 4]}
        rotation-y={Math.PI * 0.25}
        castShadow
      >
        Lukes Canvas
        <meshStandardMaterial color="white" />
      </Text3D>
    </>
  );
}
