# Assets Directory

This directory contains all game assets.

- `models/`: 3D models from Mixamo (character models, animations)
- `textures/`: Texture files for terrain, characters, etc.
- `sounds/`: Sound effects and music
- `AssetManager.ts`: Class for loading and managing game assets

The AssetManager class follows SOLID principles by encapsulating asset loading logic and providing a clean interface for other game components to access resources without needing to know the details of how assets are loaded or stored. 