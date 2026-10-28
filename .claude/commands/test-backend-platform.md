# /test-backend-platform — Run Backend Tests

Runs the .NET 9 test suite in `server/LearningPlatform/`.

## Usage
```
/test-backend-platform [filter]
```

## Run all tests

```bash
dotnet test server/LearningPlatform/LearningPlatform.sln --verbosity normal
```

## Run tests matching a filter

```bash
dotnet test server/LearningPlatform/LearningPlatform.sln --filter "FullyQualifiedName~<filter>" --verbosity normal
```

