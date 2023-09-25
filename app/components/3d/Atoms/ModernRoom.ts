import {
    AbstractMesh,
    Color3,
    Mesh,
    Scene,
    SceneLoader,
    ShadowGenerator,
    StandardMaterial,
} from "@babylonjs/core";
import Atom from "./Atom";

class ModernRoom extends Atom {
    private _root: AbstractMesh = null!;
    private _meshes: AbstractMesh[] = [];
    private _shadowGenerators: ShadowGenerator[];

    constructor(
        scene: Scene,
        wallColor?: string,
        reflectionList?: Mesh[],
        shadowGenerators?: ShadowGenerator[]
    ) {
        super(
            scene,
            {
                width: 2.5,
                height: 2.5,
                depth: 2.5,
            },
            "modern",
            reflectionList
        );
        this._shadowGenerators = shadowGenerators ?? [];

        SceneLoader.ImportMesh(
            "",
            "/models/atoms/",
            "modern.glb",
            scene,
            (meshes) => {
                this._root = meshes[0];
                this._meshes = meshes.slice(1);

                this.addPictureToAtom("/textures/baby-sonic-2.avif", "front");
                this.addPictureToAtom("/textures/bonk-shiba.avif", "leftFront");
                this.addPictureToAtom("/textures/angry-frog.avif", "rightFront");
                this.addPictureToAtom("/textures/1234.avif", "leftBack");
                this.addPictureToAtom("/textures/hyundai.avif", "rightBack");

                this.addMeshesToReflectionList(this._meshes as Mesh[]);

                this._meshes.forEach((mesh) => {
                    mesh.receiveShadows = true;

                    // optimize performance
                    mesh.freezeWorldMatrix();

                    switch (mesh.name) {
                        case "SideWallTopMolding":
                        case "SideWallBottomMolding":
                        case "TopGrill":
                            if (this._shadowGenerators.length) {
                                this._shadowGenerators?.forEach((generator) => {
                                    generator.addShadowCaster(mesh);
                                });
                            }
                            break;
                        case "SideWalls":
                        case "FrontWall":
                        case "BackWall":
                            const wallMaterial = new StandardMaterial(
                                "SideWallsMaterial",
                                scene
                            );
                            wallMaterial.diffuseColor = Color3.FromHexString(
                                wallColor ?? "#ffffff"
                            );
                            mesh.material = wallMaterial;

                            if (this._shadowGenerators.length) {
                                this._shadowGenerators?.forEach((generator) => {
                                    generator.addShadowCaster(mesh);
                                });
                            }
                            break;
                        case "TopGlass":
                            mesh.visibility = 0.2;
                            break;
                    }

                    mesh.material?.freeze();
                    mesh.doNotSyncBoundingInfo = true;
                });
            }
        );
    }
    public get root(): AbstractMesh {
        return this._root;
    }
    public get meshes(): AbstractMesh[] {
        return this._meshes;
    }

    public dispose(): void {
        this._root.dispose();
        this._meshes.forEach((mesh) => {
            mesh.dispose();
        });
        this.dispose();
    }
}

export default ModernRoom;
