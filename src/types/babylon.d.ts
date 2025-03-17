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
        
        // Mesh management
        meshes: Mesh[];
        
        // Animation related properties
        animationGroups: AnimationGroup[];
        
        // Animation related methods
        beginAnimation(target: any, from: number, to: number, loop?: boolean, speedRatio?: number, onAnimationEnd?: () => void): void;
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

    class Color3 {
        constructor(r: number, g: number, b: number);
        r: number;
        g: number;
        b: number;
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

    class Material {
        constructor(name: string, scene: Scene);
    }

    class StandardMaterial extends Material {
        constructor(name: string, scene: Scene);
        diffuseColor: Color3;
    }

    interface BoxOptions {
        size?: number;
        width?: number;
        height?: number;
        depth?: number;
    }

    interface GroundOptions {
        width?: number;
        height?: number;
    }

    class Mesh {
        position: Vector3;
        rotation: Vector3;
        scaling: Vector3;
        material: Material;
        isVisible: boolean;
        parent: Mesh | null;
        name: string;
        constructor(name: string, scene: Scene);
        static CreateBox(name: string, options: BoxOptions, scene: Scene): Mesh;
        
        // Disposal methods
        dispose(): void;
    }

    interface MeshBuilder {
        CreateBox(name: string, options: BoxOptions, scene: Scene): Mesh;
        CreateGround(name: string, options: GroundOptions, scene: Scene): Mesh;
    }

    const MeshBuilder: MeshBuilder;

    interface RegisteredPlugin {
        plugin: any;
        isBinary: boolean;
    }

    /**
     * Represents an animation group that can be played or stopped
     */
    class AnimationGroup {
        name: string;
        
        /**
         * Start the animation group
         * @param loop Whether the animation should loop
         */
        start(loop?: boolean): void;
        
        /**
         * Stop the animation group
         */
        stop(): void;
    }

    class SceneLoader {
        static ImportMesh(
            meshNames: string | string[] | null, 
            rootUrl: string, 
            sceneFilename: string, 
            scene: Scene, 
            onSuccess?: (meshes: Mesh[], particleSystems: any[], skeletons: any[]) => void, 
            onProgress?: (event: { loaded: number; total: number }) => void, 
            onError?: (scene: Scene, message: string, exception?: any) => void
        ): void;
        
        static ImportAnimations(
            rootUrl: string,
            sceneFilename: string,
            scene: Scene,
            overwriteAnimations: boolean,
            extension?: string,
            onSuccess?: (scene: Scene) => void,
            onError?: (scene: Scene, message: string, exception?: any) => void
        ): void;
        
        static RegisteredPlugins?: { [extension: string]: RegisteredPlugin };
    }
} 