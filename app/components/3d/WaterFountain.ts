import {
    Color4,
    Mesh,
    MeshBuilder,
    ParticleSystem,
    PointerEventTypes,
    Scene,
    Texture,
    Vector3,
} from "@babylonjs/core";

class WaterFountain {
    // private _switched: boolean = false;

    constructor(scene: Scene) {
        // //Switch fountain on and off
        // const pointerDown = (mesh: Mesh) => {
        //     if (mesh === fountain) {
        //         this._switched = !this._switched;
        //         if (this._switched) {
        //             // Start the particle system
        //             particleSystem.start();
        //         } else {
        //             // Stop the particle system
        //             particleSystem.stop();
        //         }
        //     }
        // };

        // scene.onPointerObservable.add(pointerInfo => {
        //     switch (pointerInfo.type) {
        //         case PointerEventTypes.POINTERDOWN:
        //             if (pointerInfo!.pickInfo!.hit) {
        //                 pointerDown(pointerInfo!.pickInfo!.pickedMesh as Mesh);
        //             }
        //             break;
        //     }
        // });

        const fountainProfile = [
            new Vector3(0, 0, 0),
            new Vector3(10, 0, 0),
            new Vector3(10, 4, 0),
            new Vector3(8, 4, 0),
            new Vector3(8, 1, 0),
            new Vector3(1, 2, 0),
            new Vector3(1, 15, 0),
            new Vector3(3, 17, 0),
        ];

        //Create lathe
        const fountain = MeshBuilder.CreateLathe(
            "fountain",
            { shape: fountainProfile, sideOrientation: Mesh.DOUBLESIDE },
            scene,
        );
        fountain.scaling.scaleInPlace(0.1);

        // Create a particle system
        var particleSystem = new ParticleSystem("particles", 5000, scene);

        //Texture of each particle
        particleSystem.particleTexture = new Texture("/textures/flare.png", scene);

        // Where the particles come from
        particleSystem.emitter = new Vector3(0, 1.5, 0); // the starting object, the emitter
        particleSystem.minEmitBox = new Vector3(-0.3, 0, 0); // Starting all from
        particleSystem.maxEmitBox = new Vector3(0.3, 0, 0); // To...

        // Colors of all particles
        particleSystem.color1 = new Color4(0.7, 0.8, 1.0, 1.0);
        particleSystem.color2 = new Color4(0.2, 0.5, 1.0, 1.0);
        particleSystem.colorDead = new Color4(0, 0, 0.2, 0.0);

        // Size of each particle (random between...
        particleSystem.minSize = 0.05;
        particleSystem.maxSize = 0.2;

        // Life time of each particle (random between...
        particleSystem.minLifeTime = 2;
        particleSystem.maxLifeTime = 3.5;

        // Emission rate
        particleSystem.emitRate = 1500;

        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;

        // Set the gravity of all particles
        particleSystem.gravity = new Vector3(0, -9.81, 0);

        // Direction of each particle after it has been emitted
        particleSystem.direction1 = new Vector3(-2, 9, 2).scaleInPlace(0.125);
        particleSystem.direction2 = new Vector3(2, 9, -2).scaleInPlace(0.125);

        // Angular speed, in radians
        particleSystem.minAngularSpeed = 0;
        particleSystem.maxAngularSpeed = Math.PI;

        // Speed
        particleSystem.minEmitPower = 1;
        particleSystem.maxEmitPower = 3;
        particleSystem.updateSpeed = 0.025;

        particleSystem.start();
    }
}

export default WaterFountain;
