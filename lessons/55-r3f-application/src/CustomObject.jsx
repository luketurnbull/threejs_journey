import { useEffect, useMemo, useRef } from "react";
import { DoubleSide } from "three";

export default function CustomObject() {
  const geometryRef = useRef();
  const verticesCount = 10 * 3;

  const positions = useMemo(() => {
    const positionsArray = new Float32Array(verticesCount * 3);

    for (let i = 0; i < verticesCount * 3; i++) {
      positionsArray[i] = (Math.random() - 0.5) * 5;
    }

    return positionsArray;
  }, []);

  useEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.computeVertexNormals();
    }
  }, [geometryRef]);

  return (
    <mesh>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          count={verticesCount}
          itemSize={3}
          array={positions}
        />
      </bufferGeometry>
      <meshStandardMaterial color="hotpink" side={DoubleSide} />
    </mesh>
  );
}
