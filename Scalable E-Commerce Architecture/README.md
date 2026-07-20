# ShopEase: Scalable OOP E-Commerce Architecture

**Concept:** Layered architecture, Observer, Repository, Dependency Injection
**Module:** Advanced Object-Oriented Programming
**File:** `shopease.py`

## Objective

Design a modular e-commerce backend that separates presentation, business
logic, and data access into independent layers, so that any one layer
(e.g. the storage technology, or the UI) can be replaced without touching
the others.

## Architecture

```
ShopEaseCLI              (Presentation — simulates a web/mobile controller)
   │  delegates to
AuthService / CatalogueService / OrderService   (Business Logic)
   │  delegates to
UserRepository / ProductRepository / OrderRepository   (Data Access — in-memory)
```

Each layer only knows about the layer directly below it through an
interface-like contract, never reaching across layers. `OrderService`, for
example, never touches a repository's internal dictionary — it calls
`save()` and `find_by_id()`.

## Patterns used

- **Repository** — `UserRepository`, `ProductRepository`, and
  `OrderRepository` hide storage details behind `save()` / `find_by_id()` /
  `search()`. Swapping the in-memory `dict` for PostgreSQL means rewriting
  these three classes only; `OrderService` and the CLI are untouched.
- **Observer (`EventBus`)** — services `publish()` events
  (`order.placed`, `product.out_of_stock`, `user.registered`) without
  knowing who, if anyone, is listening:

  ```python
  bus.subscribe("order.placed", lambda e, p: print(f"📦 Confirmation sent for order {p['order_id']}"))
  ```

  A new notification channel (SMS, Slack, analytics) is added by calling
  `subscribe()` once — no existing publisher code changes.
- **Strategy (`PaymentGateway`)** — `OrderService` depends on the
  `PaymentGateway` abstraction, not a concrete provider, so a real payment
  SDK can replace `MockPaymentGateway` later with no change to order logic.
- **Dependency Injection** — every service receives its repository and the
  event bus through its constructor; nothing is instantiated internally.

## Security

Passwords are never stored in plain text:

```python
def hash_password(password: str, salt: bytes | None = None) -> tuple[str, str]:
    if salt is None:
        salt = os.urandom(16)
    key = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 260_000)
    return key.hex(), salt.hex()
```

PBKDF2-HMAC-SHA256 with 260,000 iterations follows NIST SP 800-63B guidance.
Verification uses `hmac.compare_digest`, a constant-time comparison that
prevents timing side-channel attacks on the stored hash.

## Benefits demonstrated

- Business rules cannot be bypassed by talking to the data layer directly —
  there is no path from the CLI to a repository that skips a service.
- A failure in a notification listener (e.g. an email service outage) does
  not roll back the order itself, since publishing is fire-and-forget.
- Every service is unit-testable in isolation by injecting fake repositories
  or a fake `EventBus`.

## Trade-offs

The layered-monolith style adds indirection (CLI → service → repository) for
operations that, in a tiny app, could be one function. The cost is justified
once the system needs independent evolution of storage, business rules, and
presentation — which is the explicit goal of this artifact.

## Run

```bash
python ashopease.py
```

Seeds a small catalogue, registers and logs in a user, places an order, and
ships it — printing the Observer-driven notifications at each step.
