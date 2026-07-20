# SOLID Principles: Online Shopping System

**Concept:** SOLID design principles, refactoring a monolithic class
**Module:** Advanced Object-Oriented Programming
**File:** `artefact_solid_shopping.py`

## Objective

Take a single, tightly-coupled `Order` class that mixes cart management with
payment logic, and refactor it so the result fully complies with all five
SOLID principles — without losing any functionality.

## The "before" problem

`_OrderBefore` (kept in the file purely for contrast) manages cart items
*and* decides how to charge the customer using an `if/elif` on a string:

```python
def pay(self, payment_type):
    if payment_type == "credit":
        print("Processing credit card payment...")
    elif payment_type == "paypal":
        print("Processing PayPal payment...")
    # adding a new method means editing this class — OCP violation
```

This single method violates Single Responsibility (order management *and*
payment), Open/Closed (every new payment type means editing existing code),
and Dependency Inversion (depends on a string, not an abstraction).

## How the refactor maps to SOLID

| Principle | Where it shows up |
|---|---|
| **S**ingle Responsibility | `Order` only manages cart items and totals; payment logic lives in `PaymentMethod` implementations |
| **O**pen/Closed | `CryptoPayment` is added as a new class with **zero edits** to `Order`, `PaymentMethod`, or any existing payment class |
| **L**iskov Substitution | `CreditCardPayment`, `PayPalPayment`, and `CryptoPayment` are all fully interchangeable wherever `PaymentMethod` is expected |
| **I**nterface Segregation | `PaymentMethod` and `DiscountStrategy` each expose exactly one focused method |
| **D**ependency Inversion | `Order`'s constructor accepts `DiscountStrategy` and `PaymentMethod` *abstractions*, never concrete classes |

A small Strategy pattern (`DiscountStrategy`) and a Null Object
(`NoDiscount`) are used alongside SOLID: `NoDiscount` means `Order` never has
to check "is there a discount?" with an `if discount is not None`, which
keeps `calculate_discounted_total()` free of defensive branching.

## How it works

```python
class CryptoPayment(PaymentMethod):
    """New payment method added WITHOUT modifying any existing class."""
    def pay(self, amount: float) -> bool:
        print(f"  [Crypto] Sending £{amount:.2f} to wallet {self._wallet[:8]}…")
        return True
```

`Order` never imports or references `CryptoPayment` directly — it only knows
about `PaymentMethod`. The demo script proves this by constructing an `Order`
with the new payment type and checking out successfully, having changed
nothing else in the file.

## Benefits demonstrated

- Each class is independently testable and has one reason to change.
- New payment methods or discount types can be added by *any* developer
  without touching, or even reading, the existing `Order` implementation.
- The Null Object pattern removes a whole category of `None`-check bugs.

## Trade-offs

For a system that will only ever support two payment types, four classes is
more machinery than a single `if/elif`. The abstraction is justified here
specifically because the brief calls for extensibility — a requirement that
makes the `if/elif` approach collapse as soon as a third or fourth payment
method appears.

## Run

```bash
python solid_shopping.py
```

Runs three scenarios: a card payment with a percentage discount, a PayPal
payment with a fixed-amount voucher, and a brand-new crypto payment method
added without modifying any existing class.
