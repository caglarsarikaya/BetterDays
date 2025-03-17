## **Combat Game Development Milestones Document**

### **Overview**
- **Game Type:** 3D survival-combat game with realistic visuals.
- **Tech Stack:** TypeScript, Babylon.js, Mixamo for character models/animations.
- **Core Features:** 
  - Playable characters (Archer first, Warrior/Wizard later) with unique combat styles.
  - Enemies (Goblin first, expandable later).
  - WASD for movement (shared), mouse right-click overridden per character (e.g., Archer aims).
  - Realistic map, lighting, and physics.
- **Goal:** Build incrementally, starting with Archer vs. Goblin, then scale with OOP.

---

### **Milestone 1: Project Setup & Core Systems**
*Purpose: Establish a scalable foundation with OOP principles.*

- **Task 1.1: Initialize TypeScript Project**  
  - **You Provide:** Run `npm init`, install TypeScript (`npm i typescript --save-dev`), and create `tsconfig.json`.  
  - **Cursor Codes:** Basic `tsconfig.json` setup for Babylon.js (e.g., `"target": "ES6"`, `"module": "commonjs"`).  
  - **Verify:** `tsc` compiles without errors.

- **Task 1.2: Install Babylon.js**  
  - **You Provide:** Run `npm i @babylonjs/core`.  
  - **Cursor Codes:** Basic scene setup in `src/main.ts` (engine, scene, empty render loop).  
  - **Verify:** Blank Babylon.js canvas renders in browser.

- **Task 1.3: Define Folder Structure (SOLID Principles)**  
  - **You Provide:** Create folders manually.  
  - **Cursor Codes:** Comments in each folder explaining purpose (e.g., `// characters/: Character classes and logic`).  
    ```
    src/
      ├── characters/       # BaseCharacter class + Archer, Warrior, etc.
      ├── enemies/          # BaseEnemy class + Goblin, etc.
      ├── core/             # Game loop, scene setup
      ├── input/            # WASD + mouse controls
      ├── environment/      # Map, lighting
      ├── combat/           # Hit detection, damage
      ├── ui/               # HUD, menus
      ├── assets/           # Mixamo models, textures
      └── main.ts           # Entry point
    ```
  - **Verify:** Folders exist with comments.

- **Task 1.4: Basic Game Loop**  
  - **You Provide:** `src/core/Game.ts` with empty class.  
  - **Cursor Codes:** Game class with Babylon.js engine, scene, and render loop.  
    ```ts
    import * as BABYLON from '@babylonjs/core';
    export class Game {
      private engine: BABYLON.Engine;
      private scene: BABYLON.Scene;
      constructor(canvas: HTMLCanvasElement) {
        this.engine = new BABYLON.Engine(canvas, true);
        this.scene = new BABYLON.Scene(this.engine);
        this.engine.runRenderLoop(() => this.scene.render());
      }
    }
    ```
  - **Verify:** Scene renders (black screen) in browser.

- **Task 1.5: Base Input System (WASD)**  
  - **You Provide:** `src/input/InputManager.ts` with empty class.  
  - **Cursor Codes:** Basic WASD movement detection (no character yet).  
    ```ts
    export class InputManager {
      private keys: { [key: string]: boolean } = {};
      constructor() {
        window.addEventListener('keydown', (e) => this.keys[e.key] = true);
        window.addEventListener('keyup', (e) => this.keys[e.key] = false);
      }
      public isKeyDown(key: string): boolean {
        return !!this.keys[key];
      }
    }
    ```
  - **Verify:** Console logs WASD key presses.

✅ **Approval Checkpoint:** Project compiles, Babylon.js renders a blank scene, and WASD inputs are detected.

---

### **Milestone 2: Archer Character Foundation**
*Purpose: Implement the Archer as the first playable character with Mixamo assets.*

- **Task 2.1: Base Character Class (OOP)**  
  - **You Provide:** `src/characters/BaseCharacter.ts` with empty class.  
  - **Cursor Codes:** Abstract class with position, movement, and overridable right-click method.  
    ```ts
    import * as BABYLON from '@babylonjs/core';
    export abstract class BaseCharacter {
      protected mesh: BABYLON.Mesh;
      protected scene: BABYLON.Scene;
      constructor(scene: BABYLON.Scene) {
        this.scene = scene;
        this.mesh = BABYLON.MeshBuilder.CreateBox('player', { size: 1 }, scene); // Placeholder
      }
      public move(input: InputManager): void {
        const speed = 0.1;
        if (input.isKeyDown('w')) this.mesh.position.z += speed;
        if (input.isKeyDown('s')) this.mesh.position.z -= speed;
        if (input.isKeyDown('a')) this.mesh.position.x -= speed;
        if (input.isKeyDown('d')) this.mesh.position.x += speed;
      }
      public abstract onRightClick(): void; // Override per character
    }
    ```
  - **Verify:** Box moves with WASD in scene.

- **Task 2.2: Archer Class**  
  - **You Provide:** `src/characters/Archer.ts` extending `BaseCharacter`.  
  - **Cursor Codes:** Archer-specific right-click for aiming.  
    ```ts
    import { BaseCharacter } from './BaseCharacter';
    export class Archer extends BaseCharacter {
      private isAiming: boolean = false;
      public onRightClick(): void {
        this.isAiming = !this.isAiming;
        console.log(`Aiming: ${this.isAiming}`); // Placeholder
      }
    }
    ```
  - **Verify:** Right-click toggles aiming (check console).

- **Task 2.3: Import Mixamo Archer Model**  
  - **You Provide:** Download FBX model + animations (idle, walk) from Mixamo, place in `assets/models/`.  
  - **Cursor Codes:** Load model into `Archer.ts` using Babylon.js SceneLoader.  
    ```ts
    BABYLON.SceneLoader.ImportMesh('', '../assets/models/', 'archer.fbx', this.scene, (meshes) => {
      this.mesh = meshes[0] as BABYLON.Mesh;
      this.mesh.scaling = new BABYLON.Vector3(0.01, 0.01, 0.01); // Adjust scale
    });
    ```
  - **Verify:** Archer model replaces box and moves with WASD.

- **Task 2.4: Basic Camera (Third-Person)**  
  - **You Provide:** `src/camera/CameraManager.ts` with empty class.  
  - **Cursor Codes:** Third-person camera following the Archer.  
    ```ts
    import * as BABYLON from '@babylonjs/core';
    export class CameraManager {
      private camera: BABYLON.FollowCamera;
      constructor(scene: BABYLON.Scene, target: BABYLON.Mesh) {
        this.camera = new BABYLON.FollowCamera('followCam', new BABYLON.Vector3(0, 5, -10), scene);
        this.camera.lockedTarget = target;
        this.camera.radius = 10;
        this.camera.heightOffset = 5;
        scene.activeCamera = this.camera;
      }
    }
    ```
  - **Verify:** Camera follows Archer smoothly.

✅ **Approval Checkpoint:** Archer moves with WASD, right-click toggles aiming, Mixamo model loads, and camera follows.

---

### **Milestone 3: Environment Setup**
*Purpose: Create a realistic map for combat.*

- **Task 3.1: Basic Terrain**  
  - **You Provide:** `src/environment/Terrain.ts` with empty class.  
  - **Cursor Codes:** Simple ground mesh with texture.  
    ```ts
    import * as BABYLON from '@babylonjs/core';
    export class Terrain {
      constructor(scene: BABYLON.Scene) {
        const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 50, height: 50 }, scene);
        const material = new BABYLON.StandardMaterial('groundMat', scene);
        material.diffuseTexture = new BABYLON.Texture('../assets/textures/grass.jpg', scene);
        ground.material = material;
      }
    }
    ```
  - **Verify:** Ground appears under Archer.

- **Task 3.2: Lighting**  
  - **You Provide:** Add to `src/core/Game.ts`.  
  - **Cursor Codes:** Add sun and shadows.  
    ```ts
    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), this.scene);
    light.intensity = 0.7;
    ```
  - **Verify:** Scene is lit realistically.

✅ **Approval Checkpoint:** Archer moves on textured terrain with proper lighting.

---

### **Milestone 4: Goblin Enemy Foundation**
*Purpose: Add the first enemy with extensible OOP.*

- **Task 4.1: Base Enemy Class**  
  - **You Provide:** `src/enemies/BaseEnemy.ts` with empty class.  
  - **Cursor Codes:** Abstract class with position and basic behavior.  
    ```ts
    import * as BABYLON from '@babylonjs/core';
    export abstract class BaseEnemy {
      protected mesh: BABYLON.Mesh;
      constructor(scene: BABYLON.Scene) {
        this.mesh = BABYLON.MeshBuilder.CreateBox('enemy', { size: 1 }, scene);
      }
      public abstract update(playerPos: BABYLON.Vector3): void; // AI logic
    }
    ```
  - **Verify:** Box spawns in scene.

- **Task 4.2: Goblin Class**  
  - **You Provide:** `src/enemies/Goblin.ts` extending `BaseEnemy`.  
  - **Cursor Codes:** Simple chase behavior.  
    ```ts
    import { BaseEnemy } from './BaseEnemy';
    export class Goblin extends BaseEnemy {
      public update(playerPos: BABYLON.Vector3): void {
        const direction = playerPos.subtract(this.mesh.position).normalize();
        this.mesh.position.addInPlace(direction.scale(0.05));
      }
    }
    ```
  - **Verify:** Goblin moves toward Archer.

- **Task 4.3: Import Mixamo Goblin Model**  
  - **You Provide:** Download FBX model + animations from Mixamo, place in `assets/models/`.  
  - **Cursor Codes:** Load into `Goblin.ts` (similar to Archer).  
  - **Verify:** Goblin model replaces box and chases.

✅ **Approval Checkpoint:** Goblin spawns, chases Archer, and uses Mixamo model.

---

### **Milestone 5: Combat Basics**
*Purpose: Enable Archer to fight Goblin.*

- **Task 5.1: Arrow System**  
  - **You Provide:** `src/combat/ArcherySystem.ts` with empty class.  
  - **Cursor Codes:** Arrow spawning on left-click while aiming.  
    ```ts
    export class ArcherySystem {
      private scene: BABYLON.Scene;
      constructor(scene: BABYLON.Scene) {
        this.scene = scene;
      }
      public shoot(startPos: BABYLON.Vector3, direction: BABYLON.Vector3): void {
        const arrow = BABYLON.MeshBuilder.CreateBox('arrow', { size: 0.5 }, this.scene);
        arrow.position = startPos.clone();
        this.scene.registerBeforeRender(() => {
          arrow.position.addInPlace(direction.scale(0.2));
        });
      }
    }
    ```
  - **Verify:** Arrows spawn and move when aiming + left-click.

- **Task 5.2: Hit Detection**  
  - **You Provide:** `src/combat/HitDetection.ts` with empty class.  
  - **Cursor Codes:** Basic collision check.  
    ```ts
    export class HitDetection {
      public checkHit(arrow: BABYLON.Mesh, enemy: BABYLON.Mesh): boolean {
        return arrow.intersectsMesh(enemy);
      }
    }
    ```
  - **Verify:** Arrow hitting Goblin logs to console.

✅ **Approval Checkpoint:** Archer shoots arrows that detect Goblin hits.

---

### **Next Steps**
- Add Warrior/Wizard with overridden right-click (e.g., Warrior swings sword).
- Expand enemies (e.g., Orc with different AI).
- Refine combat (damage, health, animations).

