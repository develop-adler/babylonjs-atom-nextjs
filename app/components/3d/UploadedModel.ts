import {
    AbstractMesh,
    Color3,
    Mesh,
    Scene,
    SceneLoader,
    ShadowGenerator,
} from "@babylonjs/core";
import { SCENE_SETTINGS } from "@/app/utils/global";
import Atom from "./Atoms/Atom";

class UploadedModel {
    private _file: File;
    private _scene: Scene;
    private _atom: Atom;
    private _shadowGenerators: ShadowGenerator[];
    private _root!: AbstractMesh;
    private _meshes!: AbstractMesh[];
    private _parent: Mesh;

    constructor(
        file: File,
        scene: Scene,
        atom: Atom,
        shadowGenerators: ShadowGenerator[],
    ) {
        this._file = file;
        this._scene = scene;
        this._atom = atom;
        this._shadowGenerators = shadowGenerators;

        this._parent = new Mesh("parent", scene);
    }
    public get file(): File {
        return this._file;
    }
    public get root(): AbstractMesh {
        return this._root;
    }
    public get meshes(): AbstractMesh[] {
        return this._meshes;
    }
    public get parent(): Mesh {
        return this._parent;
    }

    public async _loadModelFromFile(file: File): Promise<void> {
        SceneLoader.ImportMesh(
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
                const parent = new Mesh(filename, this._scene);
                meshes.forEach(mesh => {
                    mesh.outlineColor = Color3.Green();
                    mesh.outlineWidth = 0.05;
                    mesh.parent = parent;
                    SCENE_SETTINGS.importedMeshesMap.set(mesh.uniqueId, mesh);
                });

                SCENE_SETTINGS.importedMeshGroups.set(filename, parent);

                // don't play animations
                animationGroups.forEach(animation => {
                    animation.stop();
                });

                // enable shadows
                if (this._shadowGenerators.length) {
                    this._shadowGenerators?.forEach(generator => {
                        meshes.forEach(mesh => {
                            mesh.receiveShadows = true;
                            generator.addShadowCaster(mesh);
                        });
                    });
                }

                // add meshes to reflection list
                this._atom.addMeshesToReflectionList(meshes as Mesh[]);
            },
            null, // onProgress
            (_, message, exception) => {
                // onError
                throw new Error(exception ?? `Error loading model: ${message}`);
            },
        );
    }
}

export default UploadedModel;
