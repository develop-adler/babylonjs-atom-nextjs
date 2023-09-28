import {
    AbstractMesh,
    Color3,
    Mesh,
    PhysicsAggregate,
    PhysicsShapeType,
    Scene,
    SceneLoader,
    ShadowGenerator,
    StandardMaterial,
} from "@babylonjs/core";
import Atom from "./Atom";

class ClassicRoom extends Atom {
    private _root: AbstractMesh = null!;
    private _meshes: AbstractMesh[] = [];
    private _shadowGenerators: ShadowGenerator[];
    private _physicsAggregates: PhysicsAggregate[] = [];

    constructor(
        scene: Scene,
        reflectionList?: Mesh[],
        shadowGenerators?: ShadowGenerator[],
        wallColor?: string,
        paintingURLs?: PaintingURLs,
    ) {
        super(
            scene,
            {
                width: 2.5,
                height: 2.5,
                depth: 2.5,
            },
            "classic",
            reflectionList
        );
        this._shadowGenerators = shadowGenerators ?? [];

        SceneLoader.ImportMesh(
            "",
            "/models/atoms/",
            "classic.glb",
            scene,
            (meshes) => {
                this._root = meshes[0];
                this._meshes = meshes.slice(1);

                Object.entries(paintingURLs ?? {}).forEach(([key, value]) => {
                    this.addPictureToAtom(value, key as PictureSide);
                });

                this.addMeshesToReflectionList(this._meshes as Mesh[]);

                this._meshes.forEach((mesh) => {
                    mesh.receiveShadows = true;

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
                        case "FrontPillars.L":
                        case "FrontPillars.R":
                        case "FrontSidePillars.L":
                        case "FrontSidePillars.R":
                            this._physicsAggregates.push(
                                new PhysicsAggregate(
                                    mesh,
                                    PhysicsShapeType.CONVEX_HULL,
                                    { mass: 0, restitution: 0.01 },
                                    scene
                                )
                            );
                            break;
                    }

                    // optimize performance
                    mesh.material?.freeze();
                    mesh.freezeWorldMatrix();
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
            mesh.dispose(false, true);
        });
        this._physicsAggregates.forEach((agg) => {
            agg.dispose();
        });
        super.dispose();
    }
}

export default ClassicRoom;
