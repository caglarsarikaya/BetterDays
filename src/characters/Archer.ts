/**
 * Archer Class
 * 
 * First implemented playable character with bow and arrow abilities.
 * Specializes the BaseCharacter with archer-specific functionality.
 * 
 * SOLID principles:
 * - Single Responsibility: Handles only archer-specific behavior
 * - Open/Closed: Extends BaseCharacter without modifying it
 * - Liskov Substitution: Can be used wherever BaseCharacter is used
 * - Interface Segregation: Implements only necessary methods
 * - Dependency Inversion: Depends on abstractions not concretions
 */

import { BaseCharacter } from './BaseCharacter.js';
import { InputManager } from '../input/InputManager.js';

/**
 * Archer class representing a bow-wielding character
 */
export class Archer extends BaseCharacter {
    private isAiming: boolean = false;
    private modelLoaded: boolean = false;
    private skeletons: any[] = [];
    private loadAttempted: boolean = false;
    private animations: { [key: string]: any } = {};
    private currentAnimationName: string = 'idle';
    
    // Animation file names
    private readonly ANIM_IDLE = 'standing-idle.fbx';
    private readonly ANIM_DRAW_ARROW = 'standing draw arrow.fbx';
    private readonly ANIM_AIM_OVERDRAW = 'standing-aim-overdraw.fbx';
    private readonly ANIM_AIM_RECOIL = 'standing-aim-recoil.fbx';
    private readonly ANIM_AIM_WALK_FORWARD = 'standing-aim-walk-forward.fbx';
    private readonly ANIM_AIM_WALK_BACK = 'standing-aim-walk-back.fbx';
    private readonly ANIM_AIM_WALK_LEFT = 'standing-aim-walk-left.fbx';
    private readonly ANIM_AIM_WALK_RIGHT = 'standing-aim-walk-right.fbx';
    
    /**
     * Constructor initializes archer-specific properties
     * @param scene The Babylon.js scene
     */
    constructor(scene: BABYLON.Scene) {
        super(scene);
        
        // Differentiate the archer from other characters with a distinctive color
        const material = new BABYLON.StandardMaterial('archerMaterial', scene);
        material.diffuseColor = new BABYLON.Color3(0.2, 0.8, 0.2); // Green for archer
        this.mesh.material = material;
        
        // Load the Mixamo archer model
        this.loadArcherModel();
        
        console.log('Archer character created');
    }
    
    /**
     * Load the Mixamo archer model
     */
    private loadArcherModel(): void {
        try {
            // Get absolute URL base from window location
            const baseUrl = window.location.origin + window.location.pathname;
            // Remove index.html if present
            const cleanBaseUrl = baseUrl.endsWith('index.html') 
                ? baseUrl.substring(0, baseUrl.length - 10) // Remove 'index.html'
                : baseUrl;
            
            // Try a couple of different path formats to handle different server configurations
            const modelFile = 'archer.fbx';
            const attemptedPaths: string[] = [];

            // Attempt 1: Relative path from current directory
            const relativeModelUrl = './src/assets/models/archer/';
            attemptedPaths.push(relativeModelUrl + modelFile);
            console.log(`[1] Attempting to load model from: ${relativeModelUrl}${modelFile}`);
            
            // Try to load with relative path
            this.tryLoadModel(relativeModelUrl, modelFile, (success, meshes, skeletons) => {
                if (success && meshes && skeletons) {
                    this.handleModelLoaded(meshes, skeletons);
                    this.loadAnimations();
                } else {
                    // Attempt 2: Absolute path from server root
                    const absoluteModelUrl = '/src/assets/models/archer/';
                    attemptedPaths.push(absoluteModelUrl + modelFile);
                    console.log(`[2] Attempting to load model from absolute path: ${absoluteModelUrl}${modelFile}`);
                    
                    this.tryLoadModel(absoluteModelUrl, modelFile, (success2, meshes2, skeletons2) => {
                        if (success2 && meshes2 && skeletons2) {
                            this.handleModelLoaded(meshes2, skeletons2);
                            this.loadAnimations();
                        } else {
                            // Attempt 3: Full URL including origin
                            const fullModelUrl = cleanBaseUrl + 'src/assets/models/archer/';
                            attemptedPaths.push(fullModelUrl + modelFile);
                            console.log(`[3] Attempting to load model with full URL: ${fullModelUrl}${modelFile}`);
                            
                            this.tryLoadModel(fullModelUrl, modelFile, (success3, meshes3, skeletons3) => {
                                if (success3 && meshes3 && skeletons3) {
                                    this.handleModelLoaded(meshes3, skeletons3);
                                    this.loadAnimations();
                                } else {
                                    console.error(`All attempted paths failed:`, attemptedPaths);
                                    console.error(`Browser URL: ${window.location.href}`);
                                    console.error(`Check that the file exists and permissions are correct`);
                                    this.loadFallbackModel();
                                }
                            });
                        }
                    });
                }
            });
        } catch (error) {
            console.error('Exception during model loading setup:', error);
            this.loadFallbackModel();
        }
    }
    
    /**
     * Attempt to load a model from the given URL
     */
    private tryLoadModel(
        modelUrl: string, 
        modelFile: string,
        callback: (success: boolean, meshes?: BABYLON.Mesh[], skeletons?: any[]) => void
    ): void {
        BABYLON.SceneLoader.ImportMesh(
            '', // Load all meshes
            modelUrl,
            modelFile,
            this.scene,
            // Success callback
            (meshes, particleSystems, skeletons) => {
                console.log(`Successfully loaded model from ${modelUrl}${modelFile}`);
                callback(true, meshes, skeletons);
            },
            // Progress callback
            (evt) => {
                const loadingProgress = (evt.loaded * 100 / evt.total).toFixed(2);
                console.log(`Loading from ${modelUrl}: ${loadingProgress}%`);
            },
            // Error callback
            (scene, message, exception) => {
                console.error(`Error loading model from ${modelUrl}${modelFile}: ${message}`, exception);
                callback(false);
            }
        );
    }
    
    /**
     * Load animations for the archer
     */
    private loadAnimations(): void {
        if (!this.modelLoaded) {
            console.warn('Cannot load animations - model not loaded yet');
            return;
        }
        
        console.log('Loading archer animations...');
        
        // Define all animations to load
        const animationsToLoad = [
            this.ANIM_IDLE,
            this.ANIM_DRAW_ARROW,
            this.ANIM_AIM_OVERDRAW,
            this.ANIM_AIM_RECOIL,
            this.ANIM_AIM_WALK_FORWARD,
            this.ANIM_AIM_WALK_BACK,
            this.ANIM_AIM_WALK_LEFT,
            this.ANIM_AIM_WALK_RIGHT
        ];
        
        // Count loaded animations to know when all are loaded
        let loadedCount = 0;
        
        // For each animation file, load it
        animationsToLoad.forEach(animFile => {
            try {
                const animName = animFile.replace('.fbx', '');
                const modelUrl = './src/assets/models/archer/';
                
                console.log(`Loading animation: ${animName}`);
                
                BABYLON.SceneLoader.ImportMesh(
                    '', // Load all meshes
                    modelUrl,
                    animFile,
                    this.scene,
                    (meshes, particleSystems, skeletons) => {
                        if (skeletons.length > 0 && skeletons[0].animations.length > 0) {
                            // Store the animation
                            this.animations[animName] = skeletons[0].animations[0];
                            console.log(`Animation ${animName} loaded successfully`);
                            
                            // If this is the idle animation, start playing it
                            if (animName === 'standing-idle' && this.skeletons.length > 0) {
                                this.playAnimation('standing-idle');
                            }
                        }
                        
                        // Clean up meshes from animation files
                        meshes.forEach(mesh => {
                            // Keep only animations, not the meshes
                            mesh.dispose();
                        });
                        
                        // Increment loaded count
                        loadedCount++;
                        console.log(`Loaded ${loadedCount}/${animationsToLoad.length} animations`);
                    },
                    // Progress callback - use undefined instead of null
                    undefined,
                    // Error callback
                    (scene, message, exception) => {
                        console.error(`Error loading animation ${animFile}: ${message}`, exception);
                        loadedCount++;
                    }
                );
            } catch (error) {
                console.error(`Exception loading animation ${animFile}:`, error);
                loadedCount++;
            }
        });
    }
    
    /**
     * Play a specific animation
     * @param animationName The name of the animation to play
     */
    private playAnimation(animationName: string): void {
        if (!this.modelLoaded || this.skeletons.length === 0) {
            console.warn('Cannot play animation - model or skeleton not loaded');
            return;
        }
        
        if (!this.animations[animationName]) {
            console.warn(`Animation ${animationName} not loaded`);
            return;
        }
        
        // Start the animation
        this.scene.beginAnimation(this.skeletons[0], 0, 100, true, 1.0);
        this.currentAnimationName = animationName;
        console.log(`Playing animation: ${animationName}`);
    }
    
    /**
     * Load a fallback model from the Babylon.js assets server
     */
    private loadFallbackModel(): void {
        if (this.loadAttempted) {
            console.log('Already attempted to load fallback model, keeping box placeholder');
            return;
        }
        
        this.loadAttempted = true;
        console.log('Attempting to load fallback model from Babylon.js assets server');
        
        // Use a simple box with improved materials as fallback
        const boxSize = 0.5;
        
        // Create body
        const body = BABYLON.MeshBuilder.CreateBox('archerBody', { height: 1, width: 0.5, depth: 0.3 }, this.scene);
        body.position.y = 0.5;
        
        // Create head
        const head = BABYLON.MeshBuilder.CreateBox('archerHead', { size: boxSize * 0.5 }, this.scene);
        head.position.y = 1.25;
        
        // Create arms
        const leftArm = BABYLON.MeshBuilder.CreateBox('archerLeftArm', { height: 0.8, width: 0.2, depth: 0.2 }, this.scene);
        leftArm.position.x = -0.35;
        leftArm.position.y = 0.7;
        
        const rightArm = BABYLON.MeshBuilder.CreateBox('archerRightArm', { height: 0.8, width: 0.2, depth: 0.2 }, this.scene);
        rightArm.position.x = 0.35;
        rightArm.position.y = 0.7;
        
        // Create legs
        const leftLeg = BABYLON.MeshBuilder.CreateBox('archerLeftLeg', { height: 0.8, width: 0.2, depth: 0.2 }, this.scene);
        leftLeg.position.x = -0.2;
        leftLeg.position.y = 0.1;
        
        const rightLeg = BABYLON.MeshBuilder.CreateBox('archerRightLeg', { height: 0.8, width: 0.2, depth: 0.2 }, this.scene);
        rightLeg.position.x = 0.2;
        rightLeg.position.y = 0.1;
        
        // Create a parent mesh to group all parts
        const parent = new BABYLON.Mesh('archerFallback', this.scene);
        body.parent = parent;
        head.parent = parent;
        leftArm.parent = parent;
        rightArm.parent = parent;
        leftLeg.parent = parent;
        rightLeg.parent = parent;
        
        // Apply materials
        const bodyMaterial = new BABYLON.StandardMaterial('archerBodyMat', this.scene);
        bodyMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.5, 0.1);
        body.material = bodyMaterial;
        
        const headMaterial = new BABYLON.StandardMaterial('archerHeadMat', this.scene);
        headMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.5, 0.3);
        head.material = headMaterial;
        
        const limbMaterial = new BABYLON.StandardMaterial('archerLimbMat', this.scene);
        limbMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.3, 0.1);
        leftArm.material = limbMaterial;
        rightArm.material = limbMaterial;
        leftLeg.material = limbMaterial;
        rightLeg.material = limbMaterial;
        
        // Hide the placeholder box
        this.mesh.isVisible = false;
        // Use the new parent as the character mesh
        this.mesh = parent;
        
        // Mark as loaded with our fallback model
        this.modelLoaded = true;
        console.log('Using fallback archer model');
    }
    
    /**
     * Handle successful model loading
     */
    private handleModelLoaded(meshes: BABYLON.Mesh[], skeletons: any[]): void {
        console.log('Archer model loaded successfully');
        
        // Hide the placeholder box
        this.mesh.isVisible = false;
        
        // Store the loaded meshes and skeletons
        if (meshes.length > 0) {
            // The first mesh is the root
            this.mesh = meshes[0] as BABYLON.Mesh;
            
            // Scale the model (Mixamo models are usually too large)
            this.mesh.scaling = new BABYLON.Vector3(0.01, 0.01, 0.01);
            
            // Position the model
            this.mesh.position.y = 0; // Place on the ground
            
            // Store skeletons for animations
            this.skeletons = skeletons;
            
            // Mark as loaded
            this.modelLoaded = true;
            
            console.log(`Loaded ${meshes.length} meshes and ${skeletons.length} skeletons`);
        } else {
            console.warn('Model loaded but no meshes were found');
            // Use fallback model if no meshes were loaded
            this.loadFallbackModel();
        }
    }
    
    /**
     * Override the update method to add archer-specific behavior
     * @param input The input manager providing key states
     */
    public update(input: InputManager): void {
        // If aiming, move slower
        if (this.isAiming) {
            this.moveSpeed = 0.05; // Slower movement when aiming
            
            // When aiming, choose the appropriate aim-walk animation based on movement direction
            if (this.modelLoaded && Object.keys(this.animations).length > 0) {
                const direction = input.getMovementDirection();
                if (direction.z > 0) {
                    // Walking forward while aiming
                    if (this.currentAnimationName !== 'standing-aim-walk-forward') {
                        this.playAnimation('standing-aim-walk-forward');
                    }
                } else if (direction.z < 0) {
                    // Walking backward while aiming
                    if (this.currentAnimationName !== 'standing-aim-walk-back') {
                        this.playAnimation('standing-aim-walk-back');
                    }
                } else if (direction.x < 0) {
                    // Walking left while aiming
                    if (this.currentAnimationName !== 'standing-aim-walk-left') {
                        this.playAnimation('standing-aim-walk-left');
                    }
                } else if (direction.x > 0) {
                    // Walking right while aiming
                    if (this.currentAnimationName !== 'standing-aim-walk-right') {
                        this.playAnimation('standing-aim-walk-right');
                    }
                } else if (this.currentAnimationName !== 'standing-aim-overdraw') {
                    // Standing still while aiming
                    this.playAnimation('standing-aim-overdraw');
                }
            }
        } else {
            this.moveSpeed = 0.1; // Normal movement speed
            
            // When not aiming, play idle animation if available
            if (this.modelLoaded && this.currentAnimationName !== 'standing-idle' && 
                this.animations['standing-idle']) {
                this.playAnimation('standing-idle');
            }
        }
        
        // Call the base update method
        super.update(input);
    }
    
    /**
     * Implement the onRightClick method for the archer (toggle aiming)
     */
    public onRightClick(): void {
        this.isAiming = !this.isAiming;
        console.log(`Archer aiming: ${this.isAiming}`);
        
        // Visual feedback and animation for aiming state
        if (this.isAiming) {
            if (this.modelLoaded) {
                // Play draw arrow animation when starting to aim
                if (this.animations['standing draw arrow']) {
                    this.playAnimation('standing draw arrow');
                    // After a delay, transition to the overdraw animation
                    setTimeout(() => {
                        if (this.isAiming && this.animations['standing-aim-overdraw']) {
                            this.playAnimation('standing-aim-overdraw');
                        }
                    }, 1000); // Transition after 1 second
                }
            } else {
                // Fallback behavior for box model
                this.mesh.scaling.y = 1.3;
            }
        } else {
            if (this.modelLoaded) {
                // Play recoil animation when releasing arrow
                if (this.animations['standing-aim-recoil']) {
                    this.playAnimation('standing-aim-recoil');
                    // After a delay, transition back to idle
                    setTimeout(() => {
                        if (!this.isAiming && this.animations['standing-idle']) {
                            this.playAnimation('standing-idle');
                        }
                    }, 500); // Transition after 0.5 seconds
                }
            } else {
                // Fallback behavior for box model
                this.mesh.scaling.y = 1.0;
            }
        }
    }
    
    /**
     * Check if the archer is currently aiming
     * @returns True if aiming, false otherwise
     */
    public isInAimingMode(): boolean {
        return this.isAiming;
    }
} 