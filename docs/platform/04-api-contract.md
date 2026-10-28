# 04 — API Contract (REST, JSON)

Base: `/api`. Auth: `Authorization: Bearer <JWT>`. **Every endpoint is `[Authorize]` unless marked Public.** The complete public whitelist is: `POST /auth/login`, `GET /access/class/{token}`, `POST /access/class/{token}/enter`, `GET /health`.
Roles: **A**=Admin, **T**=Teacher (must belong to the classroom via `ClassroomStaff`, enforced by `IClassroomAccessService`), **S**=Student (must be enrolled).
Never accept `userId`/`studentId` from the client for "own" resources — use `/me` routes and JWT claims.
Errors: RFC 7807 `ProblemDetails` (`400` validation, `401`, `403`, `404`, `409` conflict, `422` publish-validation with `errors[]`).
Lists: `?page=1&pageSize=20` (max 100) → `{ items, page, pageSize, totalCount }`.

## Auth & users
| Method | Route | Roles | Notes |
|---|---|---|---|
| POST | `/auth/login` | Public | rate-limited; returns `{ accessToken, expiresAt, user }` |
| GET | `/auth/me` | any | current user |
| POST | `/auth/change-password` | any | required when `MustChangePassword` |
| POST | `/admin/users` | A | create Teacher/Admin |
| PATCH | `/admin/users/{id}` | A | activate/deactivate, reset password |
| POST | `/classrooms/{id}/students` | A,T | create Student account **and** enroll (temp password returned once) |

## Young-group access (class link)
| Method | Route | Roles | Notes |
|---|---|---|---|
| POST | `/classrooms/{id}/access-link` | A,T | create/rotate (revokes previous); returns the full link **once** |
| DELETE | `/classrooms/{id}/access-link` | A,T | revoke |
| GET | `/access/class/{token}` | Public | `{ classroomName, profiles:[{studentId,nickname,avatarKey}] }`; unknown/revoked token → 404; rate-limited |
| POST | `/access/class/{token}/enter` | Public | `{ studentId }` → JWT (Student, ClassLink); studentId must belong to that class; rate-limited |

## Levels & classrooms
| GET | `/levels` | any | 9 seeded levels incl. group + settings |
|---|---|---|---|
| GET | `/classrooms` | A,T,S | scoped by role (T: mine; S: enrolled) |
| POST | `/classrooms` | A,T | `{ name, levelId, termName? }` (creator becomes Lead) |
| GET/PUT | `/classrooms/{id}` | A,T(+S read) | |
| POST | `/classrooms/{id}/archive` | A,T | |
| GET | `/classrooms/{id}/students` | A,T | |
| POST/DELETE | `/classrooms/{id}/enrollments[/{studentId}]` | A,T | enroll / mark Left |
| POST/DELETE | `/classrooms/{id}/staff[/{teacherId}]` | A,T(Lead) | |

## Content (teacher side)
| Method | Route | Roles | Notes |
|---|---|---|---|
| GET | `/lessons?levelId&status&q` | A,T | S gets only assigned+Published via `/me/assignments` |
| POST | `/lessons` | A,T | `{ levelId, unitNo, lessonNo, title }` → Draft; unique per level/unit/lesson |
| GET/PUT | `/lessons/{id}` | A,T | |
| POST | `/lessons/{id}/publish` | A,T | **422** with `errors[]` if `ContentValidator` fails |
| POST | `/lessons/{id}/archive` | A,T | |
| POST | `/lessons/{id}/duplicate` | A,T | P1 |
| POST | `/lessons/{id}/extractions` | A,T | multipart PDF/PPTX ≤ 20 MB → `202 { jobId }`; file is temporary |
| GET | `/extractions/{jobId}` | A,T | status + `draft` (vocabulary w/ image preview URLs, sentence patterns, ignored-pages summary, validator warnings) |
| PUT | `/extractions/{jobId}/draft` | A,T | teacher edits the draft |
| POST | `/extractions/{jobId}/approve` | A,T | writes items to the lesson, deletes temp file; idempotent |
| DELETE | `/extractions/{jobId}` | A,T | discard + delete temp file |
| POST | `/vocabulary/{id}/image` | A,T | replace/upload an image (PNG/JPEG/WebP ≤ 2 MB → re-encoded) |
| GET | `/media/{imageKey}` | A,T,S | returns a short-lived signed URL (authorized: student must be allowed to see a lesson using it) |
| GET/POST | `/lessons/{id}/vocabulary` | A,T | |
| PUT/DELETE | `/vocabulary/{id}` | A,T | |
| POST | `/lessons/{id}/vocabulary/bulk` | A,T | P1 (CSV) |
| GET/POST | `/lessons/{id}/grammar-topics` | A,T | |
| PUT/DELETE | `/grammar-topics/{id}` | A,T | |
| POST/PUT/DELETE | `/grammar-topics/{id}/rules`, `/rules/{id}`, `/rules/{id}/examples` | A,T | |
| GET/POST | `/grammar-topics/{id}/questions` | A,T | body includes `options[]` |
| PUT/DELETE | `/questions/{id}` | A,T | |

## Assignment
| POST | `/classrooms/{id}/assignments` | A,T | `{ lessonId, dueAt? }`; lesson must be Published and level-matched |
|---|---|---|---|
| GET | `/classrooms/{id}/assignments` | A,T | |
| GET | `/me/assignments` | S | assigned + Published lessons across enrolled classes |
| GET | `/me/lessons/{id}` | S | lesson hub: vocabulary count, grammar topics, my progress (no answers) |

## Learning sessions (student)
| Method | Route | Notes |
|---|---|---|
| POST | `/sessions` | `{ lessonId, activityType, classroomId?, grammarTopicId? }` (activity must be in the level's `EnabledActivities`). → `{ sessionId, mode, questions[] }`. Questions contain **no** correct answers. Shuffled. Options carry `key`. |
| POST | `/sessions/{id}/answers` | `{ sessionQuestionId, answer }`. **Practice:** `{ isCorrect, correctAnswer, explanation }`. **Test:** `{ saved: true }`. Idempotent (same body on repeat). |
| POST | `/sessions/{id}/complete` | → `{ correct, total, stars?, scorePercent? , review[] }` — `scorePercent` only when the level shows percentages; `Learn` sessions complete without questions (review only now, includes answers+explanations). Idempotent. |
| GET | `/sessions/{id}/result` | owner only |
| GET | `/me/sessions` | paged history |
| GET | `/me/review` | weak vocabulary + weak grammar topics for me |

Question payload for listen-type questions includes `speakText`. `answer` shapes: multiple-choice `{ "key": "412" }` · typed `{ "text": "gloves" }` · sentence-order `{ "keys": ["7","3","9"] }`.

## Reports (teacher)
| GET | `/classrooms/{id}/reports/overview` | completion, avg score (P1 → S5) |
|---|---|---|
| GET | `/classrooms/{id}/reports/weak-vocabulary?lessonId&minAttempts=3` | items ranked by error rate |
| GET | `/classrooms/{id}/reports/weak-grammar` | topics ranked by avg score |
| GET | `/classrooms/{id}/students/{studentId}/progress` | per-student detail (student must be enrolled in that class) |

## Authorization matrix (tested automatically in S1-T11 / S5-T02)
| Resource | Student | Teacher (in class) | Teacher (other class) | Admin |
|---|---|---|---|---|
| Own sessions/results | ✅ | — | — | ✅ |
| Another student's results | ❌ | ✅ (own class only) | ❌ | ✅ |
| Draft lessons | ❌ | ✅ | ✅ (lessons are level-shared) | ✅ |
| Class reports | ❌ | ✅ | ❌ | ✅ |
| Extraction drafts | ❌ | ✅ (own jobs) | ❌ | ✅ |
| Class link profiles | token holder (public, nickname/avatar only) | ✅ | ✅ | ✅ |
