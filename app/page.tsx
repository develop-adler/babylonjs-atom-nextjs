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
import Image from "next/image";

const CoreEngine = dynamic(
  () => import("./components/3d/Core/CoreEngine.tsx"),
  { ssr: false }
);
const Joystick = dynamic(
  () => import("./components/3d/OverlayElements/Joystick/Joystick.tsx"),
  { ssr: false }
);
const OverlayElements = dynamic(
  () => import("./components/3d/OverlayElements/OverlayElements.tsx"),
  { ssr: false }
);

// const AdlerOverlay = styled.div`
//   display: flex;
//   position: absolute;
//   top: 0;
//   left: 50%;
//   transform: translateX(-50%);
//   width: 80%;
//   max-width: 70rem;
//   height: 100%;
//   background-color: #000;
// `;

// const LeftSidebarContainer = styled.div`
//   flex-grow: 1;
//   max-width: 20rem;

//   @media screen and (max-width: 768px) {
//     flex-grow: 0;
//     width: 2rem;
//     max-width: 0;
//   }
// `;

// const HomeButton = styled.button`
//   background: none;
//   border: none;
//   border-radius: 2rem;
//   color: #fff;
//   margin-bottom: 1rem;
//   cursor: pointer;
//   padding: 1rem;
//   transition: all 0.2s ease-in-out;

//   &:hover {
//     background: #fc4f9120;
//   }

//   @media screen and (max-width: 768px) {
//     flex-grow: 0;
//     width: 5rem;
//     max-width: 0;
//   }
// `;

// const SidebarButton = styled.button`
//   display: block;
//   border: none;
//   border-radius: 2rem;
//   color: #fff;
//   font-size: 18px;
//   margin-bottom: 1rem;
//   cursor: pointer;
//   text-align: left;
//   padding: 1rem 3rem;
//   text-decoration: none;
//   background: none;
//   transition: all 0.2s ease-in-out;

//   &:hover {
//     background: #fc4f9170;
//   }
// `;

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
      />
    </>
    // <AdlerOverlay>
    //   <LeftSidebarContainer>
    //     <HomeButton>
    //       <Image
    //         priority
    //         width={100}
    //         height={29}
    //         src="/Adler_Logo_L.svg"
    //         alt="Adler icon"
    //       />
    //     </HomeButton>
    //     <SidebarButton>Home</SidebarButton>
    //     <SidebarButton>Explore</SidebarButton>
    //     <SidebarButton>Notifications</SidebarButton>
    //     <SidebarButton>Bookmarks</SidebarButton>
    //     {/* Add more buttons as needed */}
    //   </LeftSidebarContainer>
    //   <AdlerFeed
    //     posts={[
    //       {
    //         author: "Yurica",
    //         content: (
    //           <>
    //             <CoreEngine
    //               antialias
    //               id="babylon-canvas"
    //               onSceneReady={onSceneReady}
    //             />
    //           </>
    //         ),
    //       },
    //       {
    //         author: "Master Yang",
    //         content: (
    //           <>
    //             <CoreEngine
    //               antialias
    //               id="babylon-canvas"
    //               onSceneReady={onSceneReady}
    //             />
    //           </>
    //         ),
    //       },
    //       {
    //         author: "Bereket",
    //         content: (
    //           <>
    //             <CoreEngine
    //               antialias
    //               id="babylon-canvas"
    //               onSceneReady={onSceneReady}
    //             />
    //           </>
    //         ),
    //       },
    //       {
    //         author: "Meemee",
    //         content: (
    //           <>
    //             <CoreEngine
    //               antialias
    //               id="babylon-canvas"
    //               onSceneReady={onSceneReady}
    //             />
    //           </>
    //         ),
    //       },
    //     ]}
    //   />
    // </AdlerOverlay>
  );
}
