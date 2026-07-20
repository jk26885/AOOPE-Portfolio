# Thread-Safe Banking System

**Concept:** Concurrency control — mutual exclusion, reentrant locking, deadlock prevention
**Module:** Advanced Object-Oriented Programming
**Files:** `banking_system.py`, `test_banking_system.py`

## Objective

Design and implement a concurrent banking system in which many threads can deposit,
withdraw, and transfer funds at the same time, without corrupting account balances
and without the system ever deadlocking.

## Why this approach

Naively incrementing a shared `_balance` attribute from multiple threads is a
classic race condition: two threads can both read the old balance before either
writes the new one, silently losing an update. The fix is mutual exclusion — but
mutual exclusion introduces a new risk, deadlock, the moment two locks are
involved (e.g. transferring between two accounts).

Two design decisions address both problems:

- **`threading.RLock` instead of `threading.Lock`.** A reentrant lock lets the
  *same* thread re-acquire a lock it already holds. This matters because some
  internal methods call each other while still holding the lock; a plain `Lock`
  would self-deadlock in that situation.
- **Ordered lock acquisition in `transfer()`.** Deadlock requires four
  conditions to hold simultaneously (Coffman et al., 1971), one of which is
  *circular wait*. `transfer()` always acquires the lock belonging to the
  account with the lexicographically smaller `account_number` first, for every
  transfer, in every thread. This makes circular wait impossible, because no
  two threads can ever be waiting on each other's locks in opposite order.

## How it works

```python
first, second = (
    (source, destination) if source.account_number < destination.account_number
    else (destination, source)
)
with first._lock:
    with second._lock:          # consistent global order breaks circular wait
        source._balance -= amount
        destination._balance += amount
```

Every public method on `BankAccount` (`deposit`, `withdraw`, `get_balance`)
acquires `self._lock` before touching `_balance`, so single-account operations
are safe by construction. `transfer()` is the only place two locks are held at
once, which is exactly where the ordering rule is applied.

`TransactionSimulator` spins up a configurable number of threads, each
performing a random mix of deposits, withdrawals, and transfers, to exercise
the locking under realistic contention.

## Benefits demonstrated

- **Correctness under concurrency** — verified, not assumed.
- **Encapsulation** — `_balance` and `_lock` are never exposed; all mutation
  goes through validated public methods.
- **Defensive validation** — `InvalidAmountError` and `InsufficientFundsError`
  reject bad input before any state is touched.
- **Auditability** — every operation appends to `_transaction_log`, returned
  as a defensive copy so callers can't mutate internal state.

## Trade-offs

`RLock` carries marginal overhead versus a plain `Lock`, and coarse per-account
locking limits throughput compared to lock-free (CAS-based) designs used in
high-frequency trading systems. For a system whose priority is correctness and
auditability over microsecond-level latency, the simpler, provably
deadlock-free design is the right trade-off.

## Tests

26 unit tests in `test_banking_system.py`, including:

- Standard deposit/withdraw/validation paths
- Transaction log integrity (including copy-not-reference checks)
- **Concurrency tests** — 50 threads depositing simultaneously to the same
  account, asserted to sum *exactly*; without correct locking this test fails
  intermittently due to lost updates
- Mixed concurrent transfers between two accounts, asserting the combined
  total is conserved throughout

## Run

```bash
python banking_system.py              # runs the demo simulation
python -m pytest test_banking_system.py -v
```
