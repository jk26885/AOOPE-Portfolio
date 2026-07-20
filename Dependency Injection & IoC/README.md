# Dependency Injection & Inversion of Control

**Concept:** Constructor injection, IoC container, Composite
**Module:** Advanced Object-Oriented Programming
**File:** `dependency_injection.py`

## Objective

Refactor a class that creates its own dependency internally — making it
slow and brittle to test — into a design where dependencies are supplied
from outside, and demonstrate a minimal IoC container that wires everything
together.

## The "before" problem

```python
class _UserManagerBefore:
    def __init__(self):
        self.notifier = _EmailServiceBefore()   # ← direct, hidden dependency
```

Every test of `_UserManagerBefore.register_user()` would send a real email.
Swapping email for SMS means editing this class. Both are symptoms of the
same root cause: `UserManager` is responsible for *deciding* how to notify
users, not just for *using* a notifier.

## The fix: constructor injection

```python
class UserManager:
    def __init__(self, notifier: NotificationService):   # injected, not instantiated
        self._notifier = notifier
```

`UserManager` now depends on the `NotificationService` abstraction only.
`EmailService`, `SMSService`, `PushNotificationService`, and the Composite
`MultiChannelService` (which fans a single notification out to several
channels at once) are all fully interchangeable behind that interface.

## IoC container

`DIContainer` is a small, pure-stdlib container that mirrors the core idea
of libraries like `dependency-injector`:

```python
container.register("notifier", lambda: EmailService())
container.register("user_manager", lambda: UserManager(container.resolve("notifier")))
mgr = container.resolve("user_manager")
```

It supports both **singleton** (same instance returned every time) and
**transient** (a fresh instance per `resolve()`) lifetimes, and centralises
the responsibility for wiring the application graph — `UserManager` no
longer needs to know how to build a notifier at all.

## Benefits demonstrated

- **Zero changes to `UserManager`** when swapping notifiers — proven directly
  by `test_swap_to_sms_without_changing_user_manager`.
- **Fast, deterministic tests** — `MockNotificationService` records calls
  in memory; no real email or SMS is ever sent during the test suite.
- **Composite notifications** — `MultiChannelService` lets a single
  `register_user()` call notify by email *and* SMS *and* push, with the
  caller (`UserManager`) completely unaware of the fan-out.

```python
def test_register_sends_welcome_notification(self):
    mock = MockNotificationService()
    mgr  = UserManager(notifier=mock)
    mgr.register_user("alice")
    self.assertEqual(len(mock.calls), 1)
    self.assertIn("Welcome", mock.calls[0][1])
```

## Trade-offs

A hand-rolled `DIContainer` is simpler to read and audit than a full
third-party DI framework, but it doesn't support more advanced features
(scoped lifetimes, auto-wiring by type annotation, circular-dependency
detection). For a codebase of this size, the simplicity is the right
trade-off; a larger system might justify a dedicated library.

## Run

```bash
python -m pytest dependency_injection.py -v   # 10 tests
python dependency_injection.py                # demo: email-only, SMS-only, multi-channel
```
