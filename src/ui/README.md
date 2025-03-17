# UI Directory

This directory contains user interface components.

- `HUD`: Heads-up display showing health, ammo, etc.
- `Menu`: Main menu, pause menu, settings
- `UIManager`: Manages UI state and transitions

Classes in this directory follow the Single Responsibility Principle, with each class handling a specific UI concern. The Dependency Inversion Principle is applied by having UI components depend on abstractions rather than concrete game implementations. 