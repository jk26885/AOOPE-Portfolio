# Secure E-Learning Platform (Test-Driven Development)

**Concept:** TDD (Red → Green → Refactor), RBAC, secure registration
**Module:** Advanced Object-Oriented Programming
**File:** `elearning.py`

## Objective

Build a layered e-learning platform — user management, course management,
enrolment — using genuine Test-Driven Development, so that every behaviour
is specified by a test *before* the implementation exists.

## TDD cycle followed

For `UserManagementService`, all 11 tests in `TestUserManagement` were
written first, with no service implementation behind them:

1. **Red** — running the suite confirmed every test failed (the class
   didn't exist yet).
2. **Green** — `UserManagementService` was implemented one method at a time,
   only writing enough code to make the next failing test pass.
3. **Refactor** — password hashing logic was pulled out into the shared
   `secure_hash` / `verify_hash` utility functions once duplication appeared
   between registration and authentication.

This discipline prevents "gold-plating" — code that does more than any test
requires — because nothing is written without a test demanding it first.

## Why TDD suits authentication code specifically

Security-sensitive behaviour has to be specified precisely, not just
"working":

```python
def test_register_stores_hashed_password(self):
    u = self.service.register("bob", "bob@edu.com", "Password1!")
    self.assertNotEqual(u._hash, "Password1!")   # must never store plain text
    self.assertTrue(len(u._hash) > 32)           # must actually be a hash, not the input
```

Writing this test *before* the code forces the question "what does 'hashed'
actually mean operationally?" before any implementation exists to hide
behind.

## Role-based access control

Three roles (`STUDENT`, `INSTRUCTOR`, `ADMIN`) gate specific operations —
for example, only instructors can create a course:

```python
def test_student_cannot_create_course(self):
    with self.assertRaises(PermissionError):
        self.courses.create_course("Hack", "desc", self.student.user_id)
```

## Architecture: layered monolith (justified)

A single, well-modularised codebase was chosen over microservices:

- **Scalability** — modules (`UserManagementService`, `CourseManagementService`,
  `EnrolmentService`) are already loosely coupled through repositories, so
  extraction to separate services later is mechanical, not a redesign.
- **Maintainability** — each module has one clear responsibility.
- **Security** — hashed passwords (PBKDF2-HMAC-SHA256), regex-validated
  email addresses, and role checks are enforced centrally rather than
  scattered across services.

## Benefits demonstrated

- 21 tests written ahead of implementation, covering registration,
  authentication, deactivation, course publishing, and the full enrolment
  lifecycle (enrol → progress → auto-complete at 100%).
- Defensive validation throughout: duplicate usernames, invalid emails, short
  passwords, and out-of-range progress values all raise before any state
  changes.

## Trade-offs

TDD has an upfront cost — writing and running a failing test before any
production code exists feels slower in the moment. The payoff is a test
suite that *specifies* the system, catching regressions and ambiguous
requirements (e.g. "should progress over 100 raise, or clamp?") at design
time rather than in production.

## Run

```bash
python -m pytest elearning.py -v   # 21 tests
python elearning.py                # runs tests, then the demo
```
