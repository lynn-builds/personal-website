---
title: Static Frame Filtering for AI Video Analysis
description: GPU-accelerated filtering experiment that reduced unnecessary video processing while preserving fall-event recall.
date: "2026-05-15"
tags: [ml, dataviz, performance, python]
role: AI Pipeline Engineer
---
## Brief
Drove evaluation and productionization of GPU-accelerated static-frame filtering for an AI video analysis pipeline.

## Problem
Long videos contained large amounts of static footage. Processing every frame increased downstream GPU work and latency, but overly aggressive filtering could remove an important event. Recall had to remain the primary constraint.

## Approach
I framed a recall-first evaluation, selected representative camera conditions, implemented candidate filtering methods, and used Plotly comparisons to make trade-offs explicit for engineering and model partners.

## Highlights
- Compared KNN, MOG2, and frame differencing against recall-first criteria.
- Analyzed approximately 120 real-world videos across varied camera profiles.
- Visualized threshold sensitivity, recall, retained-frame rate, and processing time in Plotly.
- Implemented GPU acceleration and adaptive behavior for different camera categories.

## Outcome
The selected approach achieved 100% recall on 144 annotated fall frames and improved a representative preprocessing run by up to 3.1x versus CPU.

## Stack
Python, OpenCV/CUDA, MOG2, KNN, frame differencing, Plotly, GPU processing.
