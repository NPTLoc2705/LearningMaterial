# /dev-platform — Start Local Dev Servers

Starts the full local development environment for the Junior English Learning Platform: .NET 9 API + React/Vite frontend.

## Usage
```
/dev-platform [api|frontend|all]
```

### Terminal 1 — LearningPlatform API (.NET 9)
```bash
cd server/LearningPlatform/LearningPlatform.Api
dotnet run
```

### Terminal 2 — React Frontend (Vite, port 5173)
```bash
npm run dev
```

