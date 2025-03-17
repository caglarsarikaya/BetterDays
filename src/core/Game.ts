/**
 * Game Class
 * 
 * Main class for the BetterDays game that handles the core game loop, scene management,
 * and other core functionality.
 * 
 * This follows the Single Responsibility Principle by encapsulating all game loop related
 * functionality in a single class.
 */

// Import the InputManager and Archer
import { InputManager } from '../input/InputManager.js';
import { Archer } from '../characters/Archer.js';

/**
 * Main Game class that manages the core game loop and scene setup
 */
export class Game {
    private engine: BABYLON.Engine;
    private scene: BABYLON.Scene;
    private inputManager: InputManager;
    private character: Archer;
    
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
        
        // Create a temporary ground for the character to stand on
        this.createGround();
        
        // Add basic light
        this.createLight();
        
        // Register FBX plugin if needed
        this.registerPlugins();
        
        // Create the archer character
        this.character = new Archer(this.scene);
        
        // Add camera that follows the character
        this.createCamera(canvas);
        
        // Setup right-click handling
        this.setupRightClickHandler();
        
        // Start the render loop
        this.startRenderLoop();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }
    
    /**
     * Register plugins required for the game
     */
    private registerPlugins(): void {
        // Check if SceneLoader is defined before trying to use it
        if (BABYLON && BABYLON.SceneLoader) {
            // Log what file extensions are supported
            console.log("Supported file extensions:", 
                BABYLON.SceneLoader.RegisteredPlugins ? 
                Object.keys(BABYLON.SceneLoader.RegisteredPlugins) : 
                "No registered plugins found");
        } else {
            console.error("BABYLON.SceneLoader is not available. Make sure the loaders script is included.");
        }
    }
    
    /**
     * Creates a camera for the scene that follows the character
     * @param canvas The HTML canvas element for camera controls
     */
    private createCamera(canvas: HTMLCanvasElement): void {
        // Position the camera to view the character model better
        const camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 1.7, -5), this.scene);
        camera.setTarget(new BABYLON.Vector3(0, 1, 0)); // Look slightly upward to the character's head
        camera.attachControl(canvas, true);
    }
    
    /**
     * Creates basic lighting for the scene
     */
    private createLight(): void {
        // Main directional light (like the sun)
        const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;
        
        // Add a secondary light from the front to better illuminate the character
        const frontLight = new BABYLON.HemisphericLight('frontLight', new BABYLON.Vector3(0, 0, 1), this.scene);
        frontLight.intensity = 0.3;
    }
    
    /**
     * Creates a temporary ground for the character to stand on
     */
    private createGround(): void {
        // For the demo, we'll just create a simple ground
        const ground = BABYLON.MeshBuilder.CreateBox('ground', { size: 20 }, this.scene);
        ground.scaling.y = 0.1;
        ground.position.y = -0.05;
        
        // Give ground a material
        const groundMaterial = new BABYLON.StandardMaterial('groundMaterial', this.scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5); // Gray
        ground.material = groundMaterial;
    }
    
    /**
     * Sets up event listener for right-click to trigger character's ability
     */
    private setupRightClickHandler(): void {
        this.scene.onPointerObservable.add((pointerInfo) => {
            if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN && pointerInfo.event.button === 2) {
                this.character.onRightClick();
            }
        });
    }
    
    /**
     * Starts the render loop to continuously render the scene
     */
    private startRenderLoop(): void {
        this.engine.runRenderLoop(() => {
            // Update character
            this.character.update(this.inputManager);
            
            // Display aiming status
            if (this.character.isInAimingMode()) {
                console.log('Archer is in aiming mode - ready to fire');
            }
            
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