/**
 * BetterDays Game - Main Entry Point
 * 
 * This file serves as the entry point for the BetterDays game.
 * It initializes the game engine, creates the scene, and starts the game loop.
 */

import * as BABYLON from '@babylonjs/core';

/**
 * Main class for the BetterDays game
 * Follows SOLID principles by having a single responsibility of initializing the game
 */
class BetterDaysGame {
    private canvas: HTMLCanvasElement;
    private engine: BABYLON.Engine;
    private scene: BABYLON.Scene;

    /**
     * Constructor initializes the game engine and scene
     */
    constructor() {
        // Get the canvas element from the DOM
        this.canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
        
        // Initialize the Babylon.js engine
        this.engine = new BABYLON.Engine(this.canvas, true);
        
        // Create a new scene
        this.scene = new BABYLON.Scene(this.engine);
        
        // Configure scene basics
        this.configureScene();
        
        // Start the render loop
        this.startRenderLoop();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }

    /**
     * Configure basic scene settings
     */
    private configureScene(): void {
        // Set scene clear color (background color)
        this.scene.clearColor = new BABYLON.Color4(0.2, 0.2, 0.3, 1);
        
        // Add a basic camera for development
        const camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 5, -10), this.scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(this.canvas, true);
        
        // Add basic light
        const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;
    }

    /**
     * Start the render loop
     */
    private startRenderLoop(): void {
        // Run the render loop
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }
}

// Initialize the game when the window loads
window.addEventListener('DOMContentLoaded', () => {
    new BetterDaysGame();
}); 