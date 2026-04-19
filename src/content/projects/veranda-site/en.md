---
title: "Veranda"
date: 2026-03-21
description: "A multilingual personal website built with Astro, designed around the Digital Manuscript aesthetic — extreme structural austerity and monospaced rhythm."
tags: ["Astro", "TypeScript", "Docker"]
thumbnail: "/media/projects/veranda-site/thumb.jpg"
externalUrl: "https://github.com/frchandra/veranda"
---

## Overview

Veranda is a multilingual personal website that serves as a living experiment in digital restraint. Built with Astro and styled with a custom design system called "Digital Manuscript," it prioritizes typographic precision, tonal layering, and structural clarity over decorative excess.

## Goals

The primary objective was to create a personal web presence that feels like a carefully typeset document rather than a conventional website. Every design decision — from the prohibition of rounded corners to the exclusive use of `Space Grotesk` for structural anchors — serves the philosophy of treating the screen as a manuscript page.

## Stack

- **Framework:** Astro with static site generation
- **Styling:** Tailwind CSS v4 with custom design tokens
- **i18n:** Custom translation pipeline supporting English, Indonesian, and Japanese
- **Deployment:** Docker + Nginx for self-hosted environments
- **Content:** Markdown-based content collections with per-language variants

## Approach

The content pipeline uses Astro's Content Collections with a glob loader, where each piece of content lives in a folder with language-specific markdown files (`en.md`, `id.md`, `ja.md`). This allows for independent translation workflows while sharing the same slug-based routing structure.
