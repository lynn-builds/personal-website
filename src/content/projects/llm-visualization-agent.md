---
title: LLM Visualization Agent
description: Bounded agentic workflow that turns time-series forecast data into chart recommendations and reusable dashboards.
date: "2026-06-01"
tags: [ml, dataviz, react, fullstack]
role: Full Stack Engineer
hideVisual: true
---
## Brief
Built an LLM-based agentic application for visualizing time-series sales forecasts. The system retrieves forecast data, applies deterministic business logic, and gives the model only the schema and sample context needed to recommend an appropriate chart.

## Problem
Forecast outputs were landing in analytical storage, but turning a new dataset into a useful dashboard still required engineers to inspect schemas, understand time-series shape, choose a chart, and wire the data into the interface.

## Approach
I designed the workflow around a strict boundary: the LLM recommends the visualization, while the application owns data access, business logic, and rendering.

## Highlights
- Built a function-call layer for retrieving forecast data and extracting schema plus representative sample rows.
- Scoped the reasoning layer so the LLM interpreted data shape and trends without generating application code.
- Mapped chart recommendations to reusable React, TypeScript, and ECharts components.
- Kept orchestration deterministic so the product flow stayed testable and explainable.

## Outcome
Delivered a working prototype that established a repeatable path from forecast data to rendered dashboard. The prototype was selected for productionization after an executive demonstration.

## Stack
LLMs, Google BigQuery, React, TypeScript, ECharts, deterministic orchestration, function calling.
