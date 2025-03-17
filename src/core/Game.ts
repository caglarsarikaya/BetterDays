/**
 * Game Class
 * 
 * Main class for the BetterDays game that handles the core game loop, scene management,
 * and other core functionality.
 * 
 * This follows the Single Responsibility Principle by encapsulating all game loop related
 * functionality in a single class.
 */

// Import the InputManager
import { InputManager } from '../input/InputManager.js';

/**
 * Main Game class that manages the core game loop and scene setup
 */
export class Game {
    private engine: BABYLON.Engine;
    private scene: BABYLON.Scene;
    private inputManager: InputManager;
    
    /**
     * Constructor initializes the game engine, scene, and render loop
     * @param canvas The HTML canvas element to render the game on
     */
    constructor(canvas: HTMLCanvasElement) {
        // Initialize the Babylon.js engine
        this.engine = new BABYLON.Engine(canvas, true);
        
        // Create a new scene
        this.scene = new BABYLON.Scene(this.engine);
        
        // Set scene clear color (background color)
        this.scene.clearColor = new BABYLON.Color4(0.2, 0.2, 0.3, 1);
        
        // Initialize input manager
        this.inputManager = new InputManager();
        
        // Add basic camera for development
        this.createCamera(canvas);
        
        // Add basic light
        this.createLight();
        
        // Add a placeholder cube to demonstrate WASD movement
        this.createDemoBox();
        
        // Start the render loop
        this.startRenderLoop();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }
    
    /**
     * Creates a camera for the scene
     * @param canvas The HTML canvas element for camera controls
     */
    private createCamera(canvas: HTMLCanvasElement): void {
        const camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 5, -10), this.scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, true);
    }
    
    /**
     * Creates basic lighting for the scene
     */
    private createLight(): void {
        const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;
    }
    
    /**
     * Creates a demo box to demonstrate WASD movement
     */
    private createDemoBox(): void {
        // For the demo, we'll need to add the Box definition to our babylon.d.ts file
        // But for now, we'll just console log that this would create a box
        console.log('Demo box would be created here - will be expanded in future tasks');
    }
    
    /**
     * Starts the render loop to continuously render the scene
     */
    private startRenderLoop(): void {
        this.engine.runRenderLoop(() => {
            // Process input
            const movementDir = this.inputManager.getMovementDirection();
            console.log(`Movement direction: x=${movementDir.x}, z=${movementDir.z}`);
            
            // Render the scene
            this.scene.render();
        });
    }
    
    /**
     * Returns the current scene
     */
    public getScene(): BABYLON.Scene {
        return this.scene;
    }
} 