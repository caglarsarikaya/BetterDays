/**
 * BaseCharacter Class
 * 
 * Abstract class that serves as the foundation for all playable characters.
 * Handles common functionality like movement and mesh management.
 * 
 * Follows the SOLID principles:
 * - Single Responsibility: Handles only character-related functionality
 * - Open/Closed: Can be extended without modification
 * - Liskov Substitution: Derived classes can be used wherever BaseCharacter is used
 * - Interface Segregation: Provides only methods needed by characters
 * - Dependency Inversion: Depends on abstractions (Scene) not concrete implementations
 */

import { InputManager } from '../input/InputManager.js';

/**
 * Abstract base class for all playable characters
 */
export abstract class BaseCharacter {
    protected mesh: BABYLON.Mesh;
    protected scene: BABYLON.Scene;
    protected moveSpeed: number = 0.1;
    
    /**
     * Constructor initializes the character with a basic box mesh
     * @param scene The Babylon.js scene
     */
    constructor(scene: BABYLON.Scene) {
        this.scene = scene;
        // Create a simple box as placeholder
        this.mesh = BABYLON.MeshBuilder.CreateBox('player', { size: 1 }, scene);
        
        // Raise the box slightly above the ground (will be replaced with actual character model)
        this.mesh.position.y = 0.5;
        
        console.log('BaseCharacter created with placeholder box mesh');
    }
    
    /**
     * Update method called every frame to handle movement and other logic
     * @param input The input manager providing key states
     */
    public update(input: InputManager): void {
        // Handle movement based on WASD keys
        this.move(input);
        
        // Additional update logic can be added by derived classes
    }
    
    /**
     * Move the character based on input
     * @param input The input manager providing key states
     */
    public move(input: InputManager): void {
        const direction = input.getMovementDirection();
        
        if (direction.length() > 0) {
            // Apply movement in x and z directions
            this.mesh.position.x += direction.x * this.moveSpeed;
            this.mesh.position.z += direction.z * this.moveSpeed;
            
            // Log movement for debugging
            console.log(`Character moved to: x=${this.mesh.position.x.toFixed(2)}, z=${this.mesh.position.z.toFixed(2)}`);
        }
    }
    
    /**
     * Handle right-click action - abstract method to be implemented by derived classes
     */
    public abstract onRightClick(): void;
    
    /**
     * Get the character's mesh
     * @returns The character's mesh
     */
    public getMesh(): BABYLON.Mesh {
        return this.mesh;
    }
    
    /**
     * Get the character's position
     * @returns The character's position vector
     */
    public getPosition(): BABYLON.Vector3 {
        return this.mesh.position;
    }
} 