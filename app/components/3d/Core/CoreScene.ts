"use client";

import "@babylonjs/core/Debug/debugLayer";
if (typeof document !== "undefined") {
    import("@babylonjs/inspector");
}
import "@babylonjs/loaders";
import * as BABYLON from "@babylonjs/core";
import HavokPhysics, { HavokPhysicsWithBindings } from "@babylonjs/havok";
// import * as Hammer from "hammerjs";

import Avatar from "../Avatar/Avatar";
import AvatarController from "../Avatar/AvatarController";
import Atom from "../Atoms/Atom";
import ClassicRoom from "../Atoms/ClassicRoom";
import ModernRoom from "../Atoms/ModernRoom";
// import Furniture from "../AtomElements/Furniture";
// import LoadingUI from "../OverlayElements/LoadingUI";
import JoystickInstance from "../OverlayElements/Joystick/JoystickInstance";

import { SCENE_SETTINGS } from "@/app/utils/global";
import {
    deleteImportedMesh,
    hideAllOutlines,
    isMobile,
    showOutline,
} from "@/app/utils/functions";
import DefaultRoom from "../Atoms/DefaultRoom";

export default class MainScene {
    private static instance: MainScene;

    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _havok!: HavokPhysicsWithBindings;
    private _camera: BABYLON.ArcRotateCamera;
    private _atom!: Atom;
    private _avatar!: Avatar;
    private _avatarController?: AvatarController;
    private _shadowGenerators: BABYLON.ShadowGenerator[] = [];
    private _gizmoManager: BABYLON.GizmoManager;
    private _joystick?: JoystickInstance;

    private static readonly AVATAR_CAMERA_HEIGHT: number = 1.15;

    constructor(scene: BABYLON.Scene) {
        MainScene.instance = this;

        // replace default loading screen overlay
        // new LoadingUI();

        this._scene = scene;
        this._engine = scene.getEngine();
        this._canvas = scene.getEngine().getRenderingCanvas()!;

        // show loading screen
        this._engine.displayLoadingUI();

        this._joystick = JoystickInstance.getInstance();

        // gizmo manager
        this._gizmoManager = new BABYLON.GizmoManager(this._scene);
        this._initGizmoManager();

        // camera
        this._camera = new BABYLON.ArcRotateCamera(
            "camera",
            -Math.PI * 0.5,
            Math.PI * 0.5,
            5,
            new BABYLON.Vector3(0, MainScene.AVATAR_CAMERA_HEIGHT, -2), // target
            this._scene
        );
        this._initAvatarCamera();

        // wait until scene has physics then setup scene
        this.initScene().then(async () => {
            // // prioritize performance
            // this._scene.performancePriority = BABYLON.ScenePerformancePriority.Aggressive;

            // Optimizer
            const options = new BABYLON.SceneOptimizerOptions(120, 2000);
            options.addOptimization(new BABYLON.HardwareScalingOptimization(0, 1));
            const optimizer = new BABYLON.SceneOptimizer(this._scene, options);
            optimizer.start();

            this.createLight();
            this.initInputControls();

            // read json file
            let settings;
            if (typeof window !== "undefined") {
                const response = await window.fetch("/settings.json");

                try {
                    settings = await response.json();
                    SCENE_SETTINGS.settings = settings;

                    const { theme, wallColor, paintings } = SCENE_SETTINGS.settings;
                    this._atom = this.createAtom(theme, wallColor, paintings);
                } catch (e) {
                    throw new Error("Error parsing json file:", e as Error);
                }
            }

            this._avatar = new Avatar(
                this._scene,
                this._atom,
                this._shadowGenerators
            );

            this._avatar.init().then(() => {
                this.setThirdperson();

                // hide loading screen
                this._engine.hideLoadingUI();
            });

            // new Furniture("table_001.glb", this._scene, this._atom, this._shadowGenerators, {
            //     position: new BABYLON.Vector3(3, 0, 2),
            //     type: "cylinder",
            // });
            // new Furniture("table_002.glb", this._scene, this._atom, this._shadowGenerators, {
            //     position: new BABYLON.Vector3(5, 0, 3),
            //     type: "cylinder",
            // });
            // new Furniture("table_003.glb", this._scene, this._atom, this._shadowGenerators, {
            //     position: new BABYLON.Vector3(0, 0, -1.25),
            // });

            // new Furniture("sofa_001.glb", this._scene, this._atom, this._shadowGenerators, {
            //     position: new BABYLON.Vector3(0, 0, -3),
            //     rotation: new BABYLON.Vector3(0, Math.PI, 0),
            // });
            // new Furniture("sofa_002.glb", this._scene, this._atom, this._shadowGenerators, {
            //     position: new BABYLON.Vector3(6.8, 0, -4),
            //     rotation: new BABYLON.Vector3(0, Math.PI * 0.5, 0),
            // });

            // canvas/window resize event handler
            const handleResize = () => {
                // widen camera FOV on narrows screens
                if (window.innerWidth < window.innerHeight) {
                    this._camera.fov = 1;
                } else {
                    this._camera.fov = 0.8;
                }
            };
            window.addEventListener("resize", handleResize);

            // remove event listener
            this._scene.onDispose = () => {
                window.removeEventListener("resize", handleResize);
            };

            // disposing resources
            this._engine.onDisposeObservable.addOnce(() => {
                this.dispose();
            });
        });
    }

    public static getInstance(): MainScene {
        return this.instance;
    }
    public get canvas(): HTMLCanvasElement {
        return this._canvas;
    }
    public get engine(): BABYLON.Engine {
        return this._engine;
    }
    public get scene(): BABYLON.Scene {
        return this._scene;
    }
    public get havok(): HavokPhysicsWithBindings {
        return this._havok;
    }
    public get gizmoManager(): BABYLON.GizmoManager {
        return this._gizmoManager;
    }
    public get camera(): BABYLON.ArcRotateCamera {
        return this._camera;
    }
    public get atom(): Atom {
        return this._atom;
    }
    public get avatar(): Avatar {
        return this._avatar;
    }
    public get avatarController(): AvatarController {
        return this._avatarController!;
    }
    public get shadowGenerators(): BABYLON.ShadowGenerator[] {
        return this._shadowGenerators;
    }
    public get joystick(): JoystickInstance | null {
        return this._joystick ?? null;
    }

    private async initScene(): Promise<void> {
        const envMapTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
            "/envMap/sky.env",
            this._scene
        );
        this._scene.environmentTexture = envMapTexture;
        this._scene.createDefaultSkybox(envMapTexture, true);
        this._scene.environmentIntensity = 0.5;
        // this._scene.clearColor = BABYLON.Color4.FromHexString('#FC4C91');

        // enable animation blending
        this._scene.animationPropertiesOverride =
            new BABYLON.AnimationPropertiesOverride();
        this._scene.animationPropertiesOverride.enableBlending = true;
        this._scene.animationPropertiesOverride.blendingSpeed = 0.07;
        this._scene.animationPropertiesOverride.loopMode = 1;

        // Enable physics
        const gravityVector = new BABYLON.Vector3(0, -9.81, 0);
        this._havok = await HavokPhysics();
        // pass the engine to the plugin
        const havokPlugin = new BABYLON.HavokPlugin(true, this._havok);
        // enable physics in the scene with a gravity
        this._scene.enablePhysics(gravityVector, havokPlugin);

        // hover object in editing model mode
        this._scene.onPointerMove = () => {
            if (!SCENE_SETTINGS.isEditingModelMode || SCENE_SETTINGS.hasModelSelected)
                return;

            const pickResult = this._scene.pick(
                this._scene.pointerX,
                this._scene.pointerY
            );

            if (!pickResult.hit) return;
            if (!pickResult.pickedMesh) return;

            if (
                pickResult.pickedMesh.parent &&
                SCENE_SETTINGS.importedMeshGroups.has(pickResult.pickedMesh.parent.name)
            ) {
                showOutline(pickResult.pickedMesh.parent.getChildMeshes());
                SCENE_SETTINGS.hoveredMeshParentName =
                    pickResult.pickedMesh.parent.name;
            } else if (SCENE_SETTINGS.hoveredMeshParentName !== "") {
                SCENE_SETTINGS.importedMeshGroups
                    .get(SCENE_SETTINGS.hoveredMeshParentName)!
                    .getChildMeshes()
                    .forEach((mesh) => {
                        mesh.renderOutline = false;
                    });
                SCENE_SETTINGS.hoveredMeshParentName = "";
            }
        };

        // click object in editing model mode
        this._scene.onPointerPick = (e: BABYLON.IPointerEvent) => {
            // left click
            if (e.button === 0) {
                // listen when in editing model mode
                if (!SCENE_SETTINGS.isEditingModelMode) return;

                const pickResult = this._scene.pick(
                    this._scene.pointerX,
                    this._scene.pointerY
                );

                if (!pickResult.hit) return;
                if (!pickResult.pickedMesh) return;

                hideAllOutlines();

                if (
                    pickResult.pickedMesh.parent &&
                    SCENE_SETTINGS.importedMeshGroups.has(
                        pickResult.pickedMesh.parent.name
                    )
                ) {
                    // object is selected
                    SCENE_SETTINGS.hasModelSelected = true;
                    showOutline(pickResult.pickedMesh.parent.getChildMeshes());
                    this._gizmoManager.attachToMesh(
                        pickResult.pickedMesh.parent as BABYLON.AbstractMesh
                    );
                    SCENE_SETTINGS.selectedMeshParentName =
                        pickResult.pickedMesh.parent.name;
                } else if (SCENE_SETTINGS.selectedMeshParentName !== "") {
                    // object unselected
                    SCENE_SETTINGS.hasModelSelected = false;
                    this._gizmoManager.attachToMesh(null);
                }
            }
        };
    }

    private _initGizmoManager(): void {
        this._gizmoManager.positionGizmoEnabled = true;
        this._gizmoManager.rotationGizmoEnabled = true;
        this._gizmoManager.scaleGizmoEnabled = true;

        // use world orientation for gizmos
        this._gizmoManager.gizmos.positionGizmo!.updateGizmoRotationToMatchAttachedMesh =
            false;
        this._gizmoManager.gizmos.rotationGizmo!.updateGizmoRotationToMatchAttachedMesh =
            false;

        // disable y axis for position and rotation gizmo
        this._gizmoManager.gizmos.positionGizmo!.yGizmo.isEnabled = false;
        this._gizmoManager.gizmos.rotationGizmo!.xGizmo.isEnabled = false;
        this._gizmoManager.gizmos.rotationGizmo!.zGizmo.isEnabled = false;

        // enable only position gizmo by default
        this._gizmoManager.rotationGizmoEnabled = false;
        this._gizmoManager.scaleGizmoEnabled = false;
        this._gizmoManager.positionGizmoEnabled = true;

        // disable pointer to attach gizmos
        this._gizmoManager.usePointerToAttachGizmos = false;
        this._gizmoManager.attachableMeshes = []; // don't allow any mesh to be attached
    }

    private _initAvatarCamera(): void {
        this._camera = new BABYLON.ArcRotateCamera(
            "camera",
            -Math.PI * 0.5,
            Math.PI * 0.5,
            5,
            new BABYLON.Vector3(0, MainScene.AVATAR_CAMERA_HEIGHT, -2), // target
            this._scene
        );

        this._camera.position = new BABYLON.Vector3(0, 3, -3.5);

        // This attaches the camera to the canvas
        this._camera.attachControl(this._canvas, true);
        this._scene.switchActiveCamera(this._camera);

        // widen camera FOV on narrows screens
        if (window.innerWidth < window.innerHeight) {
            this._camera.fov = 1;
        } else {
            this._camera.fov = 0.8;
        }

        // prevent clipping
        this._camera.minZ = 0.1;

        // don't zoom in or out as much when scrolling mouse wheel
        this._camera.wheelPrecision = 100;

        // camera min distance and max distance
        this._camera.lowerRadiusLimit = 0.5;
        this._camera.upperRadiusLimit = 5;

        //  lower rotation sensitivity, higher value = less sensitive
        this._camera.angularSensibilityX = isMobile() ? 1000 : 3000;
        this._camera.angularSensibilityY = isMobile() ? 1000 : 3000;

        // disable rotation using keyboard arrow key
        this._camera.keysUp = [];
        this._camera.keysDown = [];
        this._camera.keysLeft = [];
        this._camera.keysRight = [];

        // disable panning
        this._camera.panningSensibility = 0;
    }

    public setFirstperson(pointerLock: boolean = false): void {
        this._avatar.hide();

        if (pointerLock && !isMobile()) {
            this._engine.enterPointerlock();
            this._scene.onPointerDown = (e) => {
                // left click
                if (e.button === 0) this._engine.enterPointerlock();
            };
        } else {
            this._engine.exitPointerlock();
            this._scene.onPointerDown = undefined;
        }

        this._camera.lowerRadiusLimit = 0; // min distance
        this._camera.upperRadiusLimit = 0; // max distance
        this._scene.switchActiveCamera(this._camera);

        SCENE_SETTINGS.isThirdperson = false;

        SCENE_SETTINGS.isThirdperson = false;
    }

    public async setThirdperson(): Promise<void> {
        this._camera.lowerRadiusLimit = 0.5; // min distance
        this._camera.upperRadiusLimit = 3; // max distance
        this._scene.switchActiveCamera(this._camera);

        this._avatar.show();
        if (!this._avatarController) {
            this._avatarController = new AvatarController(
                this._avatar,
                this._camera,
                this._scene,
                this._joystick
            );
        } else {
            this._avatarController.start();
        }

        SCENE_SETTINGS.isThirdperson = true;
    }

    public async _loadModelFromFile(file: File): Promise<void> {
        BABYLON.SceneLoader.ImportMesh(
            "",
            "",
            file,
            this._scene,
            (meshes, _particleSystems, _skeleton, animationGroups) => {
                // mesh naming convention: filename + _ + number
                // get file name, remove extension
                let filename = file.name.replace(".glb", "").replace(".gltf", "");

                // if there's a mesh with the same name, add a number to the end of the name
                if (SCENE_SETTINGS.importedMeshGroups.has(file.name)) {
                    let i = 1;
                    while (SCENE_SETTINGS.importedMeshGroups.has(filename)) {
                        filename = `${file.name.split(".")[0]}_${i}.${file.name.split(".")[1]
                            }`;
                        i++;
                    }
                }

                // add meshes to a parent node and assign to imported mesh map
                const parent = new BABYLON.TransformNode(filename, this._scene);
                meshes.forEach((mesh) => {
                    mesh.outlineColor = BABYLON.Color3.Green();
                    mesh.outlineWidth = 0.05;
                    mesh.parent = parent;
                    SCENE_SETTINGS.importedMeshesMap.set(mesh.uniqueId, mesh);
                });

                SCENE_SETTINGS.importedMeshGroups.set(filename, parent);

                // don't play animations
                animationGroups.forEach((animation) => {
                    animation.stop();
                });

                // enable shadows
                if (this._shadowGenerators.length) {
                    this._shadowGenerators?.forEach((generator) => {
                        meshes.forEach((mesh) => {
                            mesh.material?.freeze();
                            mesh.receiveShadows = true;
                            generator.addShadowCaster(mesh);
                        });
                    });
                }

                // add meshes to reflection list
                this._atom.addMeshesToReflectionList(meshes as BABYLON.Mesh[]);
            },
            null, // onProgress
            (_, message, exception) => {
                // onError
                throw new Error(exception ?? `Error loading model: ${message}`);
            }
        );
    }

    private initInputControls(): void {
        // Keyboard input
        this._scene.onKeyboardObservable.add((kbInfo) => {
            if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN) {
                switch (kbInfo.event.key.toLowerCase()) {
                    case "i":
                        if (this._scene.debugLayer.isVisible()) {
                            this._scene.debugLayer.hide();
                        } else {
                            this._scene.debugLayer.show();
                        }
                        break;
                    case "delete":
                        deleteImportedMesh(this._scene, this._gizmoManager);
                        break;
                }
            }
        });

        // // phone input
        // const hammerManager = new Hammer.Manager(this._canvas);

        // // create swipe gesture recognizer and add recognizer to manager
        // const Swipe = new Hammer.Swipe();
        // hammerManager.add(Swipe);

        // hammerManager.get("swipe").set({ direction: Hammer.DIRECTION_ALL });
        // hammerManager.on("swipe", (e: any) => {
        //     switch (e.direction) {
        //         case Hammer.DIRECTION_UP:
        //             break;
        //         case Hammer.DIRECTION_LEFT:
        //             break;
        //         case Hammer.DIRECTION_RIGHT:
        //             break;
        //     }
        // });
    }

    private createLight(): void {
        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        const hemiLight = new BABYLON.HemisphericLight(
            "hemiLight",
            new BABYLON.Vector3(0, 1, 0),
            this._scene
        );

        // dim light a small amount
        hemiLight.intensity = 1;

        const dirLight = new BABYLON.DirectionalLight(
            "dirLight",
            new BABYLON.Vector3(10, -35, -2),
            this._scene
        );

        dirLight.position = new BABYLON.Vector3(-5, 25, 0);
        dirLight.intensity = 0.4;
        dirLight.shadowEnabled = true;
        dirLight.shadowMinZ = 2;
        dirLight.shadowMaxZ = 30;

        // this.createLightGizmo(dirLight);

        // Shadows
        const shadowGenerator = new BABYLON.ShadowGenerator(2048, dirLight);
        shadowGenerator.bias = 0.01;

        // enable PCF shadows for WebGL2
        shadowGenerator.usePercentageCloserFiltering = true;
        shadowGenerator.blurScale = 0.1;

        this._shadowGenerators.push(shadowGenerator);

        // set shadow quality
        shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_MEDIUM;
    }

    // private createLightGizmo(customLight: BABYLON.Light): void {
    //     const lightGizmo = new BABYLON.LightGizmo();
    //     lightGizmo.scaleRatio = 2;
    //     lightGizmo.light = customLight;

    //     this._gizmoManager.attachToMesh(lightGizmo.attachedMesh);
    // }

    private createAtom(
        type: string = "classic",
        wallColor: string = "#ffffff",
        paintings: PaintingURLs
    ): Atom {
        switch (type) {
            default:
                return new DefaultRoom(
                    this._scene,
                    this._atom?.reflectionList,
                    this._shadowGenerators,
                    wallColor,
                    paintings
                );
            case "classic":
                return new ClassicRoom(
                    this._scene,
                    this._atom?.reflectionList,
                    this._shadowGenerators,
                    wallColor,
                    paintings
                );
            case "modern":
                return new ModernRoom(
                    this._scene,
                    this._atom?.reflectionList,
                    this._shadowGenerators,
                    wallColor,
                    paintings
                );
        }
    }

    public dispose(): void {
        this._avatar?.dispose();
        this._avatarController?.dispose();
        this._shadowGenerators.forEach((generator) => {
            generator.dispose();
        });
    }
}
