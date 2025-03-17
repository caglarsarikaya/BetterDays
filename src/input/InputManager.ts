/**
 * InputManager Class
 * 
 * Handles user input for the game, including keyboard (WASD) and mouse controls.
 * 
 * This follows the Single Responsibility Principle by encapsulating all input handling
 * in a single class.
 */

/**
 * InputManager class that handles keyboard and mouse input
 */
export class InputManager {
    // Will be expanded in Task 1.5 to track key states
    private keys: { [key: string]: boolean } = {};
    
    /**
     * Constructor initializes input listeners
     */
    constructor() {
        // Set up keyboard event listeners
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            console.log(`Key down: ${e.key}`);
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        
        console.log('InputManager initialized with WASD controls');
    }
    
    /**
     * Check if a specific key is currently pressed down
     * @param key The key to check (should be lowercase)
     * @returns True if the key is pressed, false otherwise
     */
    public isKeyDown(key: string): boolean {
        return !!this.keys[key.toLowerCase()];
    }
    
    /**
     * Gets the current movement direction based on WASD keys
     * @returns Vector3 representing the direction of movement
     */
    public getMovementDirection(): BABYLON.Vector3 {
        const direction = new BABYLON.Vector3(0, 0, 0);
        
        if (this.isKeyDown('w')) direction.z += 1;
        if (this.isKeyDown('s')) direction.z -= 1;
        if (this.isKeyDown('a')) direction.x -= 1;
        if (this.isKeyDown('d')) direction.x += 1;
        
        // Normalize only if there's some movement
        if (direction.length() > 0) {
            direction.normalize();
        }
        
        return direction;
    }
} 