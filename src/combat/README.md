# Combat Directory

This directory contains combat-related systems.

- `HitDetection`: Handles collision detection between projectiles and entities
- `DamageSystem`: Manages health, damage calculation, and effects
- `ArcherySystem`: Controls arrow spawning, physics, and trajectory

Classes in this directory follow the Interface Segregation Principle by providing specific interfaces for different combat mechanics. The Open/Closed Principle is applied to ensure new combat types can be added without modifying existing ones. 