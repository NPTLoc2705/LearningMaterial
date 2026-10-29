# Teacher Reporting Module

## [Reporting]
### Purpose
Provides aggregated learning progress reports for teachers: weak vocabulary ranking for classrooms, individual student progress drill-down, and assignment completion status.

### Endpoints
1. `GET /api/classrooms/{id}/reports/weak-vocabulary?lessonId=&minAttempts=3`:
   - Aggregated single query grouping `VocabularyProgress` over all active students enrolled in the classroom.
   - Ranked by `ErrorRate = WrongCount / (CorrectCount + WrongCount)` descending, then by total attempts descending.
   - Filtered by `minAttempts` threshold (defaults to 3).
2. `GET /api/classrooms/{id}/students/{studentId}/progress`:
   - Detailed progress items for a specific enrolled student.
3. `GET /api/classrooms/{id}/reports/completions?lessonId=`:
   - Summarizes which students have completed Learn activities, Practice activities, their best stars, and last completion date.

### Input / Output
| Endpoint | Method | Response DTO | Description |
|----------|--------|--------------|-------------|
| `/api/classrooms/{id}/reports/weak-vocabulary` | GET | `List<WeakVocabularyReportDto>` | Class weak words ranked by error rate |
| `/api/classrooms/{id}/students/{studentId}/progress` | GET | `List<StudentProgressReportDto>` | Per-student item progress drill-down |
| `/api/classrooms/{id}/reports/completions` | GET | `List<AssignmentCompletionReportDto>` | Student assignment completion table |

### Prerequisites / Context
- Access is strictly gated via `IClassroomAccessService.EnsureCanViewClassroomAsync`: teachers of other classrooms cannot access class reports (TC-12), returning 404 Not Found to prevent leaking classroom existence.
- Aggregation is performed in a single set-based query without per-student iteration (no N+1).
