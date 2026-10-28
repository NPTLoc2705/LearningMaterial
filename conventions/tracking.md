# Tracking-System Microservice Conventions — REFERENCE ONLY (`Ielts-System`)

> **NOTE (Reference Only — `Ielts-System`)**: Kept as historical reference. `Tracking-System/` is not used in this repository.

> **Scope**: Standalone analytics microservice in `Tracking-System/`.  
> **Key Principle**: Flat, self-contained architecture. It does **not** follow the full 5-layer pattern of `Ielts-System`.

---

## 1. Directory Structure

```
Tracking-System/Tracking-System/
├── Controllers/     <- Flat: all controllers directly here (no sub-feature folders)
├── Data/            <- TrackingDbContext.cs only
├── Models/          <- Plain C# model classes (no DAO/Service layers)
├── Migrations/      <- EF Core migrations
└── Program.cs       <- Service registration and app configuration
```

---

## 2. Rules & Boundaries

- **Flat Controllers**: All API endpoints live directly under `Tracking-System/Tracking-System/Controllers/{Name}Controller.cs`.
- **Direct Context Access**: Controllers query `TrackingDbContext` directly or via lightweight helpers.
- **Plain Models**: Models in `Models/` represent database entities directly without an abstracted DTO layer unless public serialization dictates it.
- **No Layer Creep**: Do **NOT** add a `Repository/` or `Service/` layer to `Tracking-System` without team discussion.
- **Isolated Registration**: Dependency injection and middleware are registered exclusively in `Tracking-System/Tracking-System/Program.cs`.
