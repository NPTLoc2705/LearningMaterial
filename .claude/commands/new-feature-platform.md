# /new-feature-platform — Scaffold N-Layer Files for a New Feature

Creates the 5-layer backend files (`BO → DAL → Repository → Service → Api`) inside `server/LearningPlatform/`.

## Usage
```
/new-feature-platform <FeatureName> <FeatureGroup>
```

Example: `/new-feature-platform Lesson ContentManagement`

| Layer | Path |
|---|---|
| BusinessObject | `server/LearningPlatform/BusinessObject/{FeatureGroup}/{FeatureName}.cs` |
| DAL | `server/LearningPlatform/DAL/{FeatureGroup}/{FeatureName}DAO.cs` |
| Repository (interface) | `server/LearningPlatform/Repository/{FeatureGroup}/I{FeatureName}Repository.cs` |
| Repository (impl) | `server/LearningPlatform/Repository/{FeatureGroup}/{FeatureName}Repository.cs` |
| Service (interface) | `server/LearningPlatform/Service/{FeatureGroup}/I{FeatureName}Service.cs` |
| Service (impl) | `server/LearningPlatform/Service/{FeatureGroup}/{FeatureName}Service.cs` |
| Controller | `server/LearningPlatform/LearningPlatform.Api/Controllers/{FeatureName}sController.cs` |

Register all three (`DAO`, `I{FeatureName}Repository`, `I{FeatureName}Service`) with `AddScoped` in `server/LearningPlatform/LearningPlatform.Api/Program.cs`.

