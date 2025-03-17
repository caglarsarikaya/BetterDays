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

    enum PointerEventTypes {
        POINTERDOWN,
        POINTERUP,
        POINTERMOVE
    }

    interface PointerInfo {
        type: PointerEventTypes;
        event: PointerEvent;
    }

    class Observable<T> {
        add(callback: (eventData: T) => void): void;
    }

    class Scene {
        constructor(engine: Engine);
        render(): void;
        clearColor: Color4;
        activeCamera: Camera;
        onPointerObservable: Observable<PointerInfo>;
    }

    class Vector3 {
        constructor(x: number, y: number, z: number);
        static Zero(): Vector3;
        
        x: number;
        y: number;
        z: number;
        
        length(): number;
        normalize(): Vector3;
        add(otherVector: Vector3): Vector3;
        subtract(otherVector: Vector3): Vector3;
        scale(scale: number): Vector3;
        addInPlace(otherVector: Vector3): Vector3;
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

    class Mesh {
        position: Vector3;
        rotation: Vector3;
        scaling: Vector3;
        constructor(name: string, scene: Scene);
        static CreateBox(name: string, options: { size: number }, scene: Scene): Mesh;
    }

    interface MeshBuilder {
        CreateBox(name: string, options: { size: number }, scene: Scene): Mesh;
    }

    const MeshBuilder: MeshBuilder;
} 