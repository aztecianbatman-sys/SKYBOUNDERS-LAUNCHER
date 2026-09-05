# Skybounders Launcher — upstream research

Skybounders uses its own launcher application code and data model. During architecture work, the project was reviewed against public Minecraft launcher projects for ideas around instance isolation, runtime selection, authentication, downloads, mod discovery, repair flows and desktop UX.

## XMCL / X Minecraft Launcher
Repository: https://github.com/Voxelum/x-minecraft-launcher
License: MIT.

Skybounders uses XMCL libraries for Minecraft process launching/installation rather than copying the XMCL application UI or source tree. Any future copied source must retain its original copyright and MIT notice.

## PrismLauncher
Repository: https://github.com/PrismLauncher/PrismLauncher

PrismLauncher was reviewed for instance-centric organization, separation of game data and reusable management workflows. Skybounders does not copy its source code into this repository.

## HeliosLauncher
Repository: https://github.com/dscalzi/HeliosLauncher

HeliosLauncher was reviewed for Electron launcher packaging, Microsoft account flows, metadata-driven version selection and launcher lifecycle patterns. Skybounders implements its own renderer and IPC layer.

## Service APIs

Minecraft version selection is driven by Mojang's launcher metadata. Mod discovery/version compatibility is connected to Modrinth's public API. CurseForge integration uses the application's configured CurseForge API key and the public API; the key is never hard-coded into the repository.

## Forking policy

GitHub repository forks are not imported blindly. Skybounders may vendor, adapt or fork an upstream component only when its license permits that distribution and the required notices are preserved. Otherwise, the project implements the required behavior independently.
