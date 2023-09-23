"use client";

import dynamic from "next/dynamic";
import React from "react";

import { Scene } from "@babylonjs/core/scene.js";

// import OverlayElements from "./components/3d/OverlayElements/OverlayElements.tsx";
// import Joystick from "./components/3d/OverlayElements/Joystick/Joystick.tsx";
// import CoreEngine from "./components/3d/Core/CoreEngine.tsx";
import CoreScene from "./components/3d/Core/CoreScene.ts";
import { useStore } from "./utils/store.ts";

const Joystick = dynamic(
  () => import("./components/3d/OverlayElements/Joystick/Joystick.tsx"),
  { ssr: false }
);
const CoreEngine = dynamic(
  () => import("./components/3d/Core/CoreEngine.tsx"),
  { ssr: false }
);
const OverlayElements = dynamic(
  () => import("./components/3d/OverlayElements/OverlayElements.tsx"),
  { ssr: false }
);

// const onRender = (scene: Scene) => { };

export default function Home(): React.JSX.Element {
  const setCoreScene = useStore((state) => state.setCoreScene);

  const onSceneReady = (scene: Scene) => {
    setCoreScene(new CoreScene(scene));
  };

  return (
    <>
      <Joystick />
      <OverlayElements />
      <CoreEngine
        antialias
        id="babylon-canvas"
        onSceneReady={onSceneReady}
      // onRender={onRender}
      />
    </>
  );
}
