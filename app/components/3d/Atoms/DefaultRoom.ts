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

class DefaultRoom extends Atom {
    private _root: AbstractMesh = null!;
    private _meshes: AbstractMesh[] = [];
    private _shadowGenerators: ShadowGenerator[];
    private _physicsAggregates: PhysicsAggregate[] = [];

    constructor(
        scene: Scene,
        reflectionList?: Mesh[],
        shadowGenerators?: ShadowGenerator[],
        wallColor?: string,
        paintingURLs?: PaintingURLs
    ) {
        super(
            scene,
            {
                width: 2.5,
                height: 2.5,
                depth: 2.5,
            },
            "default",
            reflectionList
        );
        this._shadowGenerators = shadowGenerators ?? [];

        SceneLoader.ImportMesh(
            "",
            "/models/atoms/",
            "default.glb",
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

                    // optimize performance
                    mesh.freezeWorldMatrix();

                    switch (true) {
                        case mesh.name.includes("Wall"):
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
                        case mesh.name === "RoofGlass":
                            mesh.visibility = 0.2;
                            break;
                    }

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
        this.dispose();
    }
}

export default DefaultRoom;
