# Advanced Object-Oriented Programming — E-Portfolio

A week-by-week e-portfolio covering SOLID principles, GoF design patterns,
concurrency-safe architecture, dependency injection, secure coding, and
AI-adapted software design, built across a 12-week module.

## Week structure

| Week | Topic | Content |
|---|---|---|
| 1 | Introduction | Foundational OOP pillars |
| 2 | SOLID Principles | SOLID shopping system |
| 3 | Factory Method (Creational Patterns) | Factory Method (cars) + Abstract Factory (AI providers) |
| 4 | Decorator (Structural Patterns) | Decorator service |
| 5 | Strategy (Behavioural Patterns) | Strategy pricing engine |
| 6 | Thread-Safe Banking | Concurrency, RLock, deadlock prevention |
| 7 | Secure Coding Practices | Password hashing, validation, RBAC |
| 8 | Refactoring & Code Smells | God Class and hidden-dependency refactors |
| 9 | Software Architecture | ShopEase layered architecture |
| 10 | TDD & Unit Testing | E-Learning platform (primary) + Visitor + Mocking (supplementary) |
| 11 | Dependency Injection & IoC | Constructor injection, IoC container |
| 12 | Capstone Project & Review | Links out to the full Capstone page |

## Folder structure

```
advanced-oop-eportfolio/
├── index.html                  Home page
├── about.html                  About this portfolio / author
├── capstone.html                Full Capstone submission (Tasks 1-4)
├── reflection.html              Task 3: Reflection on Skill Development
├── pdp.html                     Task 4: Professional Development Plan
├── references.html              Harvard-style reference list
│
├── weeks/
│   ├── week01.html
│   ├── week02-solid.html
│   ├── week03-factory-method.html
│   ├── week04-decorator.html
│   ├── week05-strategy.html
│   ├── week06-thread-safe-banking.html
│   ├── week07-secure-coding.html
│   ├── week08-refactoring.html
│   ├── week09-shopease.html
│   ├── week10-elearning.html
│   ├── week11-dependency-injection.html
│   └── week12.html
│
├── assets/
│   ├── css/
│   │   ├── styles.css          Base styles (fonts, layout, sidebar nav, cards, code blocks)
│   │   └── dark.css            Dark mode overrides, activated via [data-theme="dark"]
│   ├── js/
│   │   ├── app.js              Dark/light theme toggle, persisted in localStorage
│   │   └── search.js           Filters the sidebar nav as you type
│   ├── images/                 (empty — add screenshots/diagrams here)
│   ├── uml/                    (empty — add UML diagrams here)
│   └── icons/                  (empty — add custom icons here)
│
└── README.md
```

## ⚠️ Where do the `.py` files go?

Nine week pages link directly to a local `.py` file for download. **Place
each `.py` file inside `weeks/`, next to the HTML page that references it**:

```
weeks/
├── week02-solid.html
├── solid_shopping.py
├── week03-factory-method.html
├── factory_method_cars.py
├── week04-decorator.html
├── decorator_service.py
├── week05-strategy.html
├── strategy_pricing.py
├── week06-thread-safe-banking.html
├── banking_system.py
├── test_banking_system.py
├── week10-elearning.html
├── elearning.py
├── visitor_analytics.py
├── testing_mocking.py
├── week11-dependency-injection.html
└── dependency_injection.py
```

`week09-shopease.html` is the one exception — its badge links directly to
the file on GitHub rather than a local download, so no local `.py` file
is needed for that page. `week07-secure-coding.html` and
`week08-refactoring.html` reference code inline (excerpts from other
artefacts) rather than linking their own standalone file.

## Running it locally

No build step — open `index.html` directly in a browser, or serve the
folder with a local server (e.g. VS Code's Live Server extension, or
`python3 -m http.server` from inside `advanced-oop-eportfolio/`) for
auto-refresh while editing.

## Features

- **Sidebar navigation** with the current page highlighted, consistent
  across all 18 pages.
- **Dark mode** — toggle button in the sidebar; preference is remembered
  between visits via `localStorage`.
- **Sidebar search** — start typing in the search box above the nav
  links to filter them live; matches page titles and hidden keywords.
- **Fully static** — no build tools, frameworks, or server required.

## Hosting on GitHub Pages

1. Push this folder's contents to a GitHub repository.
2. Settings → Pages → Source: `Deploy from a branch`, branch `main`,
   folder `/ (root)`.
3. Your site will be live at
   `https://<your-username>.github.io/<your-repo-name>/` within a
   minute or two.
