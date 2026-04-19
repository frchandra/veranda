---
title: "Veranda"
date: 2026-03-21
description: "Situs web pribadi multibahasa yang dibangun dengan Astro, dirancang dengan estetika Digital Manuscript — ketelitian struktural dan ritme monospace."
tags: ["Astro", "TypeScript", "Docker"]
thumbnail: "/media/projects/veranda-site/thumb.jpg"
externalUrl: "https://github.com/frchandra/veranda"
---

## Ikhtisar

Veranda adalah situs web pribadi multibahasa yang berfungsi sebagai eksperimen hidup dalam pengekangan digital. Dibangun dengan Astro dan diberi gaya dengan sistem desain khusus bernama "Digital Manuscript," proyek ini mengutamakan presisi tipografi, pelapisan tonal, dan kejelasan struktural di atas dekorasi berlebihan.

## Tujuan

Tujuan utama adalah menciptakan kehadiran web pribadi yang terasa seperti dokumen yang ditata dengan cermat, bukan situs web konvensional. Setiap keputusan desain — dari larangan sudut membulat hingga penggunaan eksklusif `Space Grotesk` untuk jangkar struktural — melayani filosofi memperlakukan layar sebagai halaman manuskrip.

## Teknologi

- **Framework:** Astro dengan pembuatan situs statis
- **Styling:** Tailwind CSS v4 dengan token desain khusus
- **i18n:** Pipeline terjemahan khusus yang mendukung Bahasa Inggris, Indonesia, dan Jepang
- **Deployment:** Docker + Nginx untuk lingkungan self-hosted
- **Konten:** Koleksi konten berbasis Markdown dengan varian per bahasa

## Pendekatan

Pipeline konten menggunakan Content Collections Astro dengan glob loader, di mana setiap konten berada dalam folder dengan file markdown khusus bahasa (`en.md`, `id.md`, `ja.md`). Ini memungkinkan alur kerja terjemahan independen sambil berbagi struktur routing berbasis slug yang sama.
