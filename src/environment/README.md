# Environment Directory

This directory contains classes for managing the game environment.

- `Terrain`: Handles ground mesh and textures
- `Lighting`: Manages scene lighting and shadows
- `SkyBox`: Controls sky and atmosphere

Classes in this directory follow the Single Responsibility Principle, with each class focused on a specific aspect of the environment. The Liskov Substitution Principle is applied to ensure that specialized environment elements can replace base ones without affecting functionality. 