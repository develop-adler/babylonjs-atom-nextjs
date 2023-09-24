"use client";

import dynamic from "next/dynamic";
import React from "react";

import { Scene } from "@babylonjs/core/scene.js";

// import OverlayElements from "./components/3d/OverlayElements/OverlayElements.tsx";
// import Joystick from "./components/3d/OverlayElements/Joystick/Joystick.tsx";
// import CoreEngine from "./components/3d/Core/CoreEngine.tsx";
import CoreScene from "./components/3d/Core/CoreScene.ts";
import { useStore } from "./utils/store.ts";
import AdlerFeed from "./components/feed/AdlerFeed.tsx";
import styled from "styled-components";

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

const AdlerOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #000;

  /* width */
  &::-webkit-scrollbar {
    width: 8%;
  }
  /* Track */
  &::-webkit-scrollbar-track {
    background: none;
  }
  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #3b3b3b;
    border-radius: 5px;
  }
  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #424242;
  }
`;

export default function Home(): React.JSX.Element {
  const setCoreScene = useStore((state) => state.setCoreScene);

  const onSceneReady = (scene: Scene) => {
    setCoreScene(new CoreScene(scene));
  };

  return (
    <AdlerOverlay>
      <AdlerFeed
        posts={[
          {
            author: "Yurica", content: (
              <>
                {/* <Joystick />
                <OverlayElements /> */}
                <CoreEngine
                  antialias
                  id="babylon-canvas"
                  onSceneReady={onSceneReady}
                >
                  <div>aaaaaaaaaaaaaaaaaaaaaa</div>
                </CoreEngine>
              </>
            )
          },
          {
            author: "Master Yang",
            content: (
              <>
                {/* <Joystick />
                <OverlayElements /> */}
                <CoreEngine
                  antialias
                  id="babylon-canvas"
                  onSceneReady={onSceneReady}
                />
              </>
            ),
          },
          {
            author: "Bereket",
            content: (
              <>
                <CoreEngine
                  antialias
                  id="babylon-canvas"
                  onSceneReady={onSceneReady}
                />
              </>
            ),
          },
          {
            author: "Meemee",
            content: (
              <>
                <CoreEngine
                  antialias
                  id="babylon-canvas"
                  onSceneReady={onSceneReady}
                />
              </>
            ),
          },
        ]}
      />
    </AdlerOverlay>
  );
}
