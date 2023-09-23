import { AbstractMesh, GizmoManager, Scene } from '@babylonjs/core';
import { SCENE_SETTINGS } from './global';

export const isMobile: () => boolean = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
    );
};

export const showOutline = (meshes: AbstractMesh[]) => {
    meshes.forEach(mesh => {
        mesh.renderOutline = true;
    });
};

export const hideAllOutlines = () => {
    SCENE_SETTINGS.importedMeshGroups.forEach(parentMesh => {
        parentMesh.getChildMeshes().forEach(mesh => {
            mesh.renderOutline = false;
        });
    });
};

export const deleteImportedMesh = (
    scene: Scene,
    gizmoManager: GizmoManager,
) => {
    const { importedMeshGroups, selectedMeshParentName } = SCENE_SETTINGS;
    if (selectedMeshParentName !== "") {
        // dispose meshes
        importedMeshGroups
            .get(selectedMeshParentName)!
            .getChildMeshes()
            .forEach(mesh => {
                SCENE_SETTINGS.importedMeshesMap.delete(mesh.uniqueId);
                scene.removeMesh(mesh);
                mesh.material?.dispose();
                mesh.dispose();
            });

        // dispose parent mesh
        const parentMesh = importedMeshGroups.get(selectedMeshParentName);
        if (parentMesh) {
            scene.removeTransformNode(parentMesh);
            parentMesh.dispose();
        }
        parentMesh?.dispose();
        SCENE_SETTINGS.importedMeshGroups.delete(selectedMeshParentName);

        // reset values
        SCENE_SETTINGS.hasModelSelected = false;
        SCENE_SETTINGS.selectedMeshParentName = "";
        SCENE_SETTINGS.hoveredMeshParentName = "";
        gizmoManager.attachToMesh(null);
    }
};