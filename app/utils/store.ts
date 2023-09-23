import { create } from "zustand";
import { Engine } from "@babylonjs/core/Engines/engine.js";
import { Scene } from "@babylonjs/core/scene.js";
import { Nullable } from "@babylonjs/core/types.js";
// import { HavokPhysicsWithBindings } from "@babylonjs/havok";
// import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
// import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
// import { GizmoManager } from "@babylonjs/core/Gizmos/gizmoManager";

// import Atom from "../components/3d/Atoms/Atom";
// import Avatar from "../components/3d/Avatar/Avatar";
// import AvatarController from "../components/3d/Avatar/AvatarController";
// import JoystickInstance from "../components/3d/OverlayElements/Joystick/JoystickInstance";
import CoreScene from "../components/3d/Core/CoreScene";

interface StoreState {
    isModelEditing: boolean;
    isImageEditing: boolean;
    isAvatarEditing: boolean;

    coreScene: Nullable<CoreScene>;
    canvas: Nullable<HTMLCanvasElement>;
    engine: Nullable<Engine>;
    scene: Nullable<Scene>;
    // havok: Nullable<HavokPhysicsWithBindings>;
    // camera: Nullable<ArcRotateCamera>;
    // atom: Nullable<Atom>;
    // avatar: Nullable<Avatar>;
    // avatarController: Nullable<AvatarController>;
    // shadowGenerators: ShadowGenerator[];
    // gizmoManager: Nullable<GizmoManager>;
    // joystick: Nullable<JoystickInstance>;

    setCoreScene: (coreScene: CoreScene) => void;
    setCanvas: (canvas: Nullable<HTMLCanvasElement>) => void;
    setEngine: (engine: Nullable<Engine>) => void;
    setScene: (scene: Nullable<Scene>) => void;
    // setHavok: (havok: Nullable<HavokPhysicsWithBindings>) => void;
    // setCamera: (camera: Nullable<ArcRotateCamera>) => void;
    // setAtom: (atom: Nullable<Atom>) => void;
    // setAvatar: (avatar: Nullable<Avatar>) => void;
    // setAvatarController: (avatarController: Nullable<AvatarController>) => void;
    // setShadowGenerators: (shadowGenerators: ShadowGenerator[]) => void;
    // setGizmoManager: (gizmoManager: Nullable<GizmoManager>) => void;
    // setJoystick: (joystick: Nullable<JoystickInstance>) => void;
}

export const useStore = create<StoreState>()((set) => ({
    isModelEditing: false,
    isImageEditing: false,
    isAvatarEditing: false,

    coreScene: null,
    canvas: null,
    engine: null,
    scene: null,
    // havok: null,
    // camera: null,
    // atom: null,
    // avatar: null,
    // avatarController: null,
    // shadowGenerators: [],
    // gizmoManager: null,
    // joystick: null,

    setCoreScene: (coreScene: CoreScene) => set({ coreScene }),
    setCanvas: (canvas: Nullable<HTMLCanvasElement>) => set({ canvas }),
    setEngine: (engine: Nullable<Engine>) => set({ engine }),
    setScene: (scene: Nullable<Scene>) => set({ scene }),
    // setHavok: (havok: Nullable<HavokPhysicsWithBindings>) => set({ havok }),
    // setCamera: (camera: Nullable<ArcRotateCamera>) => set({ camera }),
    // setAtom: (atom: Nullable<Atom>) => set({ atom }),
    // setAvatar: (avatar: Nullable<Avatar>) => set({ avatar }),
    // setAvatarController: (avatarController: Nullable<AvatarController>) =>
    //     set({ avatarController }),
    // setShadowGenerators: (shadowGenerators: ShadowGenerator[]) =>
    //     set({ shadowGenerators }),
    // setGizmoManager: (gizmoManager: Nullable<GizmoManager>) =>
    //     set({ gizmoManager }),
    // setJoystick: (joystick: Nullable<JoystickInstance>) => set({ joystick }),
}));
