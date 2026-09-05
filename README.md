# Skybounders Launcher

Skybounders is a Windows-first Electron + TypeScript Minecraft Java launcher built around live Mojang metadata, real downloads, real process lifecycle state, Modrinth discovery, and legitimate Microsoft authentication.

## What is implemented in v0.1

- Real Electron desktop shell with custom title bar and polished dark/sky UI.
- Persistent launcher state using a local JSON store.
- Live Minecraft version manifest from Mojang's launcher metadata.
- Real vanilla version preparation: version JSON, client JAR, libraries, asset index and assets, with SHA-1 verification where metadata supplies it.
- Real download state and progress in the UI.
- Instance library and instance creation.
- Java launch pipeline through `@xmcl/core`.
- Game stdout/stderr forwarding and stop control.
- Modrinth live project search.
- CurseForge API integration when a legitimate API key is provided.
- Microsoft device-code sign-in with secure in-app token handling.
- Hardware detection and Potato/Balanced/Performance settings.
- Windows NSIS packaging.
- Unit test scaffold.

## Local development

```powershell
npm install
npm run dev
```

Production build:

```powershell
npm run build
npm run dist
```

## Microsoft authentication

Microsoft's supported OAuth device-code flow requires an Entra application registration. Put the public **client ID** in Settings → Accounts. Never put a Microsoft password or client secret into Skybounders. The app does not include a secret and never stores the Microsoft password.

## Notes

- Bedrock is intentionally not faked: v0.1 keeps the UI architecture ready for a legitimate Windows-managed flow, but does not pretend it can control unsupported Bedrock internals.
- CurseForge is wired only through its supported API and a user/organization supplied key; the key is persisted locally but never shipped in source.
- Loader workflows (Fabric/Forge/NeoForge/Quilt) are represented in instance creation, but v0.1's fully automated download/launch path is vanilla-first. Unsupported loader installs are reported rather than simulated.
- Offline/local profiles are not presented as authenticated Microsoft accounts.

## Architecture

`main` owns filesystem, downloads, game processes, authentication, persistence and integrations. `preload` exposes only narrow typed IPC methods. `renderer` owns visual state and navigation.

## License

MIT. Third-party services and assets retain their respective licenses and terms.
