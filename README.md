# 🍌 Nabo Quiz - Project Architectural Overview

A localized, high-performance web quiz platform engineered to test and validate knowledge about **Panabo City, Davao del Norte** (the Banana Capital of the Philippines). This system decouples raw historical datasets from UI logic, ensuring instantaneous question delivery, secure session resumption, and complete focus state maintenance.

---

## 🎯 Primary Project Purpose

* **Cultural & Historical Engagement:** Serves as an educational community tool to promote local history, regional milestones (such as Panabo's transformation from a municipal district of Tagum into an independent component city), native geography, and socio-economic achievements (e.g., TADECO's agricultural impact).
* **Resilient User Session Control:** Leverages custom-built browser telemetry loops to protect game progress from abrupt browser reloads, connection loss, or hardware interruptions.
* **Integrity Gatekeeping:** Restricts unintended exit patterns—such as browser back arrows or edge swipes—locking execution strictly into the application state machine until the core gameplay loop naturally terminates.

---

## 💻 Core Technical Stack

The architecture is built on a clean, decoupled utility-first micro-frontend ecosystem:

| Layer / Dependency | Technology Chosen | System Responsibility |
| :--- | :--- | :--- |
| **User Interface Core** | `React 18` (Functional Components & Hooks) | Orchestrates reactive client-side rendering trees, handles internal state mechanics (`useState`, `useEffect`), and manages the question data parsing pipelines. |
| **Routing Engine** | `React Router v6` (`createBrowserRouter`) | Implements explicit decoupled view boundaries, handles secure data state parsing between views, and intercepts programmatic path history states. |
| **Styling Architecture** | `Tailwind CSS` (Utility-First Compilation) | Handles UI layouts, premium interaction feedback animations (green/red border validations), and smooth transformations. |
| **Persistent Context** | `Web Storage API` (`localStorage`) | Mirrors game state tokens asynchronously (`userID`, `quiz_score`, `current_index`) to preserve session state. |
| **Development Engine** | `Vite` + `ESbuild` | Powers hot-module replacement (HMR), resolves raw `.json` datasets directly into optimization arrays, and compiles lightweight production bundles. |