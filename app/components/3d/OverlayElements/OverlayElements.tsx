"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    AbstractMesh,
    ArcRotateCamera,
    Nullable,
    Vector3,
} from "@babylonjs/core";

import { FEMALE_PARTS, MALE_PARTS, SCENE_SETTINGS } from "@/app/utils/global";
import { useStore } from "@/app/utils/store";

import CoreScene from "../Core/CoreScene";
import ToolShelf from "./ToolShelf/ToolShelf";

import * as UIStyled from "./OverlayElementsStyled.ts";

const setupImageUpload = (coreScene: CoreScene): void => {
    let editingPictureCamera: Nullable<ArcRotateCamera> = null;
    if (SCENE_SETTINGS.isEditingPictureMode) {
        if (editingPictureCamera !== null) return;
        editingPictureCamera = new ArcRotateCamera(
            "editingPictureCamera",
            -Math.PI * 0.5,
            Math.PI * 0.5,
            10,
            new Vector3(0, coreScene.atom.dimensions.height, 0),
            coreScene.scene
        );
        editingPictureCamera.position = new Vector3(
            0,
            coreScene.atom.dimensions.height,
            0
        );

        // widen camera FOV on narrows screens
        if (window.innerWidth < window.innerHeight) {
            editingPictureCamera.fov = 1.3;
        } else {
            editingPictureCamera.fov = 1;
        }

        // prevent clipping
        editingPictureCamera.minZ = 0.1;

        // camera min distance and max distance
        editingPictureCamera.lowerRadiusLimit = 0;
        editingPictureCamera.upperRadiusLimit = 0;

        //  lower rotation sensitivity, higher value = less sensitive
        editingPictureCamera.angularSensibilityX = 3000;
        editingPictureCamera.angularSensibilityY = 3000;

        // disable rotation using keyboard arrow key
        editingPictureCamera.keysUp = [];
        editingPictureCamera.keysDown = [];
        editingPictureCamera.keysLeft = [];
        editingPictureCamera.keysRight = [];

        // disable panning
        editingPictureCamera.panningSensibility = 0;

        coreScene.scene.switchActiveCamera(editingPictureCamera);
        coreScene.avatar.hide();
        coreScene.avatarController.stop();
        coreScene.joystick?.hide();
    } else {
        coreScene.scene.switchActiveCamera(coreScene.camera);
        coreScene.avatar.show();
        coreScene.avatarController.start();
        coreScene.joystick?.show();
    }
};

const setupModelEditing = (coreScene: CoreScene): void => {
    let editingModelCamera: Nullable<ArcRotateCamera> = null;
    if (SCENE_SETTINGS.isEditingModelMode) {
        if (editingModelCamera !== null) return;
        editingModelCamera = new ArcRotateCamera(
            "editingModelCamera",
            -Math.PI * 0.5,
            Math.PI * 0.5,
            10,
            new Vector3(0, coreScene.atom.dimensions.height * 0.5, 0),
            coreScene.scene
        );
        editingModelCamera.position = new Vector3(
            -coreScene.atom.dimensions.width * 1.75,
            coreScene.atom.dimensions.height * 2,
            coreScene.atom.dimensions.depth * 2
        );

        // widen camera FOV on narrows screens
        if (window.innerWidth < window.innerHeight) {
            editingModelCamera.fov = 1.3;
        } else {
            editingModelCamera.fov = 1;
        }

        // prevent clipping
        editingModelCamera.minZ = 0.1;

        editingModelCamera.wheelPrecision = 100;

        // camera min distance and max distance
        editingModelCamera.lowerRadiusLimit = 0;
        editingModelCamera.upperRadiusLimit = 20;

        //  lower rotation sensitivity, higher value = less sensitive
        editingModelCamera.angularSensibilityX = 3000;
        editingModelCamera.angularSensibilityY = 3000;

        // lower panning sensitivity, higher value = less sensitive
        editingModelCamera.panningSensibility = 1000;

        // disable rotation using keyboard arrow key
        editingModelCamera.keysUp = [];
        editingModelCamera.keysDown = [];
        editingModelCamera.keysLeft = [];
        editingModelCamera.keysRight = [];

        coreScene.scene.switchActiveCamera(editingModelCamera);
        coreScene.avatar.hide();
        coreScene.avatarController.stop();
        coreScene.joystick?.hide();
    } else {
        coreScene.scene.switchActiveCamera(coreScene.camera);
        coreScene.scene.meshes.forEach((mesh: AbstractMesh) => {
            mesh.renderOutline = false;
        });

        coreScene.avatar.show();
        coreScene.avatarController.start();
        coreScene.joystick?.show();
    }
};

const modelInputFieldOnChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    coreScene: CoreScene
) => {
    e.stopPropagation();

    const target = e.target as HTMLInputElement;
    const file = (target.files as FileList)[0];

    // Reset the input field to allow uploading the same file again
    target.value = "";

    coreScene._loadModelFromFile(file);
};

const imageInputFieldOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    coreScene: CoreScene
) => {
    const target = e.target as HTMLInputElement;
    const file = (target.files as FileList)[0];

    // Reset the input field to allow uploading the same file again
    target.value = "";

    // get src from uploaded file
    const src = URL.createObjectURL(file);

    coreScene.atom.updatePictureInAtom(src, SCENE_SETTINGS.editingImage!);
};

// categories for body parts
const CATEGORIES = ["gender", "hair", "top", "bottom", "shoes"];
let partStylePath = "/images/parts/";

const OverlayElements = (): React.JSX.Element => {
    const imageEditingBtn = useRef<HTMLButtonElement>(null);
    const imageUploadInputField = useRef<HTMLInputElement>(null);
    const uploadImageGuideText = useRef<HTMLDivElement>(null);
    const modelEditingBtn = useRef<HTMLButtonElement>(null);
    const modelUploadInputBtn = useRef<HTMLButtonElement>(null);
    const modelUploadInputField = useRef<HTMLInputElement>(null);
    const toggleAvatarEditingBtn = useRef<HTMLButtonElement>(null);
    const avatarEditorOverlay = useRef<HTMLDivElement>(null);

    const [currentCategory, setCurrentCategory] = useState<BodyParts>("gender");
    const [partStyleImageList, setPartStyleImageList] = useState<string[]>([
        "male",
        "female",
    ]);

    const coreScene = useStore((state) => state.coreScene)!;

    const toggleImageEditingBtnOnClick = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();

        if (SCENE_SETTINGS.isEditingModelMode) {
            window.alert("Please turn off model editing mode first!");
            return;
        }

        SCENE_SETTINGS.isEditingPictureMode = !SCENE_SETTINGS.isEditingPictureMode;

        if (SCENE_SETTINGS.isEditingPictureMode) {
            imageEditingBtn.current!.style.backgroundColor = "#fc4f91";
            uploadImageGuideText.current!.style.display = "block";
        } else {
            SCENE_SETTINGS.editingImage = null;
            imageEditingBtn.current!.style.backgroundColor = "#8a8a8a";
            uploadImageGuideText.current!.style.display = "none";
        }

        setupImageUpload(coreScene);
    };

    const toggleModelEditingBtnOnClick = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();

        if (SCENE_SETTINGS.isEditingPictureMode) {
            window.alert("Please turn off picture editing mode first!");
            return;
        }

        SCENE_SETTINGS.isEditingModelMode = !SCENE_SETTINGS.isEditingModelMode;

        if (SCENE_SETTINGS.isEditingModelMode) {
            modelEditingBtn.current!.style.backgroundColor = "#fc4f91";

            const toolShelfContainer = document.getElementById("toolShelfContainer")!;
            toolShelfContainer.style.display = "block";

            modelUploadInputBtn.current!.style.display = "block";
        } else {
            SCENE_SETTINGS.editingImage = null;
            coreScene.gizmoManager.attachToMesh(null);

            modelEditingBtn.current!.style.backgroundColor = "#8a8a8a";

            const toolShelfContainer = document.getElementById("toolShelfContainer")!;
            toolShelfContainer.style.display = "none";

            modelUploadInputBtn.current!.style.display = "none";
        }

        setupModelEditing(coreScene);
    };

    const uploadModelOnClick = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        modelUploadInputField.current?.click();
    };

    const avatarToggleButtonOnClick = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();

        if (SCENE_SETTINGS.isEditingModelMode) {
            window.alert("Please turn off model editing mode first!");
            return;
        }
        if (SCENE_SETTINGS.isEditingPictureMode) {
            window.alert("Please turn off picture editing mode first!");
            return;
        }

        SCENE_SETTINGS.isEditingAvatarMode = !SCENE_SETTINGS.isEditingAvatarMode;

        if (SCENE_SETTINGS.isEditingAvatarMode) {
            toggleAvatarEditingBtn.current!.style.backgroundColor = "#fc4f91";
            avatarEditorOverlay.current!.style.display = "flex";
            coreScene.joystick?.hide();
        } else {
            toggleAvatarEditingBtn.current!.style.backgroundColor = "#8a8a8a";
            avatarEditorOverlay.current!.style.display = "none";
            coreScene.joystick?.show();
        }
    };

    const partStyleImageOnClick = (partStyleIndex: string) => {
        if (currentCategory === "gender") {
            if (typeof window === 'undefined') return;
            if (partStyleIndex !== window.localStorage.getItem("avatarGender")) {
                coreScene.avatar.changeGender(partStyleIndex as Gender);
            }
        } else {
            const styleName =
                (coreScene.avatar.gender === "male" ? "m_" : "f_") +
                currentCategory +
                "_" +
                partStyleIndex;

            // don't load model if the style is already selected
            if (
                styleName ===
                coreScene.avatar.parts[currentCategory as keyof GenderParts][0]
            ) {
                return;
            }

            coreScene.avatar.changePartStyle(
                currentCategory,
                partStyleIndex as keyof GenderParts
            );
        }
    };

    const bodyPartSelectionOnClick = (category: string) => {
        if (category === "gender") {
            if (currentCategory === "gender") {
                return;
            }
            setCurrentCategory("gender");
            setPartStyleImageList(["male", "female"]);
            partStylePath = "/images/parts/";
        } else {
            setCurrentCategory(category as BodyParts);

            // set image list
            const imageList: string[] = [];
            const parts =
                coreScene.avatar.gender === "male" ? MALE_PARTS : FEMALE_PARTS;
            parts[category as keyof GenderParts].forEach((_, index) => {
                imageList.push(`${index + 1}`);
            });
            setPartStyleImageList(imageList);

            // set image path
            partStylePath = `/images/parts/${coreScene.avatar.gender}/${category}/`;
        }
    };

    const highlightSelectedPartStyleImage = (partStyleIndex: string): boolean => {
        if (currentCategory === "gender") {
            if (typeof window === 'undefined') return false;
            if (partStyleIndex === window.localStorage.getItem("avatarGender")) {
                return true;
            }
        } else if (
            Number(partStyleIndex) - 1 ===
            MALE_PARTS[currentCategory as keyof GenderParts].indexOf(
                coreScene.avatar.parts[currentCategory as keyof GenderParts][0]
            ) ||
            Number(partStyleIndex) - 1 ===
            FEMALE_PARTS[currentCategory as keyof GenderParts].indexOf(
                coreScene.avatar.parts[currentCategory as keyof GenderParts][0]
            )
        ) {
            // check the index of the current part style in gender parts
            // if it matches the index of the current part style in the current category,
            // highlight the image
            return true;
        }
        return false;
    };

    useEffect(() => {
        SCENE_SETTINGS.imageUploadInputField = imageUploadInputField.current!;
    }, []);

    return (
        <UIStyled.OverlayContainer>
            <UIStyled.UploadImageGuideText ref={uploadImageGuideText}>
                <p>Click on the picture you want to update image for.</p>
                <p>Then upload your image to replace image.</p>
            </UIStyled.UploadImageGuideText>
            <UIStyled.ImageUploadInputField
                ref={imageUploadInputField}
                type="file"
                accept="image/*"
                multiple
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    imageInputFieldOnChange(e, coreScene)
                }
            />

            <UIStyled.ButtonContainer>
                <UIStyled.ToggleImageEditingButton
                    ref={imageEditingBtn}
                    onClick={toggleImageEditingBtnOnClick}
                >
                    Toggle Image Editing
                </UIStyled.ToggleImageEditingButton>
                <UIStyled.ToggleModelEditingButton
                    ref={modelEditingBtn}
                    onClick={toggleModelEditingBtnOnClick}
                >
                    Toggle Model Editing
                </UIStyled.ToggleModelEditingButton>
                <UIStyled.ModelUploadInputButton
                    ref={modelUploadInputBtn}
                    onClick={uploadModelOnClick}
                >
                    Upload Model
                    <UIStyled.ModelUploadInputField
                        ref={modelUploadInputField}
                        type="file"
                        accept=".glb, .gltf"
                        multiple
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            modelInputFieldOnChange(e, coreScene)
                        }
                    />
                </UIStyled.ModelUploadInputButton>
                <UIStyled.ToggleAvatarEditorButton
                    ref={toggleAvatarEditingBtn}
                    onClick={avatarToggleButtonOnClick}
                >
                    Toggle Avatar Editing
                </UIStyled.ToggleAvatarEditorButton>
            </UIStyled.ButtonContainer>

            <ToolShelf />

            <UIStyled.AvatarEditorOverlay ref={avatarEditorOverlay}>
                <UIStyled.BodyPartSelectionContainer>
                    <UIStyled.BodyPartSelectionButtonContainer>
                        {CATEGORIES.map((category) => (
                            <UIStyled.BodyPartSelectionButton
                                key={category}
                                $selected={currentCategory === category}
                                onClick={() => bodyPartSelectionOnClick(category)}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </UIStyled.BodyPartSelectionButton>
                        ))}
                    </UIStyled.BodyPartSelectionButtonContainer>
                    <UIStyled.BodyPartSelectionButtonContainerLinebreak />
                    {partStyleImageList.map((name: string) => (
                        <UIStyled.PartStyleImage
                            key={name}
                            src={`${partStylePath}${name}.avif`}
                            onClick={() => {
                                partStyleImageOnClick(name);
                            }}
                            onContextMenu={(e) => e.preventDefault()}
                            onDragStart={(e) => e.preventDefault()}
                            $selected={highlightSelectedPartStyleImage(name)}
                        />
                    ))}
                </UIStyled.BodyPartSelectionContainer>
            </UIStyled.AvatarEditorOverlay>
        </UIStyled.OverlayContainer>
    );
};

export default OverlayElements;
