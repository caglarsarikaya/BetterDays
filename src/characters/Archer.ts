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
    private animations: { [key: string]: BABYLON.AnimationGroup } = {};
    private currentAnimation: BABYLON.AnimationGroup | null = null;
    private boxModel: BABYLON.Mesh | null = null;
    private isMoving: boolean = false;
    
    // Animation file names
    private readonly ANIM_IDLE = 'standing-idle.glb';
    private readonly ANIM_DRAW_ARROW = 'standing draw arrow.glb';
    private readonly ANIM_AIM_OVERDRAW = 'standing-aim-overdraw.glb';
    private readonly ANIM_AIM_RECOIL = 'standing-aim-recoil.glb';
    private readonly ANIM_AIM_WALK_FORWARD = 'standing-aim-walk-forward.glb';
    private readonly ANIM_AIM_WALK_BACK = 'standing-aim-walk-back.glb';
    private readonly ANIM_AIM_WALK_LEFT = 'standing-aim-walk-left.glb';
    private readonly ANIM_AIM_WALK_RIGHT = 'standing-aim-walk-right.glb';
    
    /**
     * Constructor initializes archer-specific properties
     * @param scene The Babylon.js scene
     */
    constructor(scene: BABYLON.Scene) {
        super(scene);
        
        // Hide the base placeholder box
        this.mesh.isVisible = false;
        
        // Create a temporary box model until GLB loads
        this.createBoxModel();
        
        // Load the archer GLB model
        this.loadArcherModel();
        
        console.log('Archer character created');
    }
    
    /**
     * Create a simple box model for the archer as a fallback
     */
    private createBoxModel(): void {
        // Position the character so it's fully visible above the ground
        this.mesh.position.y = 0.5;
        
        // Create body
        const body = BABYLON.MeshBuilder.CreateBox('archerBody', { height: 1, width: 0.5, depth: 0.3 }, this.scene);
        body.position.y = 0.5;
        
        // Create head
        const head = BABYLON.MeshBuilder.CreateBox('archerHead', { size: 0.25 }, this.scene);
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
        const parent = new BABYLON.Mesh('archerParent', this.scene);
        body.parent = parent;
        head.parent = parent;
        leftArm.parent = parent;
        rightArm.parent = parent;
        leftLeg.parent = parent;
        rightLeg.parent = parent;
        
        // Apply materials
        const bodyMaterial = new BABYLON.StandardMaterial('archerBodyMat', this.scene);
        bodyMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.5, 0.1); // Green for archer
        body.material = bodyMaterial;
        
        const headMaterial = new BABYLON.StandardMaterial('archerHeadMat', this.scene);
        headMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.5, 0.3); // Skin tone
        head.material = headMaterial;
        
        const limbMaterial = new BABYLON.StandardMaterial('archerLimbMat', this.scene);
        limbMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.3, 0.1); // Darker green
        leftArm.material = limbMaterial;
        rightArm.material = limbMaterial;
        leftLeg.material = limbMaterial;
        rightLeg.material = limbMaterial;
        
        // Store the box model so we can hide it later
        this.boxModel = parent;
        
        // Use the new parent as the character mesh
        this.mesh = parent;
        
        console.log('Using box archer model as fallback');
    }
    
    /**
     * Load the archer GLB model
     */
    private loadArcherModel(): void {
        // Try different paths to find the GLB model
        const modelFile = 'archer.glb';
        const modelPath = './src/assets/models/archer/';
        
        console.log(`Loading archer model from ${modelPath}${modelFile}`);
        
        BABYLON.SceneLoader.ImportMesh(
            '', // Load all meshes
            modelPath,
            modelFile,
            this.scene,
            (meshes, particleSystems, skeletons) => {
                console.log('GLB model loaded successfully!', meshes.length, 'meshes loaded');
                
                if (meshes.length > 0) {
                    // Hide the box models
                    if (this.boxModel) {
                        this.boxModel.isVisible = false;
                    }
                    this.mesh.isVisible = false;
                    
                    // The first mesh is the root
                    const rootMesh = meshes[0];
                    
                    // Scale the model (GLB models may need scaling)
                    rootMesh.scaling = new BABYLON.Vector3(1, 1, 1);
                    
                    // Position the model so it's fully visible above the ground
                    rootMesh.position.y = 0; // Will adjust this as needed
                    
                    // Use the GLB mesh as the main character mesh
                    this.mesh = rootMesh;
                    
                    // Store skeletons for animations
                    this.skeletons = skeletons;
                    
                    // Mark the model as loaded
                    this.modelLoaded = true;
                    
                    console.log('Using GLB archer model');
                    
                    // Now load animations
                    this.loadAnimations();
                }
            },
            (evt) => {
                // Progress callback
                const loadProgress = (evt.loaded * 100 / evt.total).toFixed(2);
                console.log(`Loading GLB: ${loadProgress}%`);
            },
            (scene, message, exception) => {
                // Error callback
                console.error(`Error loading GLB model: ${message}`, exception);
                console.log('Using box model as fallback');
            }
        );
    }
    
    /**
     * Load all the animation GLB files
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
                const animName = animFile.replace('.glb', '');
                const modelPath = './src/assets/models/archer/';
                
                console.log(`Loading animation: ${animName}`);
                
                BABYLON.SceneLoader.ImportAnimations(
                    "", 
                    modelPath + animFile, 
                    this.scene, 
                    false, 
                    ".gltf", 
                    (scene: BABYLON.Scene) => {
                        // Success callback
                        if (scene.animationGroups && scene.animationGroups.length > 0) {
                            // Store the animation group
                            this.animations[animName] = scene.animationGroups[0];
                            
                            // Rename it for clarity
                            this.animations[animName].name = animName;
                            
                            console.log(`Animation ${animName} loaded successfully`);
                            
                            // If this is the idle animation, start playing it
                            if (animName === 'standing-idle' && !this.currentAnimation) {
                                this.playAnimation('standing-idle', true);
                            }
                            
                            // If all animations are loaded, ensure we're playing the idle animation
                            loadedCount++;
                            if (loadedCount === animationsToLoad.length) {
                                console.log('All animations loaded, playing idle animation');
                                this.playAnimation('standing-idle', true);
                            }
                        }
                        
                        // Increment loaded count
                        console.log(`Loaded ${loadedCount}/${animationsToLoad.length} animations`);
                    },
                    (scene: BABYLON.Scene, message: string, exception?: any) => {
                        // Error callback
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
     * @param loop Whether the animation should loop
     */
    private playAnimation(animationName: string, loop: boolean = true): void {
        if (!this.modelLoaded) {
            console.warn('Cannot play animation - model not loaded');
            return;
        }
        
        if (!this.animations[animationName]) {
            console.warn(`Animation ${animationName} not loaded`);
            return;
        }
        
        // Don't restart the same animation that's already playing
        if (this.currentAnimation && this.currentAnimation.name === animationName) {
            return;
        }
        
        // Stop the current animation if any
        if (this.currentAnimation) {
            this.currentAnimation.stop();
        }
        
        // Start the new animation
        this.animations[animationName].start(loop);
        this.currentAnimation = this.animations[animationName];
        
        console.log(`Playing animation: ${animationName}`);
    }
    
    /**
     * Override the move method to add archer-specific movement animation
     * @param input The input manager providing key states
     */
    public move(input: InputManager): void {
        const direction = input.getMovementDirection();
        const wasMoving = this.isMoving;
        this.isMoving = direction.length() > 0;
        
        // Call the base class move method to update position
        super.move(input);
        
        // Handle walking animations separately 
        // (they will be managed by the update method)
    }
    
    /**
     * Override the update method to add archer-specific behavior
     * @param input The input manager providing key states
     */
    public update(input: InputManager): void {
        // If aiming, move slower
        if (this.isAiming) {
            this.moveSpeed = 0.05; // Slower movement when aiming
        } else {
            this.moveSpeed = 0.1; // Normal movement speed
        }
        
        // Call the base update method for movement
        super.update(input);
        
        // Handle animations based on movement and aiming state
        if (this.modelLoaded && Object.keys(this.animations).length > 0) {
            const direction = input.getMovementDirection();
            const isMoving = direction.length() > 0;
            
            if (this.isAiming) {
                // Aiming animations
                if (direction.z > 0) {
                    // Walking forward while aiming
                    this.playAnimation('standing-aim-walk-forward');
                } else if (direction.z < 0) {
                    // Walking backward while aiming
                    this.playAnimation('standing-aim-walk-back');
                } else if (direction.x < 0) {
                    // Walking left while aiming
                    this.playAnimation('standing-aim-walk-left');
                } else if (direction.x > 0) {
                    // Walking right while aiming
                    this.playAnimation('standing-aim-walk-right');
                } else if (this.currentAnimation?.name !== 'standing-aim-overdraw') {
                    // Standing still while aiming
                    this.playAnimation('standing-aim-overdraw');
                }
            } else {
                // Not aiming, just play idle animation for now
                // We need walking animations without aim
                if (!isMoving && this.currentAnimation?.name !== 'standing-idle') {
                    this.playAnimation('standing-idle');
                }
            }
        }
    }
    
    /**
     * Implement the onRightClick method for the archer (toggle aiming)
     */
    public onRightClick(): void {
        this.isAiming = !this.isAiming;
        console.log(`Archer aiming: ${this.isAiming}`);
        
        // Visual feedback and animation for aiming state
        if (this.isAiming) {
            if (this.modelLoaded && this.animations['standing draw arrow']) {
                // Play draw arrow animation when starting to aim
                this.playAnimation('standing draw arrow', false);
                
                // After a delay, transition to the overdraw animation
                setTimeout(() => {
                    if (this.isAiming && this.animations['standing-aim-overdraw']) {
                        this.playAnimation('standing-aim-overdraw');
                    }
                }, 1000); // Transition after 1 second
            } else {
                // Fallback behavior for box model
                this.mesh.scaling.y = 1.3;
            }
        } else {
            if (this.modelLoaded && this.animations['standing-aim-recoil']) {
                // Play recoil animation when releasing arrow
                this.playAnimation('standing-aim-recoil', false);
                
                // After a delay, transition back to idle
                setTimeout(() => {
                    if (!this.isAiming && this.animations['standing-idle']) {
                        this.playAnimation('standing-idle');
                    }
                }, 500); // Transition after 0.5 seconds
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