/**
 * TypeScript declarations for global Babylon.js library
 * This allows us to use the global BABYLON namespace when loading Babylon.js from CDN
 */

declare namespace BABYLON {
    class Engine {
        constructor(canvas: HTMLCanvasElement, antialias?: boolean);
        runRenderLoop(callback: () => void): void;
        resize(): void;
    }

    class Scene {
        constructor(engine: Engine);
        render(): void;
        clearColor: Color4;
        activeCamera: Camera;
    }

    class Vector3 {
        constructor(x: number, y: number, z: number);
        static Zero(): Vector3;
        
        x: number;
        y: number;
        z: number;
        
        length(): number;
        normalize(): Vector3;
    }

    class Color4 {
        constructor(r: number, g: number, b: number, a: number);
    }

    class FreeCamera extends Camera {
        constructor(name: string, position: Vector3, scene: Scene);
        setTarget(target: Vector3): void;
        attachControl(canvas: HTMLCanvasElement, noPreventDefault?: boolean): void;
    }

    class Camera {
        constructor(name: string, position: Vector3, scene: Scene);
    }

    class HemisphericLight {
        constructor(name: string, direction: Vector3, scene: Scene);
        intensity: number;
    }
} 