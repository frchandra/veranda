---
title: "Veranda"
date: 2026-03-21
description: "Situs web personal multibahasa yang dibangun dengan Astro, berfungsi sebagai arsip digital untuk tulisan, proyek, dan artefak visual."
tags: ["Astro", "TypeScript", "Docker", "Nginx"]
thumbnail: "/media/projects/veranda-site/thumb.jpg"
externalUrl: "https://github.com/frchandra/veranda"
---

## Gambaran Umum

Veranda adalah situs ini sendiri — sebuah situs web personal multibahasa yang dihasilkan secara statis menggunakan [Astro](https://astro.build/). Situs ini berfungsi sebagai pusat untuk tulisan, proyek teknis, dan fotografi.

## Tujuan

Tujuan utamanya adalah membangun situs statis yang cepat dan dioptimalkan untuk SEO, mendukung tiga bahasa (Indonesia, Inggris, dan Jepang) dengan terjemahan yang sepenuhnya manual. Konten dikelola dengan langsung mengedit file Markdown dan mengunggah aset media ke repositori.

## Tumpukan Teknologi

- **Framework:** Astro 5.x — static-first, tanpa JavaScript secara default
- **Styling:** Tailwind CSS v4 dengan token desain kustom
- **Konten:** Astro Content Collections dengan validasi skema Zod
- **i18n:** Perutean bawaan Astro dengan strategi awalan `/{lang}/`
- **Containerisasi:** Docker multi-stage build + Nginx untuk serving produksi

## Arsitektur

Konten diorganisir menggunakan konvensi folder-per-slug:

```
src/content/blog/{slug}/{lang}.md
src/content/projects/{slug}/{lang}.md
```

Ini memudahkan dukungan terjemahan parsial — sebuah tulisan tidak akan muncul dalam daftar bahasa tertentu jika file `.md`-nya tidak ada.

## Pelajaran yang Dipetik

Membangun situs statis multibahasa tanpa CMS memaksa kejelasan dalam arsitektur konten. Tantangan terbesar adalah UX fallback terjemahan — memutuskan kapan harus menampilkan pemberitahuan "tidak tersedia" versus menyembunyikan konten secara diam-diam.
