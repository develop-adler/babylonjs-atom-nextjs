import React, { useEffect, useRef } from "react";
import { Engine } from "@babylonjs/core/Engines/engine.js";
import { EngineOptions } from "@babylonjs/core/Engines/thinEngine.js";
import { Scene, SceneOptions } from "@babylonjs/core/scene.js";
import { Nullable } from "@babylonjs/core/types.js";
import styled from "styled-components";
import { useStore } from "@/app/utils/store";

const Canvas = styled.canvas`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  overflow: hidden;
  border-radius: 0.2rem;
`;

const CanvasChildren = styled.div`
  z-index: 2;
`;

export type BabylonjsProps = {
  antialias?: boolean;
  engineOptions?: EngineOptions;
  adaptToDeviceRatio?: boolean;
  renderChildrenWhenReady?: boolean;
  sceneOptions?: SceneOptions;
  onSceneReady?: (scene: Scene) => void;
  /**
   * Automatically trigger engine resize when the canvas resizes (default: true)
   */
  observeCanvasResize?: boolean;
  onRender?: (scene: Scene) => void;
  children?: React.ReactNode;
};

const CoreEngine = (
  props: BabylonjsProps & React.CanvasHTMLAttributes<HTMLCanvasElement>
) => {
  const {
    antialias,
    engineOptions,
    adaptToDeviceRatio,
    sceneOptions,
    onRender,
    onSceneReady,
    renderChildrenWhenReady,
    children,
    ...rest
  } = props;

  const reactCanvas = useRef<Nullable<HTMLCanvasElement>>(null);
  const engineRef = useRef<Nullable<Engine>>(null);

  const setCore = useStore((state) => state.setCore);

  useEffect(() => {
    if (reactCanvas.current && !engineRef.current) {
      engineRef.current = new Engine(
        reactCanvas.current,
        antialias,
        engineOptions,
        adaptToDeviceRatio
      );

      let resizeObserver: Nullable<ResizeObserver> = null;

      const scene = new Scene(engineRef.current, sceneOptions);

      if (props.observeCanvasResize !== false && window.ResizeObserver) {
        resizeObserver = new ResizeObserver(() => {
          engineRef.current!.resize();
          if (scene.activeCamera /* needed for rendering */) {
            // render to prevent flickering on resize
            if (typeof onRender === "function") onRender(scene);
            scene.render();
          }
        });
        resizeObserver.observe(reactCanvas.current);
      }

      const sceneIsReady = scene.isReady();
      if (sceneIsReady) {
        setCore({
          canvas: reactCanvas.current,
          engine: engineRef.current,
          scene: scene,
        });
        if (typeof onSceneReady === "function") onSceneReady(scene);
      } else {
        scene.onReadyObservable.addOnce((scene) => {
          setCore({
            canvas: reactCanvas.current,
            engine: engineRef.current,
            scene: scene,
          });
          if (typeof onSceneReady === "function") onSceneReady(scene);
        });
      }

      engineRef.current.runRenderLoop(() => {
        if (scene.activeCamera) {
          if (typeof onRender === "function") onRender(scene);
          scene.render();
        } else {
          // @babylonjs/core throws an error if you attempt to render with no active camera.
          // if we attach as a child React component we have frames with no active camera.
          console.warn("No active camera..");
        }
      });

      const resize = () => {
        engineRef.current!.resize();
      };

      if (window) {
        window.addEventListener("resize", resize);
      }

      return () => {
        // cleanup
        if (resizeObserver !== null) {
          resizeObserver.disconnect();
        }

        if (window) {
          window.removeEventListener("resize", resize);
        }

        engineRef.current!.dispose();

        setCore({
          canvas: null,
          engine: null,
          scene: null,
        });
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Canvas ref={reactCanvas} {...rest}>
      <CanvasChildren>
        {children}
      </CanvasChildren>
    </Canvas>
  );
};

export default CoreEngine;
