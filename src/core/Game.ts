/**
 * Game Class
 * 
 * Main class for the BetterDays game that handles the core game loop, scene management,
 * and other core functionality.
 * 
 * This follows the Single Responsibility Principle by encapsulating all game loop related
 * functionality in a single class.
 */

// Import the InputManager and TempCharacter
import { InputManager } from '../input/InputManager.js';
import { TempCharacter } from '../characters/TempCharacter.js';

/**
 * Main Game class that manages the core game loop and scene setup
 */
export class Game {
    private engine: BABYLON.Engine;
    private scene: BABYLON.Scene;
    private inputManager: InputManager;
    private character: TempCharacter;
    
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
        
        // Create the character
        this.character = new TempCharacter(this.scene);
        
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
     * Creates a camera for the scene that follows the character
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
     * Creates a temporary ground for the character to stand on
     */
    private createGround(): void {
        // For the demo, we'll just create a simple ground
        const ground = BABYLON.MeshBuilder.CreateBox('ground', { size: 20 }, this.scene);
        ground.scaling.y = 0.1;
        ground.position.y = -0.05;
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