# Mocking & AI-Driven Testing

**Concept:** Test doubles (`unittest.mock`), testing AI-dependent components
**Module:** Advanced Object-Oriented Programming
**File:** `testing_mocking.py`

## Objective

Test classes that depend on an AI model — `ContentModerationService` and
`RecommendationEngine` — completely in isolation, with no live model call,
no network access, and no non-determinism in the test results.

## Why mock AI dependencies specifically

Real AI model APIs create four distinct problems for a test suite:

| Problem | Effect on testing |
|---|---|
| **Slow** | Network latency breaks fast TDD feedback loops |
| **Costly** | API calls are metered; a suite run thousands of times adds up |
| **Non-deterministic** | Model outputs vary between calls, so naive assertions become flaky |
| **Unavailable** | Offline development and CI/CD pipelines without secrets can't reach the API at all |

Mocking solves all four at once, while still validating the *integration*
logic — i.e. that the right prompt is sent, the right number of calls
happen, and the response is parsed correctly.

## How it works

```python
mock = MagicMock(spec=AIModelClient)
mock.predict.return_value = "UNSAFE: flagged"
svc = ContentModerationService(mock)
result = svc.moderate("...")
# tested in <1ms — no network call, no API cost or non-determinism
```

`spec=AIModelClient` constrains the mock to only the methods that actually
exist on the real interface, catching typos in test code the same way a
real type-checked call would. Both classes under test depend on the
abstract `AIModelClient`, never a concrete provider — they were already
written for dependency injection, which is exactly what makes them
mockable.

Two production classes are tested this way:

- **`ContentModerationService`** — verified for: safe content passed
  through unchanged, unsafe content blocked, the moderated-content counter
  incrementing correctly, an unavailable model raising `RuntimeError`, and
  the exact prompt text sent to `predict()`.
- **`RecommendationEngine`** — verified with hand-crafted embedding vectors
  (e.g. `[1,0]` vs `[0,1]`) so the expected cosine-similarity ranking is
  known in advance, with no real embedding model involved.

## AI-assisted test generation — reflection

A dedicated `TestEdgeCases` suite covers boundary conditions that AI-assisted
test generators (Pynguin, GitHub Copilot's test generation, Diffblue) are
particularly effective at surfacing: empty strings, very long input, Unicode
content, and injection-style strings. These tools are good at asking "what
happens at the boundary?" — but they cannot decide *what the correct
behaviour at that boundary should be*. Whether an empty string should be
silently accepted, rejected, or treated as "always safe" is an engineering
and product decision, not something a test generator can infer. AI-suggested
tests were treated here as a checklist of *cases to consider*, with the
actual expected behaviour decided and reviewed manually before being
encoded as an assertion.

## Benefits demonstrated

- **Speed** — the full suite (16 tests, including the AI edge cases) runs in
  well under a second; the file's own demo prints the measured elapsed time
  against an estimated 500ms–5s per call a real API would add.
- **Regression safety for AI-integrated code** — these tests catch
  regressions in the *code around* the model call (prompt construction,
  response parsing, counting, error handling) even if the underlying model
  itself changes or is temporarily unavailable.

## Trade-offs

Mocking validates integration logic, not model quality — a mock can never
tell you whether a real model's moderation judgement or embeddings are any
good. These tests are a complement to, not a replacement for, separate
evaluation of the actual model's output quality.

## Run

```bash
python testing_mocking.py   # 16 tests; prints elapsed time vs. estimated real-API cost
```
