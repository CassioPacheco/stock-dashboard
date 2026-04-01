# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Brazilian stock market dashboard built with Flask. Displays real-time data and technical analysis charts for PETR4.SA (Petrobras), ITUB4.SA (Itaú), and SANB11.SA (Santander Brasil) fetched from Yahoo Finance.

## Running the Application

```bash
python app.py
```

Starts Flask in debug mode at `http://localhost:5000`. No build step required.

## Dependencies

Install with:

```bash
pip install -r requirements.txt
```

Core packages: `flask`, `yfinance`, `plotly`, `pandas`

## Architecture

The app is intentionally minimal — three files do everything:

- **`app.py`** — All backend logic: data fetching, calculations, chart generation, and routing
- **`templates/index.html`** — Single-page template; receives pre-rendered Plotly JSON via Jinja2 and initializes charts client-side with Plotly.js

### Data flow

```
GET / → buscar_dados() [yfinance → DataFrames]
       → calcular_stats() [KPIs per stock]
       → grafico_*() [Plotly JSON, 4 charts]
       → render_template() injects JSON into HTML
       → browser runs Plotly.js to mount charts
```

### Key constants in `app.py`

- `ACOES` — maps display name → Yahoo Finance ticker
- `CORES` / `CORES_FILL` — per-stock brand colors
- `LAYOUT_BASE` — shared Plotly layout (fonts, grid, responsiveness)

Data is fetched for the fixed range `2025-01-01` to today on every page load — no caching layer exists.

## GitHub Repository

Repository: `https://github.com/CassioPacheco/stock-dashboard`

### Auto-sync

A Claude Code hook in `.claude/settings.local.json` automatically commits and pushes to `origin/main` after every file edit (`Edit`, `Write`, `NotebookEdit` tools). Each auto-commit message includes a timestamp: `Auto-update: YYYY-MM-DD HH:MM:SS`.

The hook runs asynchronously and does not block Claude Code. If there are no changes since the last commit, the push is skipped silently.
