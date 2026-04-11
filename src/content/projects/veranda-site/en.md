---
title: "Veranda"
date: 2026-03-21
description: "A multilingual personal website built with Astro, serving as a digital archive for writings, projects, and visual artifacts."
tags: ["Astro", "TypeScript", "Docker", "Nginx"]
thumbnail: "/media/projects/veranda-site/thumb.jpg"
externalUrl: "https://github.com/frchandra/veranda"
---

## Overview

Veranda is this very site — a statically generated multilingual personal website built with [Astro](https://astro.build/). It serves as a central hub for writing, technical projects, and photography.

## Goals

The primary goal was to build a fast, SEO-optimized static site that supports three languages (Indonesian, English, and Japanese) with fully manual translations. Content is managed by directly editing Markdown files and uploading media assets to the repository.

## Technical Stack

- **Framework:** Astro 5.x — static-first, zero JavaScript by default
- **Styling:** Tailwind CSS v4 with custom design tokens
- **Content:** Astro Content Collections with Zod schema validation
- **i18n:** Astro's built-in routing with a `/{lang}/` prefix strategy
- **Containerization:** Docker multi-stage build + Nginx for production serving

## Architecture

Content is organized using a folder-per-slug convention:

```
src/content/blog/{slug}/{lang}.md
src/content/projects/{slug}/{lang}.md
```

This makes it trivial to support partial translations — a post simply doesn't appear in a language's listing if its `.md` file doesn't exist.

## Lessons Learned

Building a multilingual static site without a CMS forces clarity in content architecture. The biggest challenge was the translation fallback UX — deciding when to show a "not available" notice versus silently hiding content.
