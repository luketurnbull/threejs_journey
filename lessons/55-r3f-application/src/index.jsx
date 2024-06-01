import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import { ACESFilmicToneMapping } from "three";
import { StrictMode } from "react";

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
  <StrictMode>
    <Canvas
      gl={{
        antialias: true,
        toneMapping: ACESFilmicToneMapping,
        //   outputColorSpace: "srgb",
      }}
      shadows
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [7, 3, 15],
      }}
    >
      <Experience />
    </Canvas>
  </StrictMode>
);
