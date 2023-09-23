"use client";

import React from "react";

import { Scene } from "@babylonjs/core/scene.js";

import OverlayElements from "./components/3d/OverlayElements/OverlayElements.tsx";
import Joystick from "./components/3d/Joystick.tsx";
import CoreEngine from "./components/3d/Core/CoreEngine.tsx";
import CoreScene from "./components/3d/Core/CoreScene.ts";
import { useStore } from "./utils/store.ts";

// const onRender = (scene: Scene) => { };

export default function Home(): React.JSX.Element {
  const { setCoreScene } = useStore();

  const onSceneReady = (scene: Scene) => {
    const coreScene = new CoreScene(scene);
    setCoreScene(coreScene);
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
